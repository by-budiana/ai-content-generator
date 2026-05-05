const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding templates...');

  const templates = [
    {
      name: 'Promo Ramadhan',
      description: 'Template untuk promosi produk di bulan Ramadhan.',
      type: 'CAPTION',
    },
    {
      name: 'Launching Produk Baru',
      description: 'Template untuk pengumuman peluncuran produk baru.',
      type: 'CAPTION',
    },
    {
      name: 'Travel Destinations',
      description: 'Template untuk konten perjalanan dan liburan.',
      type: 'CAPTION',
    },
    {
      name: 'Business Branding',
      description: 'Template deskripsi bisnis profesional.',
      type: 'DESCRIPTION',
    },
    {
      name: 'Catchy Taglines',
      description: 'Template untuk membuat tagline yang mudah diingat.',
      type: 'TAGLINE',
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: 0 }, // Dummy where for upsert
      update: {},
      create: template,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
