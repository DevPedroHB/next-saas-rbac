import type { Faker } from "@faker-js/faker";
import type { PrismaClient, Role } from "@prisma/client";
import { randomInt } from "crypto";

interface IMakeMembers {
  prisma: PrismaClient;
  faker: Faker;
}

export async function makeMembers({ prisma, faker }: IMakeMembers) {
  const organizations = await prisma.organization.findMany({
    include: {
      members: true,
    },
  });
  const users = await prisma.user.findMany();
  const roles: Role[] = ["ADMIN", "BILLING", "MEMBER"];

  for (const organization of organizations) {
    const usersAvailable = users.filter(
      (user) =>
        !organization.members.some((member) => member.userId === user.id)
    );
    const usersChosen = faker.helpers.arrayElements(
      usersAvailable,
      randomInt(3, 9)
    );

    for (const user of usersChosen) {
      await prisma.member.create({
        data: {
          role: faker.helpers.arrayElement(roles),
          organizationId: organization.id,
          userId: user.id,
        },
      });
    }
  }
}
