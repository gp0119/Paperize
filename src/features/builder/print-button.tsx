"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" size="lg" className="w-full" onClick={() => window.print()}>
      打印
    </Button>
  );
}
