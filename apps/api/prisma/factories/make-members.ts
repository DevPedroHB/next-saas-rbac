import { faker } from "@/lib/faker";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { randomInt } from "crypto";

export async function makeMembers() {
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
