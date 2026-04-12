export function StoreNotLiveView() {
  return (
    <main className="mx-auto flex min-h-[50dvh] max-w-lg flex-col justify-center px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        This table is not taking orders yet
      </h1>
      <p className="mt-3 text-sm text-muted">
        The store owner has not published this ordering link. Check back later or
        ask staff for an updated QR code.
      </p>
    </main>
  );
}
