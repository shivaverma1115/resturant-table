/**
 * Renders validation text under an input using global `.ui-error-message`.
 * Pair with `formFieldAriaErrorId(fieldId)` on the input’s `aria-describedby`.
 */

type FormFieldErrorProps = Readonly<{
  /** Must match the input’s `id` prefix, e.g. `signup-email` → element id `signup-email-error`. */
  fieldId: string;
  message?: string;
}>;

/** Use on the input: `aria-describedby={errors.x ? formFieldAriaErrorId("my-id") : undefined}` */
export function formFieldAriaErrorId(fieldId: string): string {
  return `${fieldId}-error`;
}

export function FormFieldError({ fieldId, message }: FormFieldErrorProps) {
  if (!message) {
    return null;
  }
  return (
    <p id={formFieldAriaErrorId(fieldId)} className="ui-error-message" role="alert">
      {message}
    </p>
  );
}
