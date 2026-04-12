"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { getCroppedImageBlob } from "@/lib/media/crop-image";
import { showErrorMessage } from "@/lib/notify";

import type {
  CloudUploadHandler,
  MediaKind,
  MediaUploadMode,
  MediaUploadResult,
} from "./types";
import { isImageMime, isVideoMime } from "./types";

type Step = "pick" | "crop" | "preview";

export type MediaUploadModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: MediaUploadMode;
  onConfirm: (result: MediaUploadResult) => void;
  /** Required when `mode` is `"cloud"`. */
  cloudUpload?: CloudUploadHandler;
  /** Crop aspect ratio (`react-easy-crop`). Default `4 / 3`. */
  aspect?: number;
  title?: string;
  description?: string;
  className?: string;
}>;

const DEFAULT_ASPECT = 4 / 3;

function revoke(url: string | null) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function MediaUploadModal({
  open,
  onOpenChange,
  mode,
  onConfirm,
  cloudUpload,
  aspect = DEFAULT_ASPECT,
  title = "Upload media",
  description = "Choose an image or video. Images can be cropped before saving.",
  className,
}: MediaUploadModalProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Uncropped pick — used when user goes “Re-crop” from preview. */
  const originalImageFileRef = useRef<File | null>(null);

  const [step, setStep] = useState<Step>("pick");
  const [workingFile, setWorkingFile] = useState<File | null>(null);
  const [kind, setKind] = useState<MediaKind | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      return;
    }
    revoke(imageSrc);
    revoke(previewUrl);
    setStep("pick");
    setWorkingFile(null);
    setKind(null);
    setImageSrc(null);
    setPreviewUrl(null);
    originalImageFileRef.current = null;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [open, imageSrc, previewUrl]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!isImageMime(file.type) && !isVideoMime(file.type)) {
      showErrorMessage("Please choose an image or video file.");
      return;
    }

    setImageSrc((prev) => {
      revoke(prev);
      return null;
    });
    setPreviewUrl((prev) => {
      revoke(prev);
      return null;
    });
    originalImageFileRef.current = null;

    setWorkingFile(file);

    if (isVideoMime(file.type)) {
      setKind("video");
      setPreviewUrl(URL.createObjectURL(file));
      setStep("preview");
      return;
    }

    setKind("image");
    originalImageFileRef.current = file;
    setImageSrc(URL.createObjectURL(file));
    setStep("crop");
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels || !workingFile) {
      showErrorMessage("Adjust the crop area first.");
      return;
    }
    const outMime =
      workingFile.type === "image/png" ? "image/png" : "image/jpeg";
    try {
      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels,
        outMime,
      );
      const ext = outMime === "image/png" ? "png" : "jpg";
      const base = workingFile.name.replace(/\.[^.]+$/, "") || "image";
      const croppedFile = new File([blob], `${base}.${ext}`, {
        type: blob.type || outMime,
      });
      setImageSrc((prev) => {
        revoke(prev);
        return null;
      });
      setWorkingFile(croppedFile);
      setPreviewUrl((prev) => {
        revoke(prev);
        return URL.createObjectURL(blob);
      });
      setStep("preview");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not crop image.";
      showErrorMessage(msg);
    }
  };

  const backFromCrop = () => {
    setImageSrc((prev) => {
      revoke(prev);
      return null;
    });
    setWorkingFile(null);
    setKind(null);
    originalImageFileRef.current = null;
    setCroppedAreaPixels(null);
    setStep("pick");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const backFromPreviewImageToCrop = () => {
    const original = originalImageFileRef.current;
    if (!original || kind !== "image") {
      return;
    }
    setPreviewUrl((prev) => {
      revoke(prev);
      return null;
    });
    setWorkingFile(original);
    setImageSrc(URL.createObjectURL(original));
    setStep("crop");
  };

  const finish = async () => {
    if (!workingFile || !kind) {
      showErrorMessage("No file selected.");
      return;
    }

    if (mode === "cloud") {
      if (!cloudUpload) {
        showErrorMessage("Cloud upload is not configured.");
        return;
      }
      setSubmitting(true);
      try {
        const hosted = await cloudUpload(workingFile, {
          mimeType: workingFile.type,
          kind,
        });
        onConfirm({
          url: hosted,
          mimeType: workingFile.type,
          kind,
        });
        onOpenChange(false);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Upload failed. Try again.";
        showErrorMessage(msg);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const handoffUrl = URL.createObjectURL(workingFile);
    revoke(previewUrl);
    revoke(imageSrc);
    setPreviewUrl(null);
    setImageSrc(null);
    onConfirm({
      url: handoffUrl,
      file: workingFile,
      mimeType: workingFile.type,
      kind,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {step === "pick" && (
          <div className="space-y-3">
            <Label htmlFor={inputId} className="sr-only">
              Choose file
            </Label>
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept="image/*,video/*"
              className="block w-full cursor-pointer text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-surface-subtle file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-surface-muted"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <p className="text-xs text-muted">
              Videos are not cropped. Size limits can be enforced in Cloud mode
              with Storage rules.
            </p>
          </div>
        )}

        {step === "crop" && imageSrc && kind === "image" && (
          <div className="space-y-4">
            <div className="relative h-56 w-full overflow-hidden rounded-lg bg-zinc-900 sm:h-64">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-zoom">Zoom</Label>
              <input
                id="media-zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button type="button" variant="outline" onClick={backFromCrop}>
                Back
              </Button>
              <Button type="button" onClick={() => void applyCrop()}>
                Preview crop
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "preview" && previewUrl && kind && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-zinc-950/40">
              {kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="mx-auto max-h-64 w-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="mx-auto max-h-64 w-full"
                  playsInline
                />
              )}
            </div>
            <p className="text-xs text-muted">
              {mode === "local"
                ? "Local mode: the form receives a temporary blob URL (and a File for a later Storage upload)."
                : "Cloud mode: confirm to upload to Firebase Storage and use the returned URL."}
            </p>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (kind === "image") {
                    backFromPreviewImageToCrop();
                  } else {
                    setPreviewUrl((prev) => {
                      revoke(prev);
                      return null;
                    });
                    setWorkingFile(null);
                    setKind(null);
                    setStep("pick");
                  }
                }}
              >
                {kind === "image" ? "Re-crop" : "Choose another"}
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => void finish()}
              >
                {submitting ? "Uploading…" : "Use this media"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
