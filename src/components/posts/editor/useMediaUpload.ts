import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { toast } from "sonner";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUpload: boolean;
}

export function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing("attachments", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();

        return new File(
          [file],
          `attachments_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUpload: true,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadImageProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((p) => {
          const uploadResult = res.find((r) => r.name === p.file.name);

          if (!uploadResult) return p;

          return {
            ...p,
            isUpload: false,
            mediaId: uploadResult.serverData.mediaId,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((p) => !p.isUpload));
      toast.error(e.message);
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error(
        "Masih ada proses upload yang berjalan, mohon tunggu sebentar!",
      );
      return;
    }

    if (attachments.length + files.length > 5) {
      toast.error("Tidak dapat mengirim file lebih dari 5");
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((f) => f.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadImageProgress(0);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadImageProgress,
    removeAttachment,
    reset,
  };
}
