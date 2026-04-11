"use client";

type GoBackButtonProps = {
  className?: string;
};

export function GoBackButton({ className }: GoBackButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.history.back()}
    >
      Go back
    </button>
  );
}
