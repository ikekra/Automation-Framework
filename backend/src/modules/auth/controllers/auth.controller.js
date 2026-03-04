import bcrypt from "bcrypt";
import { randomBytes, randomInt } from "node:crypto";
import speakeasy from "speakeasy";
import env from "../../../config/env.js";
import { AppError } from "../../../utils/AppError.js";
import { sendEmail } from "../../../utils/email.js";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { TokenBlacklist } from "../models/token-blacklist.model.js";
import {
  decodeTokenExpiry,
  getRefreshCookieOptions,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/token.js";

const formatLastLogin = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value?.toISOString === "function") {
    return value.toISOString();
  }

  return value;
};

const safeAuthResponse = ({ user, accessToken }) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    organization: user.organization || null,
    plan: user.plan || "Starter",
    phone: user.phone || null,
    lastLogin: formatLastLogin(user.lastLogin),
    totpEnabled: Boolean(user.totpEnabled)
  },
  accessToken
});

const buildVerifyEmailLink = (token) => {
  return `${env.appBaseUrl}/verify-email?token=${token}`;
};

const generateEmailVerificationToken = () => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.emailVerifyTtlHours * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
};

const generateEmailOtp = () => {
  const otp = String(randomInt(100000, 999999));
  const otpHash = hashToken(otp);
  const expiresAt = new Date(Date.now() + env.emailOtpTtlMinutes * 60 * 1000);
  return { otp, otpHash, expiresAt };
};

const sendVerificationEmail = async ({ email, token }) => {
  const link = buildVerifyEmailLink(token);
  await sendEmail({
    to: email,
    subject: "Verify your AutoForge email",
    text: `Verify your email using this link: ${link}\n\nOr use this token: ${token}`
  });
};

const sendOtpEmail = async ({ email, otp }) => {
  await sendEmail({
    to: email,
    subject: "Your AutoForge login code",
    text: `Your login code is ${otp}. It expires in ${env.emailOtpTtlMinutes} minutes.`
  });
};

const persistRefreshToken = async ({ rawToken, jti, expiresAt, userId, req }) => {
  await RefreshToken.create({
    userId,
    jti,
    expiresAt,
    tokenHash: hashToken(rawToken),
    userAgent: req.get("user-agent") || null,
    ipAddress: req.ip || null
  });
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(env.refreshCookieName, refreshToken, getRefreshCookieOptions());
};

export const register = async (req, res) => {
  const { name, email, password, organization, phone, plan } = req.body;

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const verification = generateEmailVerificationToken();

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "user",
    organization: organization || null,
    phone: phone || null,
    plan: plan || "Starter",
    lastLogin: new Date(),
    emailVerified: false,
    emailVerificationTokenHash: verification.tokenHash,
    emailVerificationTokenExpiresAt: verification.expiresAt
  });

  await sendVerificationEmail({ email, token: verification.token });

  res.status(201).json({
    success: true,
    data: safeAuthResponse({ user, accessToken: null })
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Email not verified", 403, { code: "EMAIL_NOT_VERIFIED" });
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion
  });

  const refreshPayload = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: user.tokenVersion
  });

  await persistRefreshToken({
    rawToken: refreshPayload.token,
    jti: refreshPayload.jti,
    expiresAt: refreshPayload.expiresAt,
    userId: user._id,
    req
  });

  setRefreshCookie(res, refreshPayload.token);

  res.status(200).json({
    success: true,
    data: safeAuthResponse({ user, accessToken })
  });
};

export const requestOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user && !user.emailVerified) {
    const verification = generateEmailVerificationToken();
    user.emailVerificationTokenHash = verification.tokenHash;
    user.emailVerificationTokenExpiresAt = verification.expiresAt;
    await user.save();
    await sendVerificationEmail({ email, token: verification.token });

    res.status(200).json({
      success: true,
      message: "Verification required",
      data: { verificationRequired: true, totpRequired: Boolean(user.totpEnabled) }
    });
    return;
  }

  if (user) {
    const otpPayload = generateEmailOtp();
    user.emailOtpHash = otpPayload.otpHash;
    user.emailOtpExpiresAt = otpPayload.expiresAt;
    await user.save();
    await sendOtpEmail({ email, otp: otpPayload.otp });
  }

  res.status(200).json({
    success: true,
    message: "If the account exists, a login code has been sent.",
    data: { verificationRequired: false, totpRequired: Boolean(user?.totpEnabled) }
  });
};

