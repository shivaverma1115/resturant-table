"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { StoreMenuItemCard } from "@/components/shared/StoreMenuItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as itemsApi from "@/features/store-items/api";
import type { StoreItemDto } from "@/features/store-items/types";
import { useStoreItemsList } from "@/features/store-items/hooks";
import {
  ROUTES,
  routeDashboardStoreEdit,
  routeDashboardStorePreview,
} from "@/lib/constants";
import {
  notifyException,
  showErrorMessage,
  showSuccessMessage,
} from "@/lib/notify";

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

function parsePriceToCents(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return 0;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0) return null;
  const cents = Math.round(n * 100);
  if (cents > 10_000_000) return null;
  return cents;
}

type StoreItemsViewProps = Readonly<{
  storeId: string;
  storeName: string;
}>;

export function StoreItemsView({ storeId, storeName }: StoreItemsViewProps) {
  const { items, status, errorMessage, refresh } = useStoreItemsList(storeId);
  const [pending, setPending] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAvailable, setNewAvailable] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);

  const startEdit = useCallback((item: StoreItemDto) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDesc(item.description ?? "");
    setEditPrice(formatPrice(item.priceCents));
    setEditAvailable(item.isAvailable);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const onCreate = async () => {
    const name = newName.trim();
    if (!name) {
      showErrorMessage("Enter a name.");
      return;
    }
    const priceCents = parsePriceToCents(newPrice);
    if (priceCents === null) {
      showErrorMessage("Enter a valid price (e.g. 12.50).");
      return;
    }
    setPending(true);
    try {
      await itemsApi.createStoreItem(storeId, {
        name,
        description: newDesc.trim() === "" ? null : newDesc.trim(),
        priceCents,
        isAvailable: newAvailable,
      });
      showSuccessMessage("Item added.");
      setNewName("");
      setNewDesc("");
      setNewPrice("");
      setNewAvailable(true);
      refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not add item.");
    } finally {
      setPending(false);
    }
  };

  const onSaveEdit = async (itemId: string) => {
    const name = editName.trim();
    if (!name) {
      showErrorMessage("Enter a name.");
      return;
    }
    const priceCents = parsePriceToCents(editPrice);
    if (priceCents === null) {
      showErrorMessage("Enter a valid price (e.g. 12.50).");
      return;
    }
    setPending(true);
    try {
      await itemsApi.patchStoreItem(storeId, itemId, {
        name,
        description: editDesc.trim() === "" ? null : editDesc.trim(),
        priceCents,
        isAvailable: editAvailable,
      });
      showSuccessMessage("Item updated.");
      setEditingId(null);
      refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not update item.");
    } finally {
      setPending(false);
    }
  };

  const onDelete = async (itemId: string) => {
    if (!window.confirm("Delete this item?")) return;
    setPending(true);
    try {
      await itemsApi.deleteStoreItem(storeId, itemId);
      showSuccessMessage("Item deleted.");
      if (editingId === itemId) setEditingId(null);
      refresh();
    } catch (e: unknown) {
      notifyException(e, "Could not delete item.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Menu items
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-foreground">{storeName}</span> — add
            and edit what guests can order. Prices are in your account currency
            (stored as cents).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={routeDashboardStoreEdit(storeId)}>Edit store</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={routeDashboardStorePreview(storeId)}>Preview</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.DASHBOARD_STORES}>All stores</Link>
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Add item</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-item-name">Name</Label>
            <Input
              id="new-item-name"
              disabled={pending}
              placeholder="e.g. Margherita pizza"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-item-desc">Description (optional)</Label>
            <Input
              id="new-item-desc"
              disabled={pending}
              placeholder="Short line for the menu"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-item-price">Price</Label>
            <Input
              id="new-item-price"
              disabled={pending}
              placeholder="e.g. 12.50"
              inputMode="decimal"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 rounded border-border accent-[var(--color-accent)]"
                checked={newAvailable}
                disabled={pending}
                onChange={(e) => setNewAvailable(e.target.checked)}
              />
              Available on menu
            </label>
          </div>
        </div>
        <div className="mt-4">
          <Button type="button" disabled={pending} onClick={() => void onCreate()}>
            {pending ? "Saving…" : "Add item"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Your items</h2>
        {status === "loading" ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : null}
        {status === "error" ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}
        {status === "success" && items.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No items yet. Add one above.</p>
        ) : null}
        {items.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) =>
              editingId === item.id ? (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-surface-subtle/40 p-5 sm:col-span-2 xl:col-span-3"
                >
                  <p className="text-sm font-medium text-foreground">Editing item</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`edit-name-${item.id}`}>Name</Label>
                      <Input
                        id={`edit-name-${item.id}`}
                        disabled={pending}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`edit-desc-${item.id}`}>Description</Label>
                      <Input
                        id={`edit-desc-${item.id}`}
                        disabled={pending}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-price-${item.id}`}>Price</Label>
                      <Input
                        id={`edit-price-${item.id}`}
                        disabled={pending}
                        inputMode="decimal"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-border accent-[var(--color-accent)]"
                          checked={editAvailable}
                          disabled={pending}
                          onChange={(e) => setEditAvailable(e.target.checked)}
                        />
                        Available
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={pending}
                      onClick={() => void onSaveEdit(item.id)}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <StoreMenuItemCard
                  key={item.id}
                  name={item.name}
                  cuisineLine={item.description}
                  locationLine={storeName}
                  priceLabel={formatPrice(item.priceCents)}
                  isAvailable={item.isAvailable}
                  footer={
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={pending}
                        onClick={() => void onDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </>
                  }
                />
              ),
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
