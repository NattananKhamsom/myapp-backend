-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blacklistReason" TEXT,
ADD COLUMN     "isBlacklisted" BOOLEAN NOT NULL DEFAULT false;
