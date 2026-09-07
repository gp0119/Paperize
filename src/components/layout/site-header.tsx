import Link from "next/link";
import { FilePenLine } from "lucide-react";

import { subjects } from "@/features/subjects/registry";

import {
  SiteNavigation,
  type NavigationItem,
} from "./site-navigation";

const navigationItems = [
  { href: "/", label: "首页" },
  ...subjects.map((subject) => ({
    href: `/worksheets/${subject.id}`,
    label: subject.name,
  })),
] satisfies readonly NavigationItem[];

export function SiteHeader() {
  return (
    <header
      data-print-hidden
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur"
    >
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex w-fit shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <FilePenLine aria-hidden="true" className="size-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">Paperize</span>
        </Link>

        <SiteNavigation items={navigationItems} />

        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </header>
  );
}
