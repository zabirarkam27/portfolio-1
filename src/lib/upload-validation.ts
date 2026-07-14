export const imageContentTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const resumeContentTypes = ["application/pdf"] as const;

export type UploadKind = "profile-photo" | "resume" | "project-image";

export function allowedContentTypes(kind: UploadKind): string[] {
  return kind === "resume" ? [...resumeContentTypes] : [...imageContentTypes];
}

export function maxUploadBytes(kind: UploadKind) {
  return kind === "resume" ? 5 * 1024 * 1024 : 4 * 1024 * 1024;
}

export function validateUploadFile(kind: UploadKind, file: { type: string; size: number }) {
  if (!allowedContentTypes(kind).includes(file.type)) {
    throw new Error(`Unsupported content type: ${file.type}`);
  }

  const maxBytes = maxUploadBytes(kind);

  if (file.size > maxBytes) {
    throw new Error(`File is too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)}MB.`);
  }
}
