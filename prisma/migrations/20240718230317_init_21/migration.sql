-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tracksHistoryLastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
