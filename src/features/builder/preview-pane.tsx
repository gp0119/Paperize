import type { ReactNode } from "react";

export function PreviewPane({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="练习预览"
      data-preview-pane
      className="overflow-auto bg-muted p-4 md:p-8"
    >
      {children}
    </section>
  );
}
