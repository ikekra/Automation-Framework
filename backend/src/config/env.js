import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  logLevel: process.env.LOG_LEVEL || "info"
};

export default Object.freeze(env);
