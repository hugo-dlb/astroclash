import session from "express-session";
import connectPg from "connect-pg-simple";

export const getPgMiddleware = () => {
    const PgSession = connectPg(session);

    return session({
        store: new PgSession({
            conObject: {
                connectionString: process.env.DATABASE_URL!,
                ssl: false
            },
            tableName: "UserSession",
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === "production",
            domain: process.env.NODE_ENV === "production" ? "astroclash.io" : "localhost",
            httpOnly: true,
            sameSite: true
        },
        saveUninitialized: false,
    });
};