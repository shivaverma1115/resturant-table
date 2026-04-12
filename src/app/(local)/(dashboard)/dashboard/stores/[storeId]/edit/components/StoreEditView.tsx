"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { MediaUploadFormField } from "@/components/shared/media-upload";
import {
  FormFieldError,
  formFieldAriaErrorId,
} from "@/components/shared/FormFieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteStore, usePatchStore } from "@/features/store/hooks";
import type { StoreDto } from "@/features/store/types";
import { uploadStoreCoverMedia } from "@/features/store/upload-store-cover";
import {
  ROUTES,
  routeDashboardStoreItems,
  routeDashboardStorePreview,
  routeDashboardStoreSettings,
} from "@/lib/constants";
import { buildLocalCoverPath } from "@/lib/media/cover-path";
import { notifyException, showSuccessMessage } from "@/lib/notify";

const coverMediaSchema = z
  .object({
    url: z.string(),
    mimeType: z.string(),
    kind: z.enum(["image", "video"]),
    file: z.instanceof(File).optional(),
  })
  .nullable();

const storeEditSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(1, "Enter a store name.")
    .max(120, "Store name is too long."),
  publicNote: z.string().max(500).optional(),
  usesPaidStorage: z.boolean(),
  /** When true, public guest links `/store/.../order?table=...` work for ordering. */
  isLive: z.boolean(),
  coverMedia: coverMediaSchema.optional(),
});

export type StoreEditFormValues = z.infer<typeof storeEditSchema>;

function guessKindFromUrl(url: string): "image" | "video" {
  const u = url.toLowerCase();
  if (u.includes(".mp4") || u.includes(".webm") || u.includes("video")) {
    return "video";
  }
  return "image";
}

function guessMimeFromUrl(url: string): string {
  const u = url.toLowerCase();
  if (u.endsWith(".png")) return "image/png";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".gif")) return "image/gif";
  if (u.endsWith(".mp4")) return "video/mp4";
  if (u.endsWith(".webm")) return "video/webm";
  return "image/jpeg";
}

function coverMediaFromStore(store: StoreDto) {
  if (!store.coverMediaUrl?.trim()) {
    return null;
  }
  return {
    url: store.coverMediaUrl.trim(),
    mimeType: guessMimeFromUrl(store.coverMediaUrl),
    kind: guessKindFromUrl(store.coverMediaUrl),
  };
}

type StoreEditViewProps = Readonly<{
  storeId: string;
  initialStore: StoreDto | null;
  initialError?: string | null;
}>;

