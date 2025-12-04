process.loadEnvFile();
const envOrThrow = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
const migrationConfig = {
    migrationsFolder: "./src/db",
};
const APIConfig = {
    fileserverHits: 0,
};
const DBConfig = {
    url: envOrThrow("DB_URL"),
    migrationConfig,
};
export { APIConfig, DBConfig };
