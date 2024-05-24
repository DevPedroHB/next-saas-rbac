import { faker } from "@/lib/faker";
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export async function makeOrganizations() {
  const users = await prisma.user.findMany();
  const l = randomInt(Math.round(users.length / 2), users.length);

  for (let i = 0; i < l; i++) {
    const user = faker.helpers.arrayElement(users);

    await prisma.organization.create({
      data: {
        name: faker.company.name(),
        slug: faker.lorem.slug(),
        domain: faker.internet.domainName(),
        shouldAttachUsersByDomain: faker.datatype.boolean(),
        avatarUrl: faker.image.url(),
        ownerId: user.id,
      },
    });
  }
}