export function StoreEditView({
  storeId,
  initialStore,
  initialError,
}: StoreEditViewProps) {
  const router = useRouter();
  const { patch, pending: patchPending } = usePatchStore();
  const { remove, pending: deletePending } = useDeleteStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<StoreEditFormValues>({
    resolver: zodResolver(storeEditSchema),
    defaultValues: {
      storeName: "",
      publicNote: "",
      usesPaidStorage: false,
      isLive: false,
      coverMedia: null,
    },
  });

  const usesPaidStorage = useWatch({
    control,
    name: "usesPaidStorage",
    defaultValue: false,
  });

  useEffect(() => {
    if (initialStore) {
      reset({
        storeName: initialStore.name,
        publicNote: initialStore.publicNote ?? "",
        usesPaidStorage: initialStore.usesPaidStorage,
        isLive: initialStore.isLive,
        coverMedia: coverMediaFromStore(initialStore),
      });
    }
  }, [initialStore, reset]);

  const onSave = async (values: StoreEditFormValues) => {
    if (!initialStore) return;
    try {
      const coverMediaDirty = Boolean(dirtyFields.coverMedia);
      const publicNote =
        values.publicNote?.trim() === ""
          ? null
          : (values.publicNote?.trim() ?? null);

      let coverMediaUrl: string | null;
      let coverMediaLocalPath: string | null;

      if (values.usesPaidStorage) {
        const u = values.coverMedia?.url?.trim();
        coverMediaUrl =
          u && /^https?:\/\//i.test(u) ? u : null;
        coverMediaLocalPath = null;
      } else {
        coverMediaUrl = null;
        if (values.coverMedia?.file) {
          coverMediaLocalPath = buildLocalCoverPath(values.coverMedia.file.name);
        } else if (
          !coverMediaDirty &&
          initialStore.coverMediaLocalPath?.trim() &&
          !initialStore.coverMediaUrl?.trim()
        ) {
          coverMediaLocalPath = initialStore.coverMediaLocalPath.trim();
        } else {
          coverMediaLocalPath = null;
        }
      }

      await patch(storeId, {
        name: values.storeName.trim(),
        publicNote,
        usesPaidStorage: values.usesPaidStorage,
        isLive: values.isLive,
        coverMediaUrl,
        coverMediaLocalPath,
      });
      showSuccessMessage("Changes saved.");
      router.refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not save changes.");
    }
  };

  const onDelete = async () => {
    if (
      !window.confirm(
        "Delete this store? Tables and orders under it are not removed automatically.",
      )
    ) {
      return;
    }
    try {
      await remove(storeId);
      showSuccessMessage("Store deleted.");
      router.replace(ROUTES.DASHBOARD_STORES);
      router.refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not delete store.");
    }
  };

  const formLocked = isSubmitting || patchPending || deletePending;

  if (initialError) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit store
          </h1>
        </header>
        <p className="text-sm text-destructive">{initialError}</p>
        <Link
          href={ROUTES.DASHBOARD_STORES}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to stores
        </Link>
      </div>
    );
  }

  if (!initialStore) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Edit store
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Updates are saved to Firestore via{" "}
          <code className="rounded bg-surface-subtle px-1 py-0.5 text-xs">
            PATCH /api/stores/{storeId}
          </code>
          .{" "}
          <Link
            href={routeDashboardStoreSettings(storeId)}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            ← Store settings (overview)
          </Link>
          {" · "}
          <Link
            href={routeDashboardStorePreview(storeId)}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Open store preview
          </Link>
          {" · "}
          <Link
            href={routeDashboardStoreItems(storeId)}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Menu items
          </Link>
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Basics</h2>
        <p className="mt-1 text-sm text-muted">
          Public-facing name and an optional note for guests (e.g. on printed QR
          collateral).
        </p>
        <form
          className="mt-6 space-y-4"
          noValidate
          onSubmit={handleSubmit(onSave)}
        >
          <div className="space-y-2">
            <Label htmlFor="store-name">Store name</Label>
            <Input
              id="store-name"
              autoComplete="organization"
              disabled={formLocked}
              placeholder="e.g. Northside Bistro"
              variant={errors.storeName ? "error" : "default"}
              aria-invalid={!!errors.storeName}
              aria-describedby={
                errors.storeName
                  ? formFieldAriaErrorId("store-name")
                  : undefined
              }
              {...register("storeName")}
            />
            <FormFieldError
              fieldId="store-name"
              message={errors.storeName?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-publicNote">Guest-facing note (optional)</Label>
            <Input
              id="store-publicNote"
              disabled={formLocked}
              placeholder="e.g. Order at the table — we bring it to you."
              variant={errors.publicNote ? "error" : "default"}
              aria-invalid={!!errors.publicNote}
              aria-describedby={
                errors.publicNote
                  ? formFieldAriaErrorId("store-publicNote")
                  : undefined
              }
              {...register("publicNote")}
            />
            <FormFieldError
              fieldId="store-publicNote"
              message={errors.publicNote?.message}
            />
          </div>

          <div className="space-y-2 rounded-lg border border-border p-4">
            <Controller
              name="usesPaidStorage"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 rounded border-border accent-[var(--color-accent)]"
                    checked={field.value}
                    disabled={formLocked}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      setValue("coverMedia", null);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">
                      Use Firebase Storage (paid quota)
                    </span>
                    <p className="mt-1 text-xs text-muted">
                      When enabled, cover uploads go to your{" "}
                      <code className="rounded bg-surface-subtle px-1 py-0.5">
                        storageBucket
                      </code>{" "}
                      and the download URL is saved on the store. When disabled, a
                      disk path is saved (no Storage). Set{" "}
                      <code className="rounded bg-surface-subtle px-1 py-0.5">
                        NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT
                      </code>{" "}
                      in{" "}
                      <code className="rounded bg-surface-subtle px-1 py-0.5">
                        .env.local
                      </code>{" "}
                      to your real folder (e.g.{" "}
                      <code className="rounded bg-surface-subtle px-1 py-0.5">
                        D:\…\dummy profile pics
                      </code>
                      ), restart{" "}
                      <code className="rounded bg-surface-subtle px-1 py-0.5">
                        next dev
                      </code>
                      , then pick a file from that folder so the saved path matches
                      your PC and preview can load it.
                    </p>
                  </span>
                </label>
              )}
            />
            {initialStore.coverMediaLocalPath &&
            !initialStore.coverMediaUrl &&
            !usesPaidStorage ? (
              <p className="text-xs text-muted">
                Saved local path:{" "}
                <code className="rounded bg-surface-subtle px-1 py-0.5">
                  {initialStore.coverMediaLocalPath}
                </code>{" "}
                — upload again to replace.
              </p>
            ) : null}
          </div>

          <MediaUploadFormField
            key={usesPaidStorage ? "cloud" : "local"}
            control={control}
            name="coverMedia"
            mode={usesPaidStorage ? "cloud" : "local"}
            cloudUpload={
              usesPaidStorage
                ? async (file) => uploadStoreCoverMedia(storeId, file)
                : undefined
            }
            label="Cover image or video (optional)"
            description={
              usesPaidStorage
                ? "Uploads to Firebase Storage; the returned URL is saved on save."
                : "Saves a real folder + file path when NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT is set; otherwise local/cover/… (logical only)."
            }
            disabled={formLocked}
            aspect={16 / 9}
          />

          <div className="space-y-3 rounded-lg border border-border p-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Visibility</h3>
              <p className="mt-1 text-xs text-muted">
                Draft stores show “not taking orders” on public QR links. Use
                preview to check the guest screen before you go live.
              </p>
            </div>
            <Controller
              name="isLive"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 rounded border-border accent-[var(--color-accent)]"
                    checked={field.value}
                    disabled={formLocked}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">
                      Store is live (public ordering enabled)
                    </span>
                    <p className="mt-1 text-xs text-muted">
                      Turn off to hide the guest menu from QR codes while you
                      prepare.
                    </p>
                  </span>
                </label>
              )}
            />
            <Button variant="secondary" size="sm" asChild>
              <Link
                href={routeDashboardStorePreview(storeId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open preview in new tab
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={formLocked}>
              {formLocked ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="outline" type="button" disabled={formLocked} asChild>
              <Link href={routeDashboardStoreSettings(storeId)}>Cancel</Link>
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted">
          Deletes the store document only. Plan a cleanup job for subcollections
          if you use them in production.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="destructive"
            disabled={formLocked}
            onClick={() => void onDelete()}
          >
            {deletePending ? "Deleting…" : "Delete store"}
          </Button>
        </div>
      </section>
    </div>
  );
}
