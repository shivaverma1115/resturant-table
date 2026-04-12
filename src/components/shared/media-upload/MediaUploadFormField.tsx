"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormFieldError,
  formFieldAriaErrorId,
} from "@/components/shared/FormFieldError";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

import { MediaUploadModal } from "./MediaUploadModal";
import type { CloudUploadHandler, MediaFieldValue, MediaUploadMode } from "./types";
import { isVideoMime } from "./types";

export type MediaUploadFormFieldProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: FieldPath<T>;
  mode: MediaUploadMode;
  cloudUpload?: CloudUploadHandler;
  aspect?: number;
  label: string;
  description?: string;
  disabled?: boolean;
  modalTitle?: string;
  modalDescription?: string;
  className?: string;
}>;

export function MediaUploadFormField<T extends FieldValues>({
  control,
  name,
  mode,
  cloudUpload,
  aspect,
  label,
  description,
  disabled,
  modalTitle,
  modalDescription,
  className,
}: MediaUploadFormFieldProps<T>) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const prevBlobRef = useRef<string | null>(null);

  const {
    field: { value, onChange, ref, onBlur },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const media = value as MediaFieldValue | null | undefined;

  useEffect(() => {
    const url = media?.url ?? null;
    const prev = prevBlobRef.current;
    if (prev && prev.startsWith("blob:") && prev !== url) {
      URL.revokeObjectURL(prev);
    }
    prevBlobRef.current = url?.startsWith("blob:") ? url : null;
  }, [media?.url]);

  const clear = () => {
    if (media?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(media.url);
    }
    prevBlobRef.current = null;
    onChange(null);
  };

  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      onBlur={onBlur}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Label htmlFor={`${baseId}-trigger`}>{label}</Label>
          {description ? (
            <p className="mt-1 text-xs text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          {media ? (
            <Button
              id={`${baseId}-trigger`}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? formFieldAriaErrorId(`${baseId}-trigger`) : undefined
              }
              onClick={() => setOpen(true)}
            >
              Replace
            </Button>
          ) : (
            <Button
              id={`${baseId}-trigger`}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? formFieldAriaErrorId(`${baseId}-trigger`) : undefined
              }
              onClick={() => setOpen(true)}
            >
              <ImagePlus className="size-4" aria-hidden />
              Upload
            </Button>
          )}
          {media ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={clear}
              aria-label="Remove media"
            >
              <X className="size-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>

      {media ? (
        <div className="overflow-hidden rounded-lg border border-border bg-zinc-950/30">
          {isVideoMime(media.mimeType) ? (
            <video
              src={media.url}
              controls
              className="mx-auto max-h-48 w-full object-contain"
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- blob or remote URL
            <img
              src={media.url}
              alt=""
              className="mx-auto max-h-48 w-full object-contain"
            />
          )}
        </div>
      ) : null}

      <FormFieldError
        fieldId={`${baseId}-trigger`}
        message={error?.message}
      />

      <MediaUploadModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        cloudUpload={cloudUpload}
        aspect={aspect}
        title={modalTitle ?? label}
        description={
          modalDescription ??
          (mode === "local"
            ? "Preview uses a temporary URL. Persist by uploading in Cloud mode or your own API."
            : "Files are uploaded to Firebase Storage when you confirm.")
        }
        onConfirm={(result) => {
          onChange(result);
          setOpen(false);
        }}
      />
    </div>
  );
}
