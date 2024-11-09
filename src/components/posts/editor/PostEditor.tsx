"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { useSubmitPost } from "./mutations";
import { Attachment, useMediaUpload } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageIcon, Loader2, X } from "lucide-react";
import { ClipboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "@uploadthing/react";

export default function PostEditor() {
  const { user } = useSession();
  const { mutate } = useSubmitPost();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset,
    startUpload,
    uploadImageProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...getProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Apa yang sedang anda pikirkan?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = () => {
    mutate(
      {
        content: input,
        mediaIds: attachments.map((media) => media.mediaId!),
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          reset();
        },
      },
    );
  };

  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];

    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-secondary p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.profilePicUrl!} />
        <div {...getProps} className="w-full">
          <EditorContent
            editor={editor}
            onPaste={onPaste}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentsPreview
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
        />
      )}
      <div className="flex justify-end">
        {isUploading && (
          <>
            <span className="text-sm">{uploadImageProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin" />
          </>
        )}
        <AddAttachmentsButtonProps
          disabled={isUploading || attachments.length >= 5}
          onFilesSelected={startUpload}
        />
        <LoadingButton
          disabled={isUploading}
          isLoading={false}
          className="text-md w-fit font-semibold"
          onClick={onSubmit}
        >
          Posting
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButtonProps({
  disabled,
  onFilesSelected,
}: AddAttachmentsButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        className="sr-only hidden"
        ref={fileRef}
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files!);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentsPreviewsProps {
  attachments: Attachment[];
  onRemoveAttachment: (fileName: string) => void;
}

function AttachmentsPreview({
  attachments,
  onRemoveAttachment,
}: AttachmentsPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => onRemoveAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, isUpload, mediaId },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUpload && "bg-opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUpload && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
