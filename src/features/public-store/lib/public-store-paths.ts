import { ROUTE_SEGMENTS } from "@/lib/constants";

type StorePrimaryNavKey = "home" | "about" | "items" | "cart" | "contact" | "order";

export type StorePrimaryNavLink = Readonly<{
  key: StorePrimaryNavKey;
  href: string;
  label: string;
}>;

function encodeStoreSlug(storeSlug: string): string {
  return encodeURIComponent(storeSlug.trim());
}

function buildStoreBase(storeSlug: string): string {
  return `/${ROUTE_SEGMENTS.STORE}/${encodeStoreSlug(storeSlug)}`;
}

export function storeHomePath(storeSlug: string): string {
  return buildStoreBase(storeSlug);
}

export function storeAboutPath(storeSlug: string): string {
  return `${buildStoreBase(storeSlug)}/about`;
}

export function storeItemsPath(storeSlug: string): string {
  return `${buildStoreBase(storeSlug)}/items`;
}

export function storeItemDetailsPath(storeSlug: string, itemId: string): string {
  return `${storeItemsPath(storeSlug)}/${encodeURIComponent(itemId.trim())}`;
}

export function storeCartPath(storeSlug: string): string {
  return `${buildStoreBase(storeSlug)}/cart`;
}

export function storeContactPath(storeSlug: string): string {
  return `${buildStoreBase(storeSlug)}/contact`;
}

export function storeOrderPath(storeSlug: string): string {
  return `${buildStoreBase(storeSlug)}/${ROUTE_SEGMENTS.ORDER}`;
}

export function storeOrderSuccessPath(storeSlug: string): string {
  return `${storeOrderPath(storeSlug)}/success`;
}

export function storePrimaryNavLinks(storeSlug: string): StorePrimaryNavLink[] {
  return [
    { key: "home", href: storeHomePath(storeSlug), label: "Home" },
    { key: "about", href: storeAboutPath(storeSlug), label: "About" },
    { key: "items", href: storeItemsPath(storeSlug), label: "Items" },
    { key: "cart", href: storeCartPath(storeSlug), label: "Cart" },
    { key: "contact", href: storeContactPath(storeSlug), label: "Contact" },
    { key: "order", href: storeOrderPath(storeSlug), label: "Order" },
  ];
}
