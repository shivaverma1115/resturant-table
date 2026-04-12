"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormFieldError,
  formFieldAriaErrorId,
} from "@/components/shared/FormFieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACCOUNT_DELETE_CONFIRM_PHRASE,
  ROUTES,
} from "@/lib/constants";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { showErrorMessage, showSuccessMessage } from "@/lib/notify";
import type { ProfileResponse } from "@/lib/profile-types";

const profileFormSchema = z
  .object({
    displayName: z.string().max(120),
    age: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const raw = data.age?.trim() ?? "";
    if (raw === "") return;
    if (!/^\d{1,3}$/.test(raw)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["age"],
        message: "Enter a valid age.",
      });
      return;
    }
    const n = parseInt(raw, 10);
    if (n < 1 || n > 130) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["age"],
        message: "Age must be between 1 and 130.",
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileState {
  status: "loading" | "error" | "ready";
  message?: string;
  record?: ProfileResponse;
}

type ProfileViewProps = Readonly<{
  initialProfile?: ProfileResponse;
  initialError?: string;
}>;

function initialProfileState(
  initialProfile: ProfileResponse | undefined,
  initialError: string | undefined,
): ProfileState {
  if (initialError) return { status: "error", message: initialError };
  if (initialProfile) return { status: "ready", record: initialProfile };
  return { status: "loading" };
}

export function ProfileView({
  initialProfile,
  initialError,
}: ProfileViewProps = {}) {
  const router = useRouter();
  const fetchOnMount =
    initialProfile === undefined && initialError === undefined;

  const [profileState, setProfileState] = useState<ProfileState>(() => initialProfileState(initialProfile, initialError),);
  const [accountDeletePhrase, setAccountDeletePhrase] = useState("");
  const [accountDeleting, setAccountDeleting] = useState(false);

  const loadProfile = useCallback(async () => {
    setProfileState({ status: "loading" });
    try {
      const res = await fetch("/api/profile", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setProfileState({
          status: "error",
          message: data?.error?.trim() ?? "Could not load profile.",
        });
        return;
      }
      setProfileState({ status: "ready", record: data as ProfileResponse });
    } catch {
      setProfileState({ status: "error", message: "Could not load profile." });
    }
  }, []);

  useEffect(() => {
    if (!fetchOnMount) return;
    void loadProfile();
  }, [fetchOnMount, loadProfile]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { displayName: "", age: "" as string | undefined },
    mode: "onTouched",
  });

  useEffect(() => {
    if (profileState.status !== "ready") return;
    reset({
      displayName: profileState.record?.displayName ?? "",
      age: String(profileState.record?.profile.age ?? "")
    });
  }, [profileState, reset]);

  const onDeleteAccount = useCallback(async () => {
    if (accountDeletePhrase.trim() !== ACCOUNT_DELETE_CONFIRM_PHRASE) {
      showErrorMessage(
        `Type exactly ${ACCOUNT_DELETE_CONFIRM_PHRASE} in the box to confirm.`,
      );
      return;
    }
    setAccountDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          confirmPhrase: ACCOUNT_DELETE_CONFIRM_PHRASE,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        deletedStoreCount?: number;
      } | null;
      if (!res.ok) {
        showErrorMessage(data?.error?.trim() ?? "Could not delete account.");
        return;
      }
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {
        /* still proceed */
      });
      try {
        await signOut(getFirebaseClientAuth());
      } catch {
        /* Firebase may be unavailable */
      }
      showSuccessMessage("Your account and data have been removed.");
      router.replace(ROUTES.HOME);
      router.refresh();
    } catch (e: unknown) {
      showErrorMessage(
        e instanceof Error ? e.message : "Could not delete account.",
      );
    } finally {
      setAccountDeleting(false);
    }
  }, [accountDeletePhrase, router]);

  const onSave = async (values: ProfileFormValues) => {
    const ageRaw = values.age?.trim() ?? "";
    const agePayload = ageRaw === "" ? null : parseInt(ageRaw, 10);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName: values.displayName.trim(),
          age: agePayload,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        showErrorMessage(data.error?.trim() ?? "Could not save profile.");
        return;
      }
      setProfileState({ status: "ready", record: data });
      await getFirebaseClientAuth().currentUser?.reload();
      showSuccessMessage("Profile updated.");
    } catch (error: any) {
      showErrorMessage(error?.message?? "Could not save profile.");
    }
  };

  const { record } = profileState;
  const formLocked = isSubmitting;

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Account</h2>
        <p className="mt-1 text-sm text-muted">
          Email and phone are managed for your security and cannot be changed here.
        </p>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <dt>
              <Label className="text-muted">Email</Label>
            </dt>
            <dd>
              <Input
                readOnly
                disabled
                value={record?.email ?? "—"}
                className="bg-surface-subtle"
                aria-label="Email (read only)"
              />
            </dd>
            {record?.emailVerified ? (
              <p className="text-xs text-muted">Verified</p>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Email not verified
              </p>
            )}
          </div>
          <div className="space-y-2">
            <dt>
              <Label className="text-muted">Phone</Label>
            </dt>
            <dd>
              <Input
                readOnly
                disabled
                value={record?.phoneNumber ?? "—"}
                className="bg-surface-subtle"
                aria-label="Phone (read only)"
              />
            </dd>
            <p className="text-xs text-muted">Contact support to change your phone number.</p>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Your details</h2>
        <p className="mt-1 text-sm text-muted">
          Update the name shown on your account and your age.
        </p>
        <form
          className="mt-6 space-y-4"
          noValidate
          onSubmit={handleSubmit(onSave)}
        >
          <div className="space-y-2">
            <Label htmlFor="profile-displayName">Full name</Label>
            <Input
              id="profile-displayName"
              autoComplete="name"
              disabled={formLocked}
              variant={errors.displayName ? "error" : "default"}
              aria-invalid={!!errors.displayName}
              aria-describedby={
                errors.displayName
                  ? formFieldAriaErrorId("profile-displayName")
                  : undefined
              }
              {...register("displayName")}
            />
            <FormFieldError
              fieldId="profile-displayName"
              message={errors.displayName?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-age">Age</Label>
            <Input
              id="profile-age"
              type="number"
              inputMode="numeric"
              min={1}
              max={130}
              placeholder="Optional"
              disabled={formLocked}
              variant={errors.age ? "error" : "default"}
              aria-invalid={!!errors.age}
              aria-describedby={
                errors.age ? formFieldAriaErrorId("profile-age") : undefined
              }
              {...register("age")}
            />
            <FormFieldError fieldId="profile-age" message={errors.age?.message} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={formLocked}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-destructive/40 bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-destructive">Delete account</h2>
        <p className="mt-1 text-sm text-muted">
          Permanently deletes your Firebase login, profile, and{" "}
          <strong className="text-foreground">every store you own</strong> (menu
          items, Realtime Database orders and push subscriptions for those stores).
          This cannot be undone.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="account-delete-confirm">Confirmation phrase</Label>
          <Input
            id="account-delete-confirm"
            autoComplete="off"
            placeholder={ACCOUNT_DELETE_CONFIRM_PHRASE}
            value={accountDeletePhrase}
            onChange={(e) => setAccountDeletePhrase(e.target.value)}
            disabled={accountDeleting}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted">
            Type{" "}
            <span className="font-mono font-medium text-foreground">
              {ACCOUNT_DELETE_CONFIRM_PHRASE}
            </span>{" "}
            to enable the button below.
          </p>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            variant="destructive"
            disabled={
              accountDeleting ||
              accountDeletePhrase.trim() !== ACCOUNT_DELETE_CONFIRM_PHRASE
            }
            onClick={() => void onDeleteAccount()}
          >
            {accountDeleting ? "Deleting…" : "Delete my account forever"}
          </Button>
        </div>
      </section>
    </div>
  );
}
