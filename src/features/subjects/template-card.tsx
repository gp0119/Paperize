import type { ReactNode } from "react";
import Link from "next/link";
import { Library } from "lucide-react";

import type { SubjectId, TemplateDefinition } from "./types";

export function TemplateCard({
  subject,
  template,
  preview,
}: {
  subject: SubjectId;
  template: TemplateDefinition;
  preview: ReactNode;
}) {
  return (
    <Link
      href={`/worksheets/${subject}/${template.id}`}
      className="group block w-full max-w-[240px] overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <div aria-hidden="true" className="pointer-events-none overflow-hidden px-2 pt-2">
        {preview}
      </div>
      <div className="px-3 pt-2 pb-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">{template.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="mr-1 inline-flex items-center gap-1.5 text-slate-400">
            <Library aria-hidden="true" className="size-4" />
            内置模板
          </span>
          {template.tags?.map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 leading-none">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
