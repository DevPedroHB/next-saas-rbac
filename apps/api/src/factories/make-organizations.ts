import type { Faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

interface IMakeOrganizations {
  prisma: PrismaClient;
  faker: Faker;
}

export async function makeOrganizations({ prisma, faker }: IMakeOrganizations) {
  const users = await prisma.user.findMany();
  const l = randomInt(users.length / 2, users.length);

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
