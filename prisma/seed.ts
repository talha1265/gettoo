import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gettoo Atelier database for Neon PostgreSQL...');

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gettoo.atelier' },
    update: {},
    create: {
      name: 'Atelier Lead Admin',
      email: 'admin@gettoo.atelier',
      role: 'ADMIN',
      phone: '+91 99999 88888',
    },
  });

  // Create Default Customer
  const customer = await prisma.user.upsert({
    where: { email: 'talha@gettoo.atelier' },
    update: {},
    create: {
      name: 'Talha Al-Khatib',
      email: 'talha@gettoo.atelier',
      role: 'CUSTOMER',
      phone: '+91 98765 01234',
    },
  });

  // Create Categories
  const catHeritage = await prisma.category.upsert({
    where: { slug: 'drop-01-heritage' },
    update: {},
    create: {
      name: 'Drop 01: Heritage',
      slug: 'drop-01-heritage',
      description: 'Archival high-density embroidered art on 240 GSM pima cotton',
    },
  });

  const catBlanks = await prisma.category.upsert({
    where: { slug: 'custom-blanks' },
    update: {},
    create: {
      name: 'Custom Studio Blanks',
      slug: 'custom-blanks',
      description: '260 GSM heavy French terry blanks engineered for custom needlework',
    },
  });

  console.log('Database seeded successfully for Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
