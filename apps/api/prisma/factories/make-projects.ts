import { faker } from "@/lib/faker";
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export async function makeProjects() {
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
