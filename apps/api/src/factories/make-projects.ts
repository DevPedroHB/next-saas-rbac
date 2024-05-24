import type { Faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

interface IMakeProjects {
  prisma: PrismaClient;
  faker: Faker;
}

export async function makeProjects({ prisma, faker }: IMakeProjects) {
  const organizations = await prisma.organization.findMany({
    include: {
      members: true,
    },
  });

  for (const organization of organizations) {
    const usersChosen = faker.helpers.arrayElements(
      organization.members,
      randomInt(1, organization.members.length)
    );

    for (const user of usersChosen) {
      await prisma.project.create({
        data: {
          name: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          slug: faker.lorem.slug(),
          avatarUrl: faker.image.url(),
          organizationId: organization.id,
          ownerId: user.userId,
        },
      });
    }
  }
}
