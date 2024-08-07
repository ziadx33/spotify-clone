import { type User } from "@prisma/client";
import { UserContent } from "./components/user-content";
import { handleRequests } from "@/utils/handle-requests";
import { getPlaylists } from "@/server/actions/playlist";
import { getFollowedArtists } from "@/server/actions/user";
import { getArtistsByIds, getUserTopTracks } from "@/server/actions/track";
import { getTopArtists } from "@/utils/get-top-artists";

type ProfileProps = {
  user?: User;
  isUser: boolean;
};

export async function User({ user, isUser }: ProfileProps) {
  const TopTracks = await getUserTopTracks({ user });

  const requests = [
    getPlaylists({ creatorId: user?.id ?? "", playlistIds: [] }),
    getFollowedArtists({ userId: user?.id ?? "" }),
    getArtistsByIds(
      TopTracks.data.tracks.map((track) => track.authorIds).flat(),
    ),
  ] as const;

  const [{ data: publicPlaylists }, followedArtists, artists] =
    await handleRequests(requests);

  const topArtists = getTopArtists({
    artists,
    trackIds: TopTracks.trackIds,
    tracks: TopTracks.data.tracks,
  });

  return (
    <UserContent
      isUser={isUser}
      followedArtists={followedArtists}
      publicPlaylists={publicPlaylists ?? []}
      user={user}
      topArtists={topArtists}
      topTracks={TopTracks.data}
    />
  );
}
