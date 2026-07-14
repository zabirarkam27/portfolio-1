import { upload } from "@vercel/blob/client";

import type { UploadKind } from "@/lib/upload-assets";

type UploadAssetOptions = {
  file: File;
  kind: UploadKind;
  projectId?: string;
  uploadSecret?: string;
};

export async function uploadAsset({ file, kind, projectId, uploadSecret }: UploadAssetOptions) {
  return upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/uploads/blob",
    clientPayload: JSON.stringify({
      kind,
      projectId,
      uploadSecret,
    }),
  });
}
