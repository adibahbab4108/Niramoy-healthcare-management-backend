/*
  Warnings:

  - You are about to drop the column `address` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `needPasswordChange` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `currentWorkplace` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `needPasswordChange` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `doctors` table. All the data in the column will be lost.
  - You are about to alter the column `appointmentFee` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `contactNumber` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `needPasswordChange` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactNumber` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currentWorkingPlace` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactNumber` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registrationNumber` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualification` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `appointmentFee` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "address",
DROP COLUMN "needPasswordChange",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "contactNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "currentWorkplace",
DROP COLUMN "experienceYears",
DROP COLUMN "needPasswordChange",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status",
ADD COLUMN     "currentWorkingPlace" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "registrationNumber" SET NOT NULL,
ALTER COLUMN "qualification" SET NOT NULL,
ALTER COLUMN "appointmentFee" SET NOT NULL,
ALTER COLUMN "appointmentFee" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "contactNumber",
DROP COLUMN "dateOfBirth",
DROP COLUMN "needPasswordChange",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "needPasswordChange" SET DEFAULT true,
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
