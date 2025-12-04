import { defineConfig } from "drizzle-kit";

process.loadEnvFile();

const envOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: envOrThrow("DB_URL"),
  },
});