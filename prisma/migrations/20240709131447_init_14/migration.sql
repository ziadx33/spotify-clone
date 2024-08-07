-- CreateEnum
CREATE TYPE "PLAYLIST_TYPE" AS ENUM ('SINGLE', 'ALBUM');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "PLAYLIST_TYPE" NOT NULL DEFAULT 'ALBUM';

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "authorIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "followers" SET DEFAULT '0',
ALTER COLUMN "followers" SET DATA TYPE TEXT;
