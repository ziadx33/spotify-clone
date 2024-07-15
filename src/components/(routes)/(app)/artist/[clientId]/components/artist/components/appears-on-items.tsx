"use client";

import { type User, type Playlist } from "@prisma/client";
import { SectionItem } from "../../../../../components/section-item";
import { format } from "date-fns";
import { RenderCards } from "@/components/(routes)/(app)/components/render-cards";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AppearsOnItemsProps = {
  albums: Playlist[];
  artist: User;
};

export function AppearsOnItems({ albums, artist }: AppearsOnItemsProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className={cn(
            "mb-4 pl-0 text-3xl font-semibold text-white",
            showMoreButton
              ? "hover:underline"
              : " cursor-default hover:no-underline",
          )}
          asChild={showMoreButton}
        >
          {showMoreButton ? (
            <Link href={`/artist/${artist.id}/appears-on`}>Appears On</Link>
          ) : (
            "Appears On"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link href={`/artist/${artist.id}/appears-on`}>show more</Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-hidden">
        <RenderCards
          setShowMoreButton={setShowMoreButton}
          cards={albums.map((album: Playlist) => {
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
          })}
        />
      </div>
    </>
  );
}
