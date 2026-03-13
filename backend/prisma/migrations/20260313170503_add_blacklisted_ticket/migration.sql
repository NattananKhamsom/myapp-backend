-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('YELLOW', 'RED');

-- CreateTable
CREATE TABLE "BlacklistedTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "category" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlacklistedTicket_userId_idx" ON "BlacklistedTicket"("userId");

-- CreateIndex
CREATE INDEX "BlacklistedTicket_cardType_idx" ON "BlacklistedTicket"("cardType");

-- AddForeignKey
ALTER TABLE "BlacklistedTicket" ADD CONSTRAINT "BlacklistedTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
