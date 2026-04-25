import { ERROR_MESSAGE_GENERIC } from "./constants";

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : ERROR_MESSAGE_GENERIC;
}