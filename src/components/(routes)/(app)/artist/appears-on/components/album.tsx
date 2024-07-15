import { type User, type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { SectionItem } from "../../../components/section-item";

type AlbumProps = {
  album: Playlist;
  artist: User;
};

export function Album({ album }: AlbumProps) {
  return (
    <SectionItem
      key={album.id}
      alt={album.title}
      showPlayButton
      title={album.title}
      image={album.imageSrc}
      description={`${format(new Date(album.createdAt), "yyy")} - ${album.type.toLowerCase()}`}
      link={`/playlist/${album.id}`}
    />
  );
}
