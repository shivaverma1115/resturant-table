import { z } from "zod";

import { getFirebaseWebApiKey } from "@/config/config";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

import { createSessionFromIdToken } from "./create-session";
import { SIGNIN_SUCCESS_MESSAGE, SIGNUP_SUCCESS_MESSAGE } from "@/lib/constants";

const signupBodySchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignupWithSessionResult =
  | { ok: true; sessionCookie: string; maxAgeSeconds: number; message: string }
  | { ok: false; status: number; message: string };

export function isSignupApiConfigured(): boolean {
  return isFirebaseAdminConfigured() && Boolean(getFirebaseWebApiKey());
}

/** For UI: what is missing so signup can run. */
export function getSignupEnvStatus(): Readonly<{
  ready: boolean;
  hasWebApiKey: boolean;
  hasAdmin: boolean;
}> {
  const hasWebApiKey = Boolean(getFirebaseWebApiKey());
  const hasAdmin = isFirebaseAdminConfigured();
  return {
    ready: hasWebApiKey && hasAdmin,
    hasWebApiKey,
    hasAdmin,
  };
}

function mapSignUpMessage(msg: string): string {
  const u = msg.toUpperCase();
  if (u.includes("WEAK_PASSWORD")) return "The password is too weak.";
  if (u.includes("INVALID_EMAIL")) return "Invalid email address.";
  if (u.includes("EMAIL_EXISTS")) return "";
  if (u.includes("OPERATION_NOT_ALLOWED")) {
    return "Email/password sign-up is not enabled for this project.";
  }
  return msg.trim() || "Could not create account.";
}

function mapSignInMessage(msg: string): string {
  const u = msg.toUpperCase();
  if (
    u.includes("INVALID_PASSWORD") ||
    u.includes("INVALID_LOGIN_CREDENTIALS") ||
    u.includes("EMAIL_NOT_FOUND")
  ) {
    return "Wrong password.";
  }
  if (u.includes("TOO_MANY_ATTEMPTS")) return "Too many attempts. Try again later.";
  if (u.includes("USER_DISABLED")) return "This account has been disabled.";
  return msg.trim() || "Sign in failed.";
}

async function identityToolkit<T>(
  path: "signUp" | "signInWithPassword",
  body: Record<string, unknown>,
): Promise<{ ok: true; data: T } | { ok: false; data: T }> {
  const apiKey = getFirebaseWebApiKey()!;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = (await res.json()) as T;
  return res.ok ? { ok: true, data } : { ok: false, data };
}

type IdTokenPayload = {
  idToken?: string;
  email?: string;
  error?: { message?: string };
};

/** Server-side signup: Identity Toolkit REST + Admin session cookie (same project as web app). */
export async function signupWithSession(
  body: unknown,
): Promise<SignupWithSessionResult> {
  if (!isSignupApiConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Signup is not configured on the server.",
    };
  }

  const parsed = signupBodySchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const msg =
      flat.email?.[0] ?? flat.password?.[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const email = parsed.data.email.trim();
  const password = parsed.data.password;

  const signUp = await identityToolkit<IdTokenPayload>("signUp", {
    email,
    password,
    returnSecureToken: true,
  });

  let idToken: string;
  let message: string;

  if (signUp.ok && signUp.data.idToken) {
    idToken = signUp.data.idToken;
    message = SIGNUP_SUCCESS_MESSAGE;
  } else {
    const errMsg = signUp.data.error?.message ?? "";
    if (errMsg.toUpperCase().includes("EMAIL_EXISTS")) {
      const signIn = await identityToolkit<IdTokenPayload>("signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
      });
      if (!signIn.ok || !signIn.data.idToken) {
        return {
          ok: false,
          status: 401,
          message: mapSignInMessage(signIn.data.error?.message ?? ""),
        };
      }
      idToken = signIn.data.idToken;
      message = SIGNIN_SUCCESS_MESSAGE;
    } else {
      return {
        ok: false,
        status: 400,
        message: mapSignUpMessage(errMsg),
      };
    }
  }

  const session = await createSessionFromIdToken(idToken);
  if (!session.ok) {
    return {
      ok: false,
      status: session.status,
      message: session.error,
    };
  }

  return {
    ok: true,
    sessionCookie: session.sessionCookie,
    maxAgeSeconds: session.maxAgeSeconds,
    message,
  };
}
