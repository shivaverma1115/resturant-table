import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function TrackMissingSecret() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
      <h1 className="text-lg font-semibold text-foreground">Order tracking</h1>
      <p className="text-sm text-muted">
        This link is missing the security token. Open your order from the notification
        again, or use the link from your confirmation screen.
      </p>
      <Button variant="outline" asChild>
        <Link href={ROUTES.HOME}>Home</Link>
      </Button>
    </div>
  );
}
