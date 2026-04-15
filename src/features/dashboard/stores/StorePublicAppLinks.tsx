import Link from "next/link";

import {
  routeStoreAbout,
  routeStoreCart,
  routeStoreContact,
  routeStoreHome,
  routeStoreItemsPage,
} from "@/lib/constants";

type StorePublicAppLinksProps = Readonly<{
  storeId: string;
}>;

export function StorePublicAppLinks({ storeId }: StorePublicAppLinksProps) {
  return (
    <>
      <Link
        href={routeStoreHome(storeId)}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
      >
        Open app
      </Link>
      <Link
        href={routeStoreAbout(storeId)}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
      >
        App · About
      </Link>
      <Link
        href={routeStoreItemsPage(storeId)}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
      >
        App · Items
      </Link>
      <Link
        href={routeStoreCart(storeId)}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
      >
        App · Cart
      </Link>
      <Link
        href={routeStoreContact(storeId)}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
      >
        App · Contact
      </Link>
    </>
  );
}
