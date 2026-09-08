"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

export type NavigationItem = {
  href: string;
  label: string;
};

export function SiteNavigation({
  items,
}: {
  items: readonly NavigationItem[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className="flex min-w-0 items-center justify-self-end gap-1 overflow-x-auto overflow-y-hidden p-1 lg:col-start-2 lg:justify-self-center"
    >
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              size: "default",
            })}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
