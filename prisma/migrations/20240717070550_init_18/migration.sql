-- AlterTable
ALTER TABLE "User" ADD COLUMN     "topArtists" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "topArtistsLastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tracksHistory" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tracksHistoryLastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
