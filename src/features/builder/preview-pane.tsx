import type { ReactNode } from "react";

export function PreviewPane({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="练习预览"
      data-preview-pane
      className="min-w-0 overflow-x-auto"
    >
      {children}
    </section>
  );
}
