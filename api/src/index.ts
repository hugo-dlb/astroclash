import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { checkEnvironmentVariables } from "./utils/checkEnvironmentVariables";
import { authRouter } from "./services/auth";
import { prismaMiddleware } from "./middlewares/prismaMiddleware";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { buildingRouter } from "./services/building";
import { fleetRouter } from "./services/fleet";
import { planetRouter } from "./services/planet";
import { rankRouter } from "./services/rank";
import { errorMiddleware, globalErrorHandler } from "./middlewares/errorMiddleware.ts";
import { CronJob } from "cron";
import { updateRanking } from "./utils/rank";
import { galaxyRouter } from "./services/galaxy";
import { missionRouter } from "./services/mission";
import { healthRouter } from "./services/health";
import { messageRouter } from "./services/message";

checkEnvironmentVariables();

const router = Router();
const app = express();
const port = process.env.PORT!;
const PgSession = connectPg(session);

// TODO: double check timezones
new CronJob(
    '0 0 * * *', // every night at midnight
    updateRanking,
    null,
    true,
);

app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.CORS_ALLOWED_ORIGINS!.split(","),
    credentials: true
}));
app.use(bodyParser.json());
app.use(prismaMiddleware);
app.use(session({
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
}));

router.use(healthRouter);
router.use(authRouter);
router.use(buildingRouter);
router.use(fleetRouter);
router.use(planetRouter);
router.use(rankRouter);
router.use(galaxyRouter);
router.use(missionRouter);
router.use(messageRouter);

app.use("/api", router);

app.use(errorMiddleware);
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Astroclash api listening on port ${port} (Environment: ${process.env.NODE_ENV}).`);
});