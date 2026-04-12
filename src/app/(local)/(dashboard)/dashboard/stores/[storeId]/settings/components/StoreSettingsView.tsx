"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormFieldError,
  formFieldAriaErrorId,
} from "@/components/shared/FormFieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteStore, usePatchStore } from "@/features/store/hooks";
import type { StoreDto } from "@/features/store/types";
import { ROUTES } from "@/lib/constants";
import { notifyException, showSuccessMessage } from "@/lib/notify";

const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(1, "Enter a store name.")
    .max(120, "Store name is too long."),
  publicNote: z.string().max(500).optional(),
});

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;

type StoreSettingsViewProps = Readonly<{
  storeId: string;
  initialStore: StoreDto | null;
  initialError?: string | null;
}>;

export function StoreSettingsView({
  storeId,
  initialStore,
  initialError,
}: StoreSettingsViewProps) {
  const router = useRouter();
  const { patch, pending: patchPending } = usePatchStore();
  const { remove, pending: deletePending } = useDeleteStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "",
      publicNote: "",
    },
  });

  useEffect(() => {
    if (initialStore) {
      reset({
        storeName: initialStore.name,
        publicNote: initialStore.publicNote ?? "",
      });
    }
  }, [initialStore, reset]);

  const onSave = async (values: StoreSettingsFormValues) => {
    try {
      await patch(storeId, {
        name: values.storeName.trim(),
        publicNote:
          values.publicNote?.trim() === ""
            ? null
            : (values.publicNote?.trim() ?? null),
      });
      showSuccessMessage("Store settings saved.");
      router.refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not save store settings.");
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
            Store settings
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
          Store settings
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          You own this store. Updates are saved to Firestore via{" "}
          <code className="rounded bg-surface-subtle px-1 py-0.5 text-xs">
            PATCH /api/stores/{storeId}
          </code>
          .
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
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={formLocked}>
              {formLocked ? "Saving…" : "Save settings"}
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
