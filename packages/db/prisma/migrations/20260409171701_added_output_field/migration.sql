/*
  Warnings:

  - You are about to drop the column `codeSnippet` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `codeSnippetUrl` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "codeSnippet",
ADD COLUMN     "codeSnippetUrl" TEXT NOT NULL,
ADD COLUMN     "output" TEXT;
