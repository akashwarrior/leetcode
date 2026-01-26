/*
  Warnings:

  - You are about to drop the column `codeSnippetUrl` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `code` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "codeSnippetUrl",
DROP COLUMN "output",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "codeAnswer" TEXT,
ADD COLUMN     "codeOutput" TEXT,
ADD COLUMN     "lastTestCaseId" TEXT,
ADD COLUMN     "passedTestCases" INTEGER NOT NULL DEFAULT 0;
