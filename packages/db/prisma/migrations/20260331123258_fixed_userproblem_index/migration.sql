/*
  Warnings:

  - A unique constraint covering the columns `[userId,problemId]` on the table `UserProblem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserProblem_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "UserProblem_userId_problemId_key" ON "UserProblem"("userId", "problemId");
