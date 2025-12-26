/*
  Warnings:

  - You are about to drop the column `email` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `patients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_email_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_id_fkey";

-- DropIndex
DROP INDEX "admins_email_key";

-- DropIndex
DROP INDEX "doctors_email_key";

-- DropIndex
DROP INDEX "patients_email_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
