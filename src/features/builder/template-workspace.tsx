"use client";

import { type CSSProperties, type ReactNode } from "react";

import type { PageVisibility } from "./page-visibility";

import type { PageMargins } from "./page-margins";

import { Select } from "@/components/ui/select";
import { ExportButton } from "./export-button";
import { PageMarginsField } from "./page-margins-field";
import { PreviewPane } from "./preview-pane";
import { PrintButton } from "./print-button";
import { SettingsGroup } from "./settings-group";

const visibilityOptions = [
  { value: "show", label: "显示" },
  { value: "hide", label: "隐藏" },
];

type TemplateWorkspaceProps = {
  storageError?: string | null;
  visibility: PageVisibility;
  onVisibilityChange: (visibility: PageVisibility) => void;
  hasTitle?: boolean;
  margins: PageMargins;
  onMarginsChange: (margins: PageMargins) => void;
  validateMargins?: (margins: PageMargins) => string | null;
  title: string;
  configuration: ReactNode;
  preview: ReactNode;
};

export function TemplateWorkspace({
  storageError,
  visibility,
  onVisibilityChange,
  hasTitle = true,
  margins,
  onMarginsChange,
  validateMargins,
  title,
  configuration,
  preview,
}: TemplateWorkspaceProps) {
  const { hideHeader, hideTitle, hideFooter } = visibility;

  return (
    <div className="flex flex-1 justify-center bg-muted print:block print:bg-white">
      <main
        style={{
          "--page-margin-top": `${margins.marginTop}mm`,
          "--page-margin-right": `${margins.marginRight}mm`,
          "--page-margin-bottom": `${margins.marginBottom}mm`,
          "--page-margin-left": `${margins.marginLeft}mm`,
        } as CSSProperties}
        data-template-workspace
        data-hide-header={hideHeader}
        data-hide-title={hideTitle}
        data-hide-footer={hideFooter}
        className="grid w-full max-w-7xl items-start gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <aside
          data-print-hidden
          className="lg:sticky lg:top-20 lg:order-last lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto"
        >
          <div className="mb-4 grid grid-cols-2 gap-3">
            <ExportButton fileName={title} />
            <PrintButton />
          </div>
          <div className="space-y-4">
            {storageError ? <p role="alert" className="text-sm text-destructive">{storageError}</p> : null}
            {configuration}
            <SettingsGroup>
              <PageMarginsField margins={margins} onChange={onMarginsChange} validate={validateMargins} />
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3">
                <label htmlFor="page-header" className="text-sm font-medium">页眉</label>
                <Select
                  id="page-header"
                  value={hideHeader ? "hide" : "show"}
                  onValueChange={(value) => onVisibilityChange({ ...visibility, hideHeader: value === "hide" })}
                  options={visibilityOptions}
                />
              </div>
              {hasTitle ? (
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3">
                  <label htmlFor="page-title" className="text-sm font-medium">标题</label>
                  <Select
                    id="page-title"
                    value={hideTitle ? "hide" : "show"}
                    onValueChange={(value) => onVisibilityChange({ ...visibility, hideTitle: value === "hide" })}
                    options={visibilityOptions}
                  />
                </div>
              ) : null}
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3">
                <label htmlFor="page-footer" className="text-sm font-medium">页脚</label>
                <Select
                  id="page-footer"
                  value={hideFooter ? "hide" : "show"}
                  onValueChange={(value) => onVisibilityChange({ ...visibility, hideFooter: value === "hide" })}
                  options={visibilityOptions}
                />
              </div>
            </SettingsGroup>
          </div>
        </aside>

        <PreviewPane>{preview}</PreviewPane>
      </main>
    </div>
  );
}
