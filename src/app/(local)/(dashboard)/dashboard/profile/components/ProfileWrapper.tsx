import type { ReactNode } from "react";

import { requireSessionUid } from "@/server/api/auth/require-session";
import { getProfileForUid } from "@/server/api/profile/get-profile";

import { ProfileView } from "./ProfileView";

function ProfileShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          View your account details. You can update your name and age; email and
          phone cannot be changed here.
        </p>
      </header>
      {children}
    </main>
  );
}

export default async function ProfileWrapper() {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <ProfileShell>
        <ProfileView initialError="You need to be signed in to view this page." />
      </ProfileShell>
    );
  }

  try {
    const record = await getProfileForUid(session.uid);
    return (
      <ProfileShell>
        <ProfileView initialProfile={record} />
      </ProfileShell>
    );
  } catch {
    return (
      <ProfileShell>
        <ProfileView initialError="Could not load profile. Try again in a moment." />
      </ProfileShell>
    );
  }
}