export const loginOtp = async (req, res) => {
  const { email, otp, totp } = req.body;

  const user = await User.findOne({ email }).select("+totpSecret");
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Email not verified", 403, { code: "EMAIL_NOT_VERIFIED" });
  }

  if (!user.emailOtpHash || !user.emailOtpExpiresAt || user.emailOtpExpiresAt < new Date()) {
    throw new AppError("Login code expired", 401);
  }

  const otpHash = hashToken(String(otp));
  if (otpHash !== user.emailOtpHash) {
    throw new AppError("Invalid login code", 401);
  }

  if (user.totpEnabled) {
    if (!totp) {
      throw new AppError("TOTP required", 401, { code: "TOTP_REQUIRED" });
    }

    const totpValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: String(totp),
      window: 1
    });

    if (!totpValid) {
      throw new AppError("Invalid TOTP code", 401, { code: "TOTP_INVALID" });
    }
  }

  user.emailOtpHash = null;
  user.emailOtpExpiresAt = null;
  user.lastLogin = new Date();
  await user.save();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion
  });

  const refreshPayload = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: user.tokenVersion
  });

  await persistRefreshToken({
    rawToken: refreshPayload.token,
    jti: refreshPayload.jti,
    expiresAt: refreshPayload.expiresAt,
    userId: user._id,
    req
  });

  setRefreshCookie(res, refreshPayload.token);

  res.status(200).json({
    success: true,
    data: safeAuthResponse({ user, accessToken })
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  user.emailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationTokenExpiresAt = null;
  await user.save();

  res.status(200).json({
    success: true,
    data: { user: safeAuthResponse({ user, accessToken: null }).user }
  });
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user && !user.emailVerified) {
    const verification = generateEmailVerificationToken();
    user.emailVerificationTokenHash = verification.tokenHash;
    user.emailVerificationTokenExpiresAt = verification.expiresAt;
    await user.save();
    await sendVerificationEmail({ email, token: verification.token });
  }

  res.status(200).json({
    success: true,
    message: "If the account exists, a verification email has been sent."
  });
};

