import bcrypt from "bcrypt";
import env from "../../../config/env.js";
import { AppError } from "../../../utils/AppError.js";
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

const safeAuthResponse = ({ user, accessToken }) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  accessToken
});

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
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await User.create({ name, email, passwordHash, role: "user" });

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

  res.status(201).json({
    success: true,
    data: safeAuthResponse({ user, accessToken })
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
