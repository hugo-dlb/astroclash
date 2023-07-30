import { prisma } from "../middlewares/prismaMiddleware";

export const updateRanking = async () => {
    await prisma.$executeRaw`UPDATE "PastRank" destination SET
    points = source."points"
    FROM "Rank" source
    WHERE source."userUid" = destination."userUid"`;
};