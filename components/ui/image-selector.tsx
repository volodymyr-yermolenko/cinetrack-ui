import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleSelectButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveButtonClick = () => {
    setPreviewImageUrl(null);
    onRemove();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        displayError(
          `File size exceeds the maximum of ${MAX_IMAGE_SIZE_MB}MB.`,
        );
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        displayError("Invalid file type");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      onSelect(file);
    }
  };

  const displayError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 2000);
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
        <Image
          src={previewImageUrl || noImage}
          alt="Selected Image"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-gray-500 text-sm">
          Allowed file types: {ACCEPTED_IMAGE_EXTENSIONS.join(", ")} (max{" "}
          {MAX_IMAGE_SIZE_MB}MB)
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1">
            <div>
              <button
                className="btn btn-small btn-secondary w-32"
                type="button"
                onClick={handleSelectButtonClick}
              >
                Select Image
              </button>
            </div>
            <span
              className={`p-2 text-red-500 text-sm ${
                showError
                  ? "opacity-100"
                  : "transition-opacity duration-1000 opacity-0"
              }`}
            >
              {errorMessage}
            </span>
          </div>
          <div>
            {previewImageUrl && (
              <button
                type="button"
                onClick={handleRemoveButtonClick}
                className="btn btn-small btn-alert w-32"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
