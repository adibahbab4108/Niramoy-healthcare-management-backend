-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL;
