import { faker } from "@/lib/faker";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomInt } from "crypto";

interface IMakeUsers {
  length: number;
}

export async function makeUsers({ length }: IMakeUsers) {
  const l = randomInt(length, length * 2);
  const passwordHash = await hash("123456", 10);

  for (let i = 0; i < l; i++) {
    const name = faker.person.fullName();
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];

    await prisma.user.create({
      data: {
        name,
        email: faker.internet.email({
          firstName,
          lastName,
        }),
        passwordHash,
        avatarUrl: faker.image.avatarLegacy(),
      },
    });
  }
}
