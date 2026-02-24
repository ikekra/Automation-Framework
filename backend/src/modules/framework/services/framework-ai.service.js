import OpenAI from "openai";
import env from "../../../config/env.js";
import { AppError } from "../../../utils/AppError.js";
import logger from "../../../config/logger.js";

const SYSTEM_PROMPT = [
  "You are a senior QA automation architect.",
  "Return ONLY valid JSON with no markdown and no commentary.",
  "JSON schema:",
  "{",
  "  \"folderStructure\": [\"string\"],",
  "  \"files\": [{ \"path\": \"string\", \"content\": \"string\" }]",
  "}",
  "Include practical starter files and realistic content.",
  "Do not return additional keys."
].join(" ");

const parseJsonResponse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/i);
    if (!match) {
      throw new AppError("AI response was not valid JSON", 502);
    }

    try {
      return JSON.parse(match[1]);
    } catch {
      throw new AppError("AI response JSON parsing failed", 502);
    }
  }
};

const normalizeOutput = (payload) => {
  const folderStructure = Array.isArray(payload.folderStructure)
    ? payload.folderStructure.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];

  const files = Array.isArray(payload.files)
    ? payload.files
        .filter((file) => file && typeof file.path === "string" && typeof file.content === "string")
        .map((file) => ({ path: file.path.trim(), content: file.content }))
        .filter((file) => file.path.length > 0)
    : [];

  if (folderStructure.length === 0 || files.length === 0) {
    throw new AppError("AI returned incomplete framework output", 502);
  }

  return { folderStructure, files };
};

const buildMockFrameworkOutput = (config) => {
  const baseFolders = [
    "src/",
    "src/tests/",
    "src/pages/",
    "src/utils/",
    "src/fixtures/",
    "reports/",
    ".github/workflows/"
  ];

  if (config.dockerSupport) {
    baseFolders.push("docker/");
  }

  const files = [
    {
      path: "README.md",
      content: `# ${config.automationTool} Automation Framework\n\nLanguage: ${config.language}\nPattern: ${config.pattern}\nTest Runner: ${config.testRunner}\nCI/CD: ${config.cicd}\nDocker: ${config.dockerSupport}`
    },
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: "automation-framework",
          version: "1.0.0",
          private: true,
          scripts: {
            test: "echo \"replace with real test command\"",
            "test:smoke": "echo \"replace with smoke tests\""
          }
        },
        null,
        2
      )
    },
    {
      path: "src/tests/sample.spec.ts",
      content: `describe('Smoke', () => {\n  it('should run sample test', async () => {\n    expect(true).toBeTruthy();\n  });\n});\n`
    },
    {
      path: "src/pages/BasePage.ts",
      content: `export class BasePage {\n  constructor(protected readonly page: unknown) {}\n}\n`
    },
    {
      path: ".github/workflows/ci.yml",
      content: `name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      - run: npm ci\n      - run: npm test\n`
    }
  ];

  if (config.dockerSupport) {
    files.push(
      {
        path: "Dockerfile",
        content: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD [\"npm\",\"test\"]\n"
      },
      {
        path: "docker-compose.yml",
        content: "version: '3.9'\nservices:\n  tests:\n    build: .\n    command: npm test\n"
      }
    );
  }

  return {
    folderStructure: baseFolders,
    files
  };
};

export const buildFrameworkPrompt = (config) => {
  const dockerLine = config.dockerSupport ? "Include Dockerfile and docker-compose support." : "Do not include Docker files.";

  return [
    "Generate a production-ready test automation framework blueprint.",
    `Language: ${config.language}`,
    `Automation tool: ${config.automationTool}`,
    `Framework pattern: ${config.pattern}`,
    `Test runner: ${config.testRunner}`,
    `CI/CD: ${config.cicd}`,
    `Docker support: ${config.dockerSupport}`,
    dockerLine,
    "Return folderStructure and files with concise, practical starter content."
  ].join("\n");
};

export const generateFrameworkWithAI = async (config) => {
  const prompt = buildFrameworkPrompt(config);

  if (env.mockAi) {
    logger.info("MOCK_AI enabled. Returning local framework template output.");
    const mock = buildMockFrameworkOutput(config);

    return {
      prompt,
      rawResponse: JSON.stringify(mock),
      ...mock
    };
  }

  if (!env.openaiApiKey) {
    throw new AppError("OPENAI_API_KEY is not configured", 500);
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: env.openaiModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    });
  } catch (error) {
    const statusCode = typeof error?.status === "number" ? error.status : 502;
    const providerMessage =
      typeof error?.error?.message === "string"
        ? error.error.message
        : typeof error?.message === "string"
          ? error.message
          : "Unknown provider error";
    const providerCode = typeof error?.code === "string" ? error.code : "unknown_error";

    logger.error("OpenAI framework generation failed", {
      statusCode,
      providerCode,
      providerMessage
    });

    throw new AppError("Failed to generate framework from AI provider", statusCode, {
      provider: "openai",
      statusCode,
      providerCode,
      providerMessage
    });
  }

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new AppError("Empty response received from OpenAI", 502);
  }

  const parsed = parseJsonResponse(content);
  const normalized = normalizeOutput(parsed);

  return {
    prompt,
    rawResponse: content,
    ...normalized
  };
};
