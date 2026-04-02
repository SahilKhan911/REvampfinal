const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRaw`SELECT NOW()`
  .then(res => { console.log("Connected:", res); process.exit(0); })
  .catch(err => { console.error("Error:", err); process.exit(1); });
