export const checkEnvironmentVariables = () => {
    const variables = [
        "NODE_ENV",
        "CORS_ALLOWED_ORIGINS",
        "PORT",
        "DATABASE_URL",
        "SESSION_SECRET"
    ];

    for (const variable of variables) {
        if (process.env[variable] === undefined) {
            throw new Error(`Environment variable ${variable} is not set.`);
        }
    }
}