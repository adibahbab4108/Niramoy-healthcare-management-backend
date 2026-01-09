import { prisma } from "../app/lib/prisma";


const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to PostgreSQL");
  } catch (error) {
    console.error("❌ Prisma connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
