import { upload } from "@vercel/blob/client";

import { validateUploadFile, type UploadKind } from "@/lib/upload-validation";

type UploadAssetOptions = {
  file: File;
  kind: UploadKind;
  projectId?: string;
  achievementId?: string;
  uploadSecret?: string;
};

export async function uploadAsset({
  file,
  kind,
  projectId,
  achievementId,
  uploadSecret,
}: UploadAssetOptions) {
  validateUploadFile(kind, file);

  return upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/uploads/blob",
    clientPayload: JSON.stringify({
      kind,
      projectId,
      achievementId,
      uploadSecret,
    }),
  });
}
