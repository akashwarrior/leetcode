/*
  Warnings:

  - You are about to drop the column `defaultCodeSnippet` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "defaultCodeSnippet",
DROP COLUMN "description",
DROP COLUMN "testCases",
ADD COLUMN     "publicTestCases" INTEGER[];
