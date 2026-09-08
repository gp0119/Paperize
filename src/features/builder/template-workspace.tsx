import type { ReactNode } from "react";

import { PreviewPane } from "./preview-pane";
import { PrintButton } from "./print-button";

type TemplateWorkspaceProps = {
  title: string;
  configuration: ReactNode;
  preview: ReactNode;
};

export function TemplateWorkspace({
  title,
  configuration,
  preview,
}: TemplateWorkspaceProps) {
  return (
    <main
      data-template-workspace
      className="grid min-h-0 flex-1 lg:grid-cols-[22rem_minmax(0,1fr)]"
    >
      <aside
        data-print-hidden
        className="border-b bg-background p-6 lg:border-r lg:border-b-0"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <PrintButton />
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          彩色打印请在打印设置中选择“彩色”，并开启“背景图形”；若仍为黑白，请检查打印机首选项。
        </p>
        {configuration}
      </aside>

      <PreviewPane>{preview}</PreviewPane>
    </main>
  );
}
