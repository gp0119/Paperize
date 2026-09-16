"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { InputNumber } from "@/components/ui/input-number";
import type { PageMargins } from "./page-margins";

import { PreviewPane } from "./preview-pane";
import { PrintButton } from "./print-button";
import { SettingsGroup } from "./settings-group";

type TemplateWorkspaceProps = {
  margins: PageMargins;
  onMarginsChange: (margins: PageMargins) => void;
  validateMargins?: (margins: PageMargins) => string | null;
  title: string;
  configuration: ReactNode;
  preview: ReactNode;
};

export function TemplateWorkspace({
  margins,
  onMarginsChange,
  validateMargins,
  title,
  configuration,
  preview,
}: TemplateWorkspaceProps) {
  const [marginError, setMarginError] = useState<string | null>(null);
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);

  return (
    <main
      style={{
        "--page-margin-top": `${margins.marginTop}mm`,
        "--page-margin-right": `${margins.marginRight}mm`,
        "--page-margin-bottom": `${margins.marginBottom}mm`,
        "--page-margin-left": `${margins.marginLeft}mm`,
      } as CSSProperties}
      data-template-workspace
      data-hide-header={hideHeader}
      data-hide-footer={hideFooter}
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
        <div className="space-y-6">
          {configuration}
          <form onSubmit={(event) => event.preventDefault()} onChange={(event) => {
            const data = new FormData(event.currentTarget);
            const number = (name: string) => data.get(name) === "" ? NaN : Number(data.get(name));
            const next = {
              marginTop: number("marginTop"), marginRight: number("marginRight"),
              marginBottom: number("marginBottom"), marginLeft: number("marginLeft"),
            };
            const message = Object.values(next).some((value) => !Number.isFinite(value) || value < 5 || value > 30)
              ? "页边距需在 5～30 mm 之间。"
              : validateMargins?.(next) ?? null;
            setMarginError(message);
            if (!message) onMarginsChange(next);
          }}>
            <SettingsGroup title="页边距（mm）">
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["marginTop", "上"], ["marginRight", "右"],
                  ["marginBottom", "下"], ["marginLeft", "左"],
                ] as const).map(([name, label]) => (
                  <div key={name}>
                    <label htmlFor={name} className="text-sm">{label}</label>
                    <InputNumber id={name} name={name} min={5} max={30} step={0.5} required defaultValue={margins[name]} className="mt-2" />
                  </div>
                ))}
              </div>
              {marginError ? <p role="alert" className="text-sm text-destructive">{marginError}预览未更新。</p> : null}
            </SettingsGroup>
          </form>
          <SettingsGroup title="页眉页脚">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={hideHeader} onChange={(event) => setHideHeader(event.target.checked)} className="size-4 accent-slate-900" />
              隐藏页眉
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={hideFooter} onChange={(event) => setHideFooter(event.target.checked)} className="size-4 accent-slate-900" />
              隐藏页脚
            </label>
          </SettingsGroup>
        </div>
      </aside>

      <PreviewPane>{preview}</PreviewPane>
    </main>
  );
}