export const refresh = async (req, res) => {
  const providedToken = req.body.refreshToken || req.cookies[env.refreshCookieName];

  if (!providedToken) {
    throw new AppError("Refresh token is required", 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(providedToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokenHash = hashToken(providedToken);

  const blacklisted = await TokenBlacklist.findOne({ tokenHash, tokenType: "refresh" }).lean();
  if (blacklisted) {
    throw new AppError("Refresh token is blacklisted", 401);
  }

  const currentToken = await RefreshToken.findOne({ tokenHash });

  if (!currentToken || currentToken.revokedAt) {
    await User.updateOne({ _id: payload.sub }, { $inc: { tokenVersion: 1 } });
    await RefreshToken.updateMany({ userId: payload.sub, revokedAt: null }, { $set: { revokedAt: new Date() } });
    throw new AppError("Refresh token reuse detected. Session invalidated.", 401);
  }

  if (currentToken.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.emailVerified) {
    throw new AppError("Email not verified", 403, { code: "EMAIL_NOT_VERIFIED" });
  }

  if (payload.tokenVersion !== user.tokenVersion) {
    throw new AppError("Session no longer valid", 401);
  }

  const nextRefresh = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: user.tokenVersion
  });

  currentToken.revokedAt = new Date();
  currentToken.replacedByTokenHash = hashToken(nextRefresh.token);
  await currentToken.save();

  await persistRefreshToken({
    rawToken: nextRefresh.token,
    jti: nextRefresh.jti,
    expiresAt: nextRefresh.expiresAt,
    userId: user._id,
    req
  });

  await TokenBlacklist.create({
    tokenHash,
    tokenType: "refresh",
    userId: user._id,
    expiresAt: decodeTokenExpiry(providedToken) || currentToken.expiresAt,
    reason: "rotated"
  });

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion
  });

  setRefreshCookie(res, nextRefresh.token);

  res.status(200).json({
    success: true,
    data: safeAuthResponse({ user, accessToken })
  });
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const refreshToken = req.body.refreshToken || req.cookies[env.refreshCookieName] || null;

  if (refreshToken) {
    const refreshHash = hashToken(refreshToken);
    const stored = await RefreshToken.findOne({ tokenHash: refreshHash });

    if (stored && !stored.revokedAt) {
      stored.revokedAt = new Date();
      await stored.save();
    }

    const refreshExpiry = decodeTokenExpiry(refreshToken) || new Date(Date.now() + 24 * 60 * 60 * 1000);

    await TokenBlacklist.updateOne(
      { tokenHash: refreshHash },
      {
        $setOnInsert: {
          tokenHash: refreshHash,
          tokenType: "refresh",
          userId: stored?.userId || null,
          expiresAt: refreshExpiry,
          reason: "logout"
        }
      },
      { upsert: true }
    );
  }

  if (accessToken) {
    const accessHash = hashToken(accessToken);
    const accessExpiry = decodeTokenExpiry(accessToken) || new Date(Date.now() + 15 * 60 * 1000);

    await TokenBlacklist.updateOne(
      { tokenHash: accessHash },
      {
        $setOnInsert: {
          tokenHash: accessHash,
          tokenType: "access",
          expiresAt: accessExpiry,
          reason: "logout"
        }
      },
      { upsert: true }
    );
  }

  res.clearCookie(env.refreshCookieName, getRefreshCookieOptions());

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export const updateProfile = async (req, res) => {
  const { name, organization, phone, plan } = req.body;
  const userId = req.auth?.userId;

  const updates = {};
  if (typeof name === "string") updates.name = name;
  if (typeof organization === "string" || organization === null) updates.organization = organization;
  if (typeof phone === "string" || phone === null) updates.phone = phone;
  if (typeof plan === "string") updates.plan = plan;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("No profile changes submitted", 400);
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: safeAuthResponse({ user, accessToken: null }).user
    }
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.auth?.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) {
    throw new AppError("Current password is incorrect", 401);
  }

  const isSame = await bcrypt.compare(newPassword, user.passwordHash);
  if (isSame) {
    throw new AppError("New password must be different from current password", 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, env.bcryptSaltRounds);
  user.tokenVersion += 1;
  await user.save();

  await RefreshToken.updateMany({ userId: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });

  res.status(200).json({
    success: true,
    message: "Password updated. Please log in again."
  });
};

export const setupTwoFactor = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("+totpTempSecret");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const secret = speakeasy.generateSecret({
    name: `AutoForge (${user.email})`
  });

  user.totpTempSecret = secret.base32;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      otpauthUrl: secret.otpauth_url,
      secret: secret.base32
    }
  });
};

export const verifyTwoFactor = async (req, res) => {
  const userId = req.auth?.userId;
  const { token } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("+totpTempSecret");
  if (!user || !user.totpTempSecret) {
    throw new AppError("Two-factor setup not initialized", 400);
  }

  const verified = speakeasy.totp.verify({
    secret: user.totpTempSecret,
    encoding: "base32",
    token: String(token),
    window: 1
  });

  if (!verified) {
    throw new AppError("Invalid verification code", 400);
  }

  user.totpSecret = user.totpTempSecret;
  user.totpTempSecret = null;
  user.totpEnabled = true;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      user: safeAuthResponse({ user, accessToken: null }).user
    }
  });
};

export const disableTwoFactor = async (req, res) => {
  const userId = req.auth?.userId;
  const { token } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("+totpSecret");
  if (!user || !user.totpSecret) {
    throw new AppError("Two-factor not enabled", 400);
  }

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: "base32",
    token: String(token),
    window: 1
  });

  if (!verified) {
    throw new AppError("Invalid verification code", 400);
  }

  user.totpSecret = null;
  user.totpEnabled = false;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      user: safeAuthResponse({ user, accessToken: null }).user
    }
  });
};
