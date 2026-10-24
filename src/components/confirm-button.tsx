"use client";

export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className="text-xs font-semibold tracking-[0.18em] text-danger uppercase hover:underline"
    >
      {children}
    </button>
  );
}
