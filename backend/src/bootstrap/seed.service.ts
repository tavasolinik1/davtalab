import { PrismaClient } from '@prisma/client';

async function seed() {
  const prisma = new PrismaClient();
  const count = await prisma.ngo.count();
  if (count === 0) {
    const ngos = ['Helping Hands', 'Green Earth'];
    for (const name of ngos) {
      const ngo = await prisma.ngo.create({ data: { name } });
      await prisma.ngo.update({ where: { id: ngo.id }, data: { tenantId: ngo.id } });
    }
    // eslint-disable-next-line no-console
    console.log('Seeded NGOs');
  }
  await prisma.$disconnect();
}

seed().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});