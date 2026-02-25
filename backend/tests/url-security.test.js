import test from "node:test";
import assert from "node:assert/strict";
import { assertUrlIsSafe, isBlockedHostname, isPrivateIp, parseAndValidateTargetUrl } from "../src/modules/test/services/url-security.service.js";
import { AppError } from "../src/utils/AppError.js";

const publicLookup = async () => [{ address: "93.184.216.34", family: 4 }];
const privateLookup = async () => [{ address: "10.0.0.25", family: 4 }];

test("isPrivateIp detects local/private ranges", () => {
  assert.equal(isPrivateIp("127.0.0.1"), true);
  assert.equal(isPrivateIp("10.10.10.10"), true);
  assert.equal(isPrivateIp("192.168.1.20"), true);
  assert.equal(isPrivateIp("93.184.216.34"), false);
});

test("isBlockedHostname blocks localhost-style domains", () => {
  assert.equal(isBlockedHostname("localhost"), true);
  assert.equal(isBlockedHostname("dev.local"), true);
  assert.equal(isBlockedHostname("example.com"), false);
});

test("parseAndValidateTargetUrl rejects non-http protocols", async () => {
  await assert.rejects(
    () => parseAndValidateTargetUrl("ftp://example.com", publicLookup),
    (error) => error instanceof AppError && error.statusCode === 400
  );
});

test("parseAndValidateTargetUrl rejects private resolution (SSRF)", async () => {
  await assert.rejects(
    () => parseAndValidateTargetUrl("https://example.com", privateLookup),
    (error) => error instanceof AppError && error.statusCode === 400
  );
});

test("parseAndValidateTargetUrl accepts public hosts", async () => {
  const normalized = await parseAndValidateTargetUrl("https://example.com", publicLookup);
  assert.equal(normalized, "https://example.com/");
});

test("assertUrlIsSafe blocks private DNS addresses", async () => {
  await assert.rejects(
    () => assertUrlIsSafe("https://cdn.example.com/app.js", privateLookup),
    /blocked|private|hostname/i
  );
});
