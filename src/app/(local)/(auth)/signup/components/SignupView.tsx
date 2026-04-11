"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useAuthUser } from "@/components/shared/AuthProvider";
import {
  FormFieldError,
  formFieldAriaErrorId,
} from "@/components/shared/FormFieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCT, ROUTES } from "@/lib/constants";
import { showErrorMessage, showSuccessMessage } from "@/lib/notify";
import { z } from "zod";

export type SignupFormValues = z.infer<typeof signupFormSchema>;

const signupFormSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function SignupView({
  envStatus,
}: Readonly<{
  envStatus: {
    ready: boolean;
    hasWebApiKey: boolean;
    hasAdmin: boolean;
  };
}>) {
  const signupApiConfigured = envStatus.ready;
  const router = useRouter();
  const { refreshHttpSession } = useAuthUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const formLocked = isSubmitting || !signupApiConfigured;

  const handleSignup = async (data: SignupFormValues) => {
    if (!signupApiConfigured) {
      showErrorMessage("Signup is not available on this server.");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        }),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        showErrorMessage(json.message?.trim() ?? "Could not complete signup.");
        return;
      }

      showSuccessMessage(json.message?.trim() ?? "Signed in.");
      await refreshHttpSession();
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch (e: unknown) {
      showErrorMessage(
        e instanceof Error && e.message.trim() ? e.message : "Something went wrong.",
      );
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-background p-8 shadow-theme-sm">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Login / Signup
        </h1>
      </div>
      {!signupApiConfigured ? (
        <div className="ui-error-callout space-y-2" role="alert">
          <p className="font-medium">Signup needs both web config and Admin (for the session cookie).</p>
          <ul className="list-inside list-disc text-sm">
            {!envStatus.hasWebApiKey ? (
              <li>
                Add <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> and the other required{" "}
                <code>NEXT_PUBLIC_FIREBASE_*</code> fields in <code>.env</code>.
              </li>
            ) : null}
            {!envStatus.hasAdmin ? (
              <li>
                Add Firebase Admin credentials in <code>.env</code>: either{" "}
                <code>FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON</code> (or{" "}
                <code>FIREBASE_SERVICE_ACCOUNT_JSON</code>), or{" "}
                <code>FIREBASE_ADMIN_CLIENT_EMAIL</code> +{" "}
                <code>FIREBASE_ADMIN_PRIVATE_KEY</code>, or set{" "}
                <code>GOOGLE_APPLICATION_CREDENTIALS</code> to the full path of your
                downloaded service-account JSON file (then set{" "}
                <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code> or{" "}
                <code>GCLOUD_PROJECT</code> if the file has no project id).
              </li>
            ) : null}
          </ul>
          <p className="text-sm">Restart <code>npm run dev</code> after changing <code>.env</code>.</p>
        </div>
      ) : null}
      <form
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit(handleSignup)}
      >
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={formLocked}
            variant={errors.email ? "error" : "default"}
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? formFieldAriaErrorId("signup-email") : undefined
            }
            {...register("email")}
          />
          <FormFieldError
            fieldId="signup-email"
            message={errors.email?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={formLocked}
            variant={errors.password ? "error" : "default"}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password
                ? formFieldAriaErrorId("signup-password")
                : undefined
            }
            {...register("password")}
          />
          <FormFieldError
            fieldId="signup-password"
            message={errors.password?.message}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" disabled={formLocked}>
            {isSubmitting ? "Continuing…" : "Continue"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={formLocked}
            onClick={() => reset()}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
