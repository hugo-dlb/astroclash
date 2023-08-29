import { Request, Response, Router } from "express";
import * as yup from 'yup';
import { InferType } from "yup";
import { bodyValidationMiddleware } from "../utils/dataValidation";
import YupPassword from 'yup-password';
import { hash, compare } from "bcrypt";
YupPassword(yup);
const { object, string } = yup;
import { authMiddleware } from "../middlewares/authMiddleware";
import { getCrystalMineProduction } from "../utils/building";
import { INITIAL_CRYSTAL_AMOUNT, updatePlanetsResources } from "../utils/resource";
import { getPlanetCoordinates } from "../utils/coordinates";
import { getUserMissions } from "../utils/mission";

const router = Router();

router.get('/auth/profile', authMiddleware, async (req: Request, res: Response) => {
    const { prisma, user } = req;

    const matchingUser = await prisma.user.findFirstOrThrow({
        where: {
            uid: user.userUid
        },
        select: {
            uid: true,
            username: true,
            email: true
        }
    });

    await updatePlanetsResources(matchingUser.uid);

    res.json({
        data: {
            user: matchingUser,
            planets: await prisma.planet.findMany({
                where: {
                    userUid: matchingUser.uid
                },
                include: {
                    resources: true,
                    buildings: true,
                    fleet: true,
                    coordinates: {
                        select: {
                            uid: true,
                            x: true,
                            y: true,
                            z: true,
                            xOffset: true,
                            yOffset: true
                        }
                    }
                }
            }),
            ranks: {
                ranking: await prisma.ranking.findMany(),
                pastRanking: await prisma.pastRanking.findMany()
            },
            missions: await getUserMissions(user.userUid)
        }
    });
});

const passwordObject = string().min(
    8,
    'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character.'
)
    .minLowercase(1, 'Password must contain at least 1 lower case letter.')
    .minUppercase(1, 'Password must contain at least 1 upper case letter.')
    .minNumbers(1, 'Password must contain at least 1 number.')
    .minSymbols(1, 'Password must contain at least 1 special character.').required();

const newUserValidator = object({
    username: string().required().max(20),
    email: string().required(),
    password: passwordObject,
});

router.post('/auth/register', bodyValidationMiddleware(newUserValidator), async (req: Request<object, object, InferType<typeof newUserValidator>>, res: Response) => {
    const { prisma, body } = req;
    const { username, email, password } = body;

    const hashedPassword = await hash(password, 12);

    const existingUserEmail = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (existingUserEmail) {
        return res.status(400).json({ error: "An account with this email address already exists" });
    }

    const existingUserUsername = await prisma.user.findFirst({
        where: {
            username
        }
    });

    if (existingUserUsername) {
        return res.status(400).json({ error: "An account with this username already exists" });
    }

    const user = await prisma.user.create({
        data: {
            username,
            email,
            hash: hashedPassword,
            planets: {
                create: {
                    name: "Main planet",
                    variant: Math.floor(Math.random() * 4),
                    resources: {
                        create: {
                            type: "CRYSTAL",
                            value: INITIAL_CRYSTAL_AMOUNT,
                        }
                    },
                    buildings: {
                        create: [
                            {
                                type: "CRYSTAL_MINE",
                                production: getCrystalMineProduction(1)
                            },
                            {
                                type: "SPACE_DOCK",
                                level: 0,
                                production: 0
                            }
                        ]
                    },
                    coordinates: {
                        create: await getPlanetCoordinates()
                    }
                },
            },
            rank: {
                create: {}
            },
            pastRank: {
                create: {}
            }
        },
        select: {
            uid: true,
            username: true,
            email: true,
        },
    });

    req.session.user = {
        userUid: user.uid
    };

    res.json({
        data: {
            user
        }
    });
});

const loginValidator = object({
    email: string().required(),
    password: string().required(),
});

router.post('/auth/login', bodyValidationMiddleware(loginValidator), async (req: Request<object, object, InferType<typeof loginValidator>>, res: Response) => {
    const { prisma, body } = req;
    const { email, password } = body;

    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email
            }
        });

        if (!await compare(password, user.hash)) {
            throw new Error();
        }

        req.session.user = {
            userUid: user.uid
        };

        await updatePlanetsResources(user.uid);

        res.json({
            data: {
                user: {
                    uid: user.uid,
                    username: user.username,
                    email: user.email
                },
                planets: await prisma.planet.findMany({
                    where: {
                        userUid: user.uid
                    },
                    include: {
                        resources: true,
                        buildings: true,
                        fleet: true,
                        coordinates: {
                            select: {
                                uid: true,
                                x: true,
                                y: true,
                                z: true,
                                xOffset: true,
                                yOffset: true
                            }
                        }
                    }
                }),
                ranks: {
                    ranking: await prisma.ranking.findMany(),
                    pastRanking: await prisma.pastRanking.findMany()
                },
                missions: await getUserMissions(user.uid)
            }
        });
    } catch {
        return res.status(403).json({ error: "Wrong email address and/or password" });
    }
});

router.post('/auth/logout', authMiddleware, async (req: Request, res: Response) => {
    res.cookie("connect.sid", null, {
        expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? "www.astroclash.io" : "localhost",
        sameSite: true,
        httpOnly: true
    });

    req.session.destroy((error) => {
        if (error) {
            console.error(`Error while trying to logout: ${JSON.stringify(error)}`);
            res.status(500).json({ error: "A technical error occured. Please try again later" });
        } else {
            res.json({});
        }
    });
});

const changePasswordValidator = object({
    previousPassword: passwordObject,
    newPassword: passwordObject,
});

router.post('/auth/change-password', [bodyValidationMiddleware(changePasswordValidator)], async (req: Request<object, object, InferType<typeof changePasswordValidator>>, res: Response) => {
    const { prisma, user, body } = req;
    const { previousPassword, newPassword } = body;

    try {
        const matchingUser = await prisma.user.findFirstOrThrow({
            where: {
                uid: user.userUid
            }
        });

        if (!await compare(previousPassword, matchingUser.hash)) {
            throw new Error();
        }

        await prisma.user.update({
            where: {
                email: matchingUser.email
            },
            data: {
                hash: await hash(newPassword, 12)
            }
        });

        req.session.user = {
            userUid: matchingUser.uid
        };

        res.json({
            data: {
                user: {
                    uid: matchingUser.uid,
                    username: matchingUser.username,
                    email: matchingUser.email
                }
            }
        });
    } catch {
        console.error(`Invalid password change attempt from IP ${req.ip}`);
        return res.status(403).json({ error: "The password is incorrect" });
    }
});

export { router as authRouter };