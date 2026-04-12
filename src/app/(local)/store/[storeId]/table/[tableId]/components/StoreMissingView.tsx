export function StoreMissingView() {
  return (
    <main className="mx-auto flex min-h-[50dvh] max-w-lg flex-col justify-center px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">Link not found</h1>
      <p className="mt-3 text-sm text-muted">
        This store or table could not be found. The QR code may be wrong or out of
        date.
      </p>
    </main>
  );
}
