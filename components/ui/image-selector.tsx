import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/images";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import noImage from "@/public/no-image.jpg";

interface ImageSelectorProps {
  imageUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function ImageSelector({
  imageUrl,
  onSelect,
  onRemove,
}: ImageSelectorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    imageUrl,
  );
  const [isInvalidFileType, setIsInvalidFileType] = useState(false);

  const handleSelectButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveButtonClick = () => {
    setPreviewImageUrl(null);
    setIsInvalidFileType(false);
    onRemove();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setIsInvalidFileType(false);
        const url = URL.createObjectURL(file);
        setPreviewImageUrl(url);
      } else {
        setIsInvalidFileType(true);
        setPreviewImageUrl(null);
      }
      onSelect(file);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return (
    <div className="flex flex-row gap-3">
      <div className="w-[150px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden relative">
        <input
          type="file"
          hidden
          ref={inputRef}
          accept={ACCEPTED_IMAGE_TYPES.join(", ")}
          onChange={handleImageChange}
        />
        {isInvalidFileType ? (
          <span className="p-2 text-red-500 text-sm">Invalid file type</span>
        ) : (
          <Image
            src={previewImageUrl || noImage}
            alt="Selected Image"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-gray-500 text-sm">
          Allowed: {ACCEPTED_IMAGE_EXTENSIONS.join(", ")} (max{" "}
          {MAX_IMAGE_SIZE_MB}MB)
        </p>
        <div className="w-[130px] flex flex-col gap-3">
          <button
            className="btn-secondary"
            type="button"
            onClick={handleSelectButtonClick}
          >
            Select Image
          </button>
          {(previewImageUrl || isInvalidFileType) && (
            <button
              type="button"
              onClick={handleRemoveButtonClick}
              className="btn-danger"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
