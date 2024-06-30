"use server";

import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { db } from "../db";
import { unstable_cache } from "next/cache";
import { cache } from "react";

type GetPlaylistsParams = {
  creatorId: string;
  playlistIds: string[];
};

export const getPlaylists = unstable_cache(
  cache(
    async ({
      creatorId,
      playlistIds,
    }: GetPlaylistsParams): Promise<PlaylistsSliceType> => {
      try {
        console.log("shoulder", playlistIds);
        const playlists = await db.playlist.findMany({
          where: {
            OR: [
              {
                creatorId,
              },
              {
                id: {
                  in: playlistIds,
                },
              },
            ],
          },
        });

        return {
          data: playlists,
          status: "success",
          error: null,
        };
      } catch (error) {
        return {
          status: "error",
          error: (error as { message: string }).message,
          data: null,
        };
      }
    },
  ),
  ["playlists"],
);

export const getPlaylist = unstable_cache(
  cache(async (playlistId: string) => {
    try {
      const playlist = await db.playlist.findUnique({
        where: { id: playlistId },
      });
      return playlist;
    } catch (error) {
      throw { error };
    }
  }),
  ["playlist", "id"],
);
