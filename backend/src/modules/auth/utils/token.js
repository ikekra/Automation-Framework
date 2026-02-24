import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import env from "../../../config/env.js";

const toMs = (value) => {
  const match = /^([0-9]+)([smhd])$/.exec(value);

  if (!match) {
    throw new Error(`Invalid token expiry format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const map = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * map[unit];
};

export const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export const signAccessToken = ({ userId, role, tokenVersion }) => {
  return jwt.sign(
    {
      sub: userId,
      role,
      type: "access",
      tokenVersion
    },
    env.accessTokenSecret,
    {
      expiresIn: env.accessTokenExpiresIn,
      issuer: "autoforge-api",
      audience: "autoforge-client"
    }
  );
};

export const signRefreshToken = ({ userId, tokenVersion }) => {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      sub: userId,
      jti,
      type: "refresh",
      tokenVersion
    },
    env.refreshTokenSecret,
    {
      expiresIn: env.refreshTokenExpiresIn,
      issuer: "autoforge-api",
      audience: "autoforge-client"
    }
  );

  const expiresAt = new Date(Date.now() + toMs(env.refreshTokenExpiresIn));
  return { token, jti, expiresAt };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.accessTokenSecret, {
    issuer: "autoforge-api",
    audience: "autoforge-client"
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.refreshTokenSecret, {
    issuer: "autoforge-api",
    audience: "autoforge-client"
  });
};

export const decodeTokenExpiry = (token) => {
  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
};

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
  path: "/api/v1/auth",
  maxAge: toMs(env.refreshTokenExpiresIn)
});
