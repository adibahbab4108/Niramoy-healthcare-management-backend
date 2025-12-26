-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_email_fkey";

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
