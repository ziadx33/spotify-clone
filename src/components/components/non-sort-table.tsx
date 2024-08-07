import {
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Track as TrackType, type Playlist } from "@prisma/client";
import { BsClock } from "react-icons/bs";
import { Track } from "./track";
import { type TrackFilters } from "@/types";

export type ReplaceDurationWithButton = {
  name: string;
  fn: (track: TrackType) => void | Promise<void>;
};

export type NonSortTableProps = {
  data: Partial<TracksSliceType["data"]>;
  playlist?: Playlist;
  viewAs: TrackFilters["viewAs"];
  showTrackImage?: boolean;
  showHead?: boolean;
  replacePlaysWithPlaylist?: boolean;
  limit?: number;
  showIndex?: boolean;
  replaceDurationWithButton?: ReplaceDurationWithButton;
  hidePlayButton?: boolean;
};

export function NonSortTable({
  data,
  playlist,
  viewAs,
  showTrackImage = true,
  showHead = true,
  replacePlaysWithPlaylist = false,
  limit,
  showIndex = true,
  replaceDurationWithButton,
  hidePlayButton = false,
}: NonSortTableProps) {
  return (
    <>
      {showHead && (
        <TableHeader>
          <TableRow>
            {showIndex && <TableHead className="w-0 pl-4 pr-0">#</TableHead>}
            <TableHead>Title</TableHead>
            {!hidePlayButton && (
              <TableHead>
                {!replacePlaysWithPlaylist ? "Plays" : "Album"}
              </TableHead>
            )}
            <TableHead>
              <BsClock size={15} />
            </TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data?.tracks
          ?.slice(0, !limit ? data.tracks.length : limit)
          .map((track, trackIndex) => (
            <Track
              hidePlayButton={hidePlayButton}
              replacePlaysWithPlaylist={replacePlaysWithPlaylist}
              showImage={showTrackImage}
              isAlbum
              replaceDurationWithButton={replaceDurationWithButton}
              playlist={playlist}
              viewAs={viewAs}
              key={track.id}
              showIndex={showIndex}
              track={{ ...track, trackIndex }}
              authors={data.authors!.filter(
                (author) =>
                  track.authorId === author.id ||
                  track.authorIds.includes(author.id),
              )}
              album={data.albums!.find((album) => track.albumId === album.id)}
            />
          ))}
      </TableBody>
    </>
  );
}
