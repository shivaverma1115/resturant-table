type LogErrorContext = {
  context?: string;
  meta?: Record<string, unknown>;
};

export function logError(error: unknown, details?: LogErrorContext): void {
  const prefix = details?.context ? `[${details.context}]` : "[error]";
  if (details?.meta && Object.keys(details.meta).length > 0) {
    console.error(prefix, details.meta, error);
  } else {
    console.error(prefix, error);
  }
}
