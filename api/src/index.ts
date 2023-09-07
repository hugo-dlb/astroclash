import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { checkEnvironmentVariables } from "./utils/checkEnvironmentVariables";
import { authRouter } from "./services/auth";
import { prismaMiddleware } from "./middlewares/prismaMiddleware";
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
import { Server } from 'socket.io';
import { createServer } from "http";
import { initializeSocket } from "./socket/initializeSocket";
import { getPgMiddleware } from "./middlewares/getPgMiddleware";

checkEnvironmentVariables();

const router = Router();
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT!;
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ALLOWED_ORIGINS!.split(","),
        credentials: true
    }
});

initializeSocket(io);

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
app.use(getPgMiddleware());

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

httpServer.listen(port, () => {
    console.log(`Astroclash api listening on port ${port} (Environment: ${process.env.NODE_ENV}).`);
});