import { type User, type Track, type Playlist } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type TracksSliceType =
  | { status: "loading"; data: null; error: null }
  | {
      status: "success";
      data: {
        tracks: Track[] | null;
        authors: User[] | null;
        albums: Playlist[] | null;
      };
      error: null;
    }
  | { status: "error"; data: null; error: string };

const initialState: TracksSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const tracksSlice = createSlice({
  name: "tracks",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as TracksSliceType,
  reducers: {
    setTracks(state, { payload }: { payload: TracksSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    removeTrackFromPlaylist(
      state,
      { payload }: { payload: { trackId: string; playlistId: string } },
    ) {
      if (state.data?.tracks)
        state.data.tracks = state.data?.tracks?.map((track) => {
          if (track.id === payload.trackId)
            return {
              ...track,
              playlists: track.playlists.filter(
                (playlist) => playlist !== payload.playlistId,
              ),
            };
          return track;
        });
    },
    addTrackToPlaylist(
      state,
      { payload }: { payload: { trackId: string; playlistId: string } },
    ) {
      if (state.data?.tracks)
        state.data.tracks = state.data?.tracks?.map((track) => {
          if (track.id === payload.trackId)
            return {
              ...track,
              playlists: [...track.playlists, payload.playlistId],
            };
          return track;
        });
    },
  },
});

export const { setTracks, removeTrackFromPlaylist, addTrackToPlaylist } =
  tracksSlice.actions;

export default tracksSlice.reducer;
