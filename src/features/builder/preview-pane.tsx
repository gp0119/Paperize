import type { ReactNode } from "react";

export function PreviewPane({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="练习预览"
      data-preview-pane
      className="overflow-auto bg-muted p-4 md:p-8"
    >
      <div
        data-worksheet-page
        className="mx-auto min-h-[297mm] w-[210mm] bg-white p-12 text-black shadow-sm"
      >
        {children}
      </div>
    </section>
  );
}
