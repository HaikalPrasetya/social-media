import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import { updateUserSchema, updateUserValues } from "@/lib/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdatePeofileMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import profilePicPlaceholder from "@/assets/avatar-placeholder.jpg";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "./CropImageDialog";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function EditProfileDialog({
  onClose,
  open,
  user,
}: EditProfileDialogProps) {
  const form = useForm<updateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const { mutate, isPending } = useUpdatePeofileMutation();

  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  async function onSubmit(values: updateUserValues) {
    if (!values) return;
    const newProfileFIle = croppedImage
      ? new File([croppedImage], `avatar_${user.id}.webp`)
      : undefined;

    mutate(
      { values, profilePic: newProfileFIle },
      {
        onSuccess: () => {
          onClose(false);
          setCroppedImage(null);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <Label>Poto Profile</Label>
          <AvatarInput
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : user.profilePicUrl || profilePicPlaceholder
            }
            onImageCropped={setCroppedImage}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Display name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton isLoading={isPending}>Update</LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image src={src} alt="Profile Image" width={150} height={150} />
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          onCropped={onImageCropped}
          aspectRatio={1}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
