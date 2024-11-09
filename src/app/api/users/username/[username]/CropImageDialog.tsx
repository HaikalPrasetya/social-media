import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface CropImageDialogProps {
  aspectRatio: number;
  src: string;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

function CropImageDialog({
  aspectRatio,
  onClose,
  onCropped,
  src,
}: CropImageDialogProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={aspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onCrop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CropImageDialog;
