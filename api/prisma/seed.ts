import { PrismaClient } from '@prisma/client';
import { getCrystalMineProduction } from '../src/utils/building';
import { getPlanetCoordinates } from '../src/utils/coordinates';
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.create({
        data: {
            username: "Hugo",
            email: 'hugo.dalboussiere@gmail.com',
            hash: await hash("hugo", 12),
            planets: {
                create: {
                    name: "Main planet",
                    variant: Math.floor(Math.random() * 4),
                    resources: {
                        create: {
                            type: "CRYSTAL",
                            value: 10000,
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
                }
            },
            rank: {
                create: {}
            },
            pastRank: {
                create: {}
            }
        }
    });

    for (let i = 1; i <= 50; i++) {
        await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                email: `john${i}@gmail.com`,
                hash: await hash(`john${i}`, 12),
                planets: {
                    create: {
                        name: "Main planet",
                        variant: Math.floor(Math.random() * 4),
                        resources: {
                            create: {
                                type: "CRYSTAL",
                                value: 10000,
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
                    }
                },
                rank: {
                    create: {}
                },
                pastRank: {
                    create: {}
                }
            }
        });
    }
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });