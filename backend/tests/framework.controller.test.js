import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { AppError } from "../src/utils/AppError.js";
import { Framework } from "../src/modules/framework/models/framework.model.js";
import {
  createFrameworkDownloadAccess,
  deleteFramework,
  listFrameworks
} from "../src/modules/framework/controllers/framework.controller.js";

const originalFind = Framework.find;
const originalCountDocuments = Framework.countDocuments;
const originalFindOne = Framework.findOne;
const originalFindOneAndDelete = Framework.findOneAndDelete;

const createResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  return response;
};

const restoreFrameworkModel = () => {
  Framework.find = originalFind;
  Framework.countDocuments = originalCountDocuments;
  Framework.findOne = originalFindOne;
  Framework.findOneAndDelete = originalFindOneAndDelete;
};

test.afterEach(() => {
  restoreFrameworkModel();
});

test("listFrameworks returns account-scoped framework history with pagination", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const frameworkId = new mongoose.Types.ObjectId();
  const createdAt = new Date("2026-05-10T12:00:00.000Z");
  const updatedAt = new Date("2026-05-10T12:05:00.000Z");
  const frameworks = [
    {
      _id: frameworkId,
      language: "TypeScript",
      automationTool: "Playwright",
      pattern: "Page Object Model",
      testRunner: "Playwright Test",
      cicd: "GitHub Actions",
      dockerSupport: true,
      files: [{ path: "README.md", content: "hello" }],
      folderStructure: ["tests", "pages"],
      downloadTokenExpiresAt: new Date("2026-05-10T13:00:00.000Z"),
      createdAt,
      updatedAt
    }
  ];

  const queryChain = {
    sort(sortArg) {
      assert.deepEqual(sortArg, { createdAt: -1 });
      return this;
    },
    skip(value) {
      assert.equal(value, 10);
      return this;
    },
    limit(value) {
      assert.equal(value, 10);
      return Promise.resolve(frameworks);
    }
  };

  Framework.find = (filters) => {
    assert.deepEqual(filters, { userId });
    return queryChain;
  };
  Framework.countDocuments = async (filters) => {
    assert.deepEqual(filters, { userId });
    return 21;
  };

  const req = {
    auth: { userId },
    query: { page: 2, limit: 10 }
  };
  const res = createResponse();

  await listFrameworks(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.items.length, 1);
  assert.equal(res.body.data.items[0].id, frameworkId.toString());
  assert.equal(res.body.data.items[0].filesCount, 1);
  assert.equal(res.body.data.items[0].folderCount, 2);
  assert.equal(res.body.data.items[0].download.path, `/api/framework/download/${frameworkId.toString()}`);
  assert.equal(res.body.data.items[0].download.token, null);
  assert.equal(res.body.data.meta.total, 21);
  assert.equal(res.body.data.meta.totalPages, 3);
});

test("listFrameworks rejects requests without authenticated user context", async () => {
  const req = {
    auth: null,
    query: { page: 1, limit: 10 }
  };
  const res = createResponse();

  await assert.rejects(
    () => listFrameworks(req, res),
    (error) => error instanceof AppError && error.statusCode === 401 && error.message === "Unauthorized"
  );
});

test("createFrameworkDownloadAccess issues a token and persists hashed access metadata", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const frameworkId = new mongoose.Types.ObjectId();

  const framework = {
    _id: frameworkId,
    downloadTokenHash: null,
    downloadTokenExpiresAt: null,
    async save() {
      return this;
    }
  };

  Framework.findOne = async (filters) => {
    assert.deepEqual(filters, { _id: frameworkId.toString(), userId });
    return framework;
  };

  const req = {
    auth: { userId },
    params: { id: frameworkId.toString() }
  };
  const res = createResponse();

  await createFrameworkDownloadAccess(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.path, `/api/framework/download/${frameworkId.toString()}`);
  assert.match(res.body.data.token, /^[a-f0-9]{64}$/);
  assert.ok(framework.downloadTokenHash);
  assert.notEqual(framework.downloadTokenHash, res.body.data.token);
  assert.ok(framework.downloadTokenExpiresAt instanceof Date);
});

test("createFrameworkDownloadAccess rejects invalid framework ids", async () => {
  const req = {
    auth: { userId: new mongoose.Types.ObjectId().toString() },
    params: { id: "not-an-id" }
  };
  const res = createResponse();

  await assert.rejects(
    () => createFrameworkDownloadAccess(req, res),
    (error) => error instanceof AppError && error.statusCode === 400 && error.message === "Invalid framework id"
  );
});

test("deleteFramework removes a user-owned framework", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const frameworkId = new mongoose.Types.ObjectId().toString();

  Framework.findOneAndDelete = async (filters) => {
    assert.deepEqual(filters, { _id: frameworkId, userId });
    return { _id: frameworkId };
  };

  const req = {
    auth: { userId },
    params: { id: frameworkId }
  };
  const res = createResponse();

  await deleteFramework(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Framework deleted"
  });
});

test("deleteFramework returns not found when record does not belong to the user", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const frameworkId = new mongoose.Types.ObjectId().toString();

  Framework.findOneAndDelete = async () => null;

  const req = {
    auth: { userId },
    params: { id: frameworkId }
  };
  const res = createResponse();

  await assert.rejects(
    () => deleteFramework(req, res),
    (error) => error instanceof AppError && error.statusCode === 404 && error.message === "Framework not found"
  );
});
