process.loadEnvFile();

const envOrThrow = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db",
};

type APIConfig = {
    fileserverHits: number;
};

const APIConfig: APIConfig = {
    fileserverHits: 0,
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

const DBConfig: DBConfig = {
    url: envOrThrow("DB_URL"),
    migrationConfig,
}

export { APIConfig, DBConfig };