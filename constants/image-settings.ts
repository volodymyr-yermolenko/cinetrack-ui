export const MAX_IMAGE_SIZE_MB = 1;

export const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_IMAGE_EXTENSIONS = ACCEPTED_IMAGE_TYPES.map((type) => {
  const parts = type.split("/");
  return `.${parts[1]}`;
});
