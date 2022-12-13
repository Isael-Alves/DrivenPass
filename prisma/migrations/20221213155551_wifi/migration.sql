/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "wifi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rede" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "wifi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_title_userId_key" ON "credentials"("title", "userId");

-- AddForeignKey
ALTER TABLE "wifi" ADD CONSTRAINT "wifi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
