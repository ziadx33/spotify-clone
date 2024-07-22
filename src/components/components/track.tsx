"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { type TrackFilters } from "@/types";
import { getAgoTime } from "@/utils/get-ago-time";
import { type User, type Track, type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { TrackMoreButton } from "./track-more-button";

type TrackProps = {
  track: Track & { trackIndex: number };
  authors?: User[];
  album?: Playlist;
  viewAs: TrackFilters["viewAs"];
  playlist?: Playlist;
  isAlbum?: boolean;
  showImage?: boolean;
  replacePlaysWithPlaylist?: boolean;
};

export function Track({
  track,
  authors,
  album,
  viewAs,
  playlist,
  isAlbum = false,
  showImage = true,
  replacePlaysWithPlaylist = false,
}: TrackProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [isShowMoreButtonOpened, setIsShowMoreButtonOpened] = useState(false);
  const dateAddedAgoValue = useMemo(
    () => getAgoTime(track.dateAdded),
    [track.dateAdded],
  );
  const isList = viewAs === "LIST";
  const hoverTrackHandler = (value: boolean) => {
    setShowButtons(value);
    if (!isShowMoreButtonOpened) setShowMoreButton(value);
  };
  const memoizedPlays = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    () => new Intl.NumberFormat("en-US").format(track.plays ?? 0),
    [track.plays],
  );

  const albumLink = (
    <Link href={`/playlist/${album?.id}`} className="hover:underline">
      {album?.title}
    </Link>
  );
  return (
    <TableRow
      key={track.id}
      onMouseOver={() => hoverTrackHandler(true)}
      onMouseLeave={() => hoverTrackHandler(false)}
    >
      <TableCell className="w-12 pl-4 pr-4">
        <button>
          {!showButtons ? track.trackIndex + 1 : <FaPlay size={10} />}
        </button>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex w-full gap-2">
          {isList && showImage && (
            <Image
              src={track.imgSrc}
              width={40}
              height={40}
              alt={track.title}
              className="rounded-sm"
            />
          )}
          <div>
            <h3>{track.title}</h3>
            {isList && (
              <div className="flex gap-1">
                {authors?.map((author, authorIndex) => (
                  <div key={author.id} className="text-muted-foreground">
                    <Link
                      href={`/artist/${author.id}?playlist=${playlist?.id ?? "liked-tracks"}`}
                      className="w-fit hover:underline"
                    >
                      {author.name}
                    </Link>
                    {authorIndex === authors.length - 1 ? "" : ","}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      {!isAlbum && (
        <>
          {!isList && (
            <TableCell className="flex gap-1">
              {authors?.map((author, authorIndex) => (
                <div key={author.id} className="text-muted-foreground">
                  <Link
                    href={`/artist/${author.id}?playlist=${playlist?.id ?? "liked-tracks"}`}
                    className="w-fit text-muted-foreground hover:underline"
                  >
                    {author.name}
                  </Link>
                  {authorIndex === authors.length - 1 ? "" : ","}
                </div>
              ))}
            </TableCell>
          )}
          {album && (
            <TableCell>
              <Link href={`/playlist/${album.id}`} className="hover:underline">
                {album.title}
              </Link>
            </TableCell>
          )}
          <TableCell>{dateAddedAgoValue}</TableCell>
        </>
      )}
      {isAlbum && (
        <TableCell>
          {!replacePlaysWithPlaylist ? (
            <div className="flex h-full w-24 gap-3">{memoizedPlays}</div>
          ) : (
            albumLink
          )}
        </TableCell>
      )}
      <TableCell>
        <div className="flex h-full w-24 gap-3">
          {String(
            (
              Math.floor(track.duration / 60) +
              (track.duration % 60) / 100
            ).toFixed(2),
          ).replace(".", ":")}
          {(showMoreButton || showButtons) && (
            <TrackMoreButton
              setOpened={setIsShowMoreButtonOpened}
              setShowMoreButton={setShowMoreButton}
              playlist={playlist}
              track={track}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}