"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCreateStore } from "@/features/store/hooks";
import { routeStoreHome } from "@/lib/constants";
import { notifyException } from "@/lib/notify";

type CreateStoreButtonProps = Readonly<{
  label?: string;
  className?: string;
}>;

export function CreateStoreButton({
  label = "Create store",
  className,
}: CreateStoreButtonProps) {
  const router = useRouter();
  const { create, pending } = useCreateStore();

  return (
    <Button
      type="button"
      className={className}
      disabled={pending}
      onClick={async () => {
        try {
          const store = await create({ name: "My restaurant" });
          router.push(routeStoreHome(store.id));
          router.refresh();
        } catch (e: unknown) {
          notifyException(e, "Could not create store.");
        }
      }}
    >
      {pending ? "Creating…" : label}
    </Button>
  );
}
