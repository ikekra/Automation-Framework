import dns from "node:dns/promises";
import net from "node:net";
import { URL } from "node:url";
import { AppError } from "../../../utils/AppError.js";

const blockedHostnames = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]"
]);

const isPrivateIpv4 = (ip) => {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => Number.isNaN(part))) {
    return true;
  }

  if (octets[0] === 10) return true;
  if (octets[0] === 127) return true;
  if (octets[0] === 0) return true;
  if (octets[0] === 169 && octets[1] === 254) return true;
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  if (octets[0] === 192 && octets[1] === 168) return true;
  if (octets[0] >= 224) return true;
  return false;
};

const isPrivateIpv6 = (ip) => {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) return true;
  return false;
};

export const isPrivateIp = (ip) => {
  const version = net.isIP(ip);
  if (!version) return true;
  if (version === 4) return isPrivateIpv4(ip);
  return isPrivateIpv6(ip);
};

export const isBlockedHostname = (hostname) => {
  const lower = hostname.toLowerCase();
  return blockedHostnames.has(lower) || lower.endsWith(".local");
};

const resolveAndValidateHostname = async (hostname, lookup = dns.lookup) => {
  try {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    if (!addresses.length) {
      throw new AppError("Hostname could not be resolved", 400);
    }

    const hasPrivateAddress = addresses.some((address) => isPrivateIp(address.address));
    if (hasPrivateAddress) {
      throw new AppError("Target URL resolves to a private or blocked address", 400);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Hostname could not be resolved", 400);
  }
};

export const parseAndValidateTargetUrl = async (inputUrl, lookup = dns.lookup) => {
  let parsed;
  try {
    parsed = new URL(inputUrl);
  } catch {
    throw new AppError("Invalid URL", 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AppError("Only http/https URLs are allowed", 400);
  }

  const hostname = parsed.hostname.toLowerCase();
  if (isBlockedHostname(hostname)) {
    throw new AppError("Localhost/private targets are blocked", 400);
  }

  await resolveAndValidateHostname(hostname, lookup);
  return parsed.toString();
};

export const assertUrlIsSafe = async (resourceUrl, lookup = dns.lookup) => {
  const parsed = new URL(resourceUrl);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Blocked protocol");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (isBlockedHostname(hostname)) {
    throw new Error("Blocked hostname");
  }

  await resolveAndValidateHostname(hostname, lookup);
};
