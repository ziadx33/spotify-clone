import { type NonSortTableProps } from "@/components/components/non-sort-table";
import { Button } from "@/components/ui/button";
import { revalidate } from "@/server/actions/revalidate";
import {
  addTrackToPlaylistToDB,
  getRecommendedTracks,
} from "@/server/actions/track";
import { addTrack } from "@/state/slices/tracks";
import { type AppDispatch } from "@/state/store";
import { type Track, type User, type Playlist } from "@prisma/client";
import { notFound } from "next/navigation";
import { useState } from "react";
import { BsX } from "react-icons/bs";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { RecommendedTracks } from "./recommended-tracks";
import { SearchTrack } from "./recommended-search";

type RecommendProps = {
  playlist?: Playlist | null;
  artists?: User[] | null;
  tracks?: Track[] | null;
};

export type TablePropsType = Omit<NonSortTableProps, "data">;

export function Recommended({ playlist, artists, tracks }: RecommendProps) {
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const data = getRecommendedTracks({
        artistIds: artists?.map((artist) => artist.id) ?? [],
        trackIds: tracks?.map((track) => track.id) ?? [],
      });
      return data;
    },
  });

  if (!playlist) notFound();
  const tableProps: TablePropsType = {
    limit: 10,
    viewAs: "LIST",
    replacePlaysWithPlaylist: true,
    showHead: false,
    playlist,
    showIndex: false,
  } as const;

  const addTrackToPlaylistFn = async (track: Track) => {
    const addData = { playlistId: playlist?.id ?? "", trackId: track.id };

    void addTrackToPlaylistToDB(addData);
    revalidate(`/playlist/${playlist?.id}`);
    dispatch(
      addTrack({
        trackData: track,
        artists:
          data?.authors?.filter(
            (author) =>
              track.authorIds.includes(author.id) ||
              track.authorId === author.id,
          ) ?? [],
        playlists:
          data?.albums?.filter((playlist) =>
            track.playlists.includes(playlist.id),
          ) ?? [],
      }),
    );
  };

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex justify-end">
        <Button
          size={showSearch ? "icon" : undefined}
          variant="ghost"
          onClick={() => setShowSearch((v) => !v)}
        >
          {!showSearch ? "find more" : <BsX />}
        </Button>
      </div>
      {showSearch && (
        <SearchTrack
          addTrackToPlaylistFn={addTrackToPlaylistFn}
          tableProps={tableProps}
        />
      )}
      {(data?.tracks?.length ?? 0) > 0 && (
        <RecommendedTracks
          addTrackToPlaylistFn={addTrackToPlaylistFn}
          data={data}
          isLoading={isLoading}
          tableProps={tableProps}
          artists={artists}
          playlist={playlist}
          tracks={tracks}
        />
      )}
    </div>
  );
}
