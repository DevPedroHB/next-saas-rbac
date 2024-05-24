import { prisma } from "@/lib/prisma";
import { makeMembers } from "./factories/make-members";
import { makeOrganizations } from "./factories/make-organizations";
import { makeProjects } from "./factories/make-projects";
import { makeUsers } from "./factories/make-users";

interface PgTable {
  tablename: string;
}

interface ISeed {
  clearTables: boolean;
  createData: boolean;
}

async function seed({ clearTables, createData }: ISeed) {
  if (clearTables) {
    const tables: PgTable[] = await prisma.$queryRaw`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    for (const table of tables) {
      await prisma.$queryRawUnsafe(`
        TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE;
      `);
    }
  }

  if (createData) {
    await makeUsers({ length: 20 });
    await makeOrganizations();
    await makeMembers();
    await makeProjects();
  }
}

seed({ clearTables: true, createData: true })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
