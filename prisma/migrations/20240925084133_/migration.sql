/*
  Warnings:

  - You are about to drop the column `confirmPassword` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "confirmPassword",
DROP COLUMN "password";
