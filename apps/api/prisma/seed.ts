import {
  makeMembers,
  makeOrganizations,
  makeProjects,
  makeUsers,
} from "../src/factories";
import { faker } from "../src/lib/faker";
import { prisma } from "../src/lib/prisma";

interface Table {
  tablename: string;
}

async function run() {
  const tables: Table[] = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

  for (const table of tables) {
    await prisma.$queryRawUnsafe(`
      TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE;
    `);
  }

  await makeUsers({ prisma, faker, length: 20 });
  await makeOrganizations({ prisma, faker });
  await makeMembers({ prisma, faker });
  await makeProjects({ prisma, faker });
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
