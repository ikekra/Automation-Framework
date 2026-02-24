import { AppError } from "../utils/AppError.js";
import { User } from "../modules/auth/models/user.model.js";
import { TokenBlacklist } from "../modules/auth/models/token-blacklist.model.js";
import { hashToken, verifyAccessToken } from "../modules/auth/utils/token.js";

const extractBearerToken = (header = "") => {
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  return token || null;
};

export const authenticate = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization || "");

    if (!token) {
      throw new AppError("Missing access token", 401);
    }

    const tokenHash = hashToken(token);
    const isBlacklisted = await TokenBlacklist.findOne({ tokenHash, tokenType: "access" }).lean();
    if (isBlacklisted) {
      throw new AppError("Access token revoked", 401);
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).lean();
    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new AppError("Session invalidated", 401);
    }

    req.auth = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.auth) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!roles.includes(req.auth.role)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};
