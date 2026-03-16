"use client";

import Image from "next/image";
import { WatchEntry } from "../types/watch-entry";
import noImage from "@/public/no-image.jpg";
import { getGenreList } from "@/lib/utils/movie-utils";
import {
  Calendar,
  MessageCircleMore,
  SquarePen,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Rating } from "@/components/ui/rating";
import { VIEWING_CONTEXT_MAP } from "@/constants/movies";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteWatchEntryAction } from "../actions/delete-watch-entry-action";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";

interface WatchEntryCardProps {
  watchEntry: WatchEntry;
}

export default function WatchEntryCard({ watchEntry }: WatchEntryCardProps) {
  const imageScr = watchEntry.movie.imageUrl || noImage;
  const genreList = getGenreList(watchEntry.movie.genres);

  const router = useRouter();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const deleteWatchEntryActionWithId = deleteWatchEntryAction.bind(
    null,
    watchEntry.id,
  );
  const [deleteState, deleteAction, isPending] = useActionState(
    deleteWatchEntryActionWithId,
    {
      success: false,
    },
  );

  useEffect(() => {
    if (deleteState.success) {
      setIsConfirmDialogOpen(false);
    }
  }, [deleteState.success]);

  const handleDeleteClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    startTransition(() => {
      deleteAction();
    });
    router.refresh();
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <div className="w-full p-4 bg-white rounded-lg items-start shadow-sm hover:shadow-md overflow-hidden transition-shadow flex flex-row gap-5">
        <div className="rounded-lg overflow-hidden relative w-[135px] h-[155px]">
          <Image
            src={imageScr}
            alt={watchEntry.movie.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-1 flex flex-col w-full gap-1">
          <div className="text-lg font-semibold">{watchEntry.movie.title}</div>
          <div className="text-sm text-gray-600">
            <span>{watchEntry.movie.releaseYear}</span>
            <span> • </span>
            <span>{genreList}</span>
          </div>
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDateTime(watchEntry.watchedDate, true)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-400" />
              <span>Rating:</span>
              <Rating value={watchEntry.rating} />
            </div>
            <div className="flex items-start gap-2">
              <MessageCircleMore className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span>{watchEntry.review || "No review"}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>
                Watched: {VIEWING_CONTEXT_MAP[watchEntry.viewingContext]}
              </span>
            </div>
          </div>
        </div>
        <div className="w-24 flex gap-2">
          <button className="btn-icon btn-secondary">
            <SquarePen className="w-4 h-4" />
          </button>
          <button className="btn-icon btn-alert" onClick={handleDeleteClick}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        header="Delete Watch"
        message={`Are you sure you want to delete "${watchEntry.movie.title}" watch? This action cannot be undone.`}
        isPending={isPending}
        error={deleteState.formErrors?.[0]}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
