"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// 3x ≈ 288dpi，接近打印质量又不会让单页位图过大。
const pixelRatio = 3;

async function renderPages() {
  const workspace = document.querySelector<HTMLElement>("[data-template-workspace]")!;
  // Freeze every page and its inherited settings before the first asynchronous step.
  const snapshot = workspace.cloneNode(false) as HTMLElement;
  snapshot.removeAttribute("data-template-workspace");
  snapshot.className = "";
  snapshot.style.position = "fixed";
  snapshot.style.left = "-100000px";
  snapshot.style.top = "0";
  snapshot.style.width = "210mm";
  snapshot.inert = true;
  snapshot.setAttribute("aria-hidden", "true");
  snapshot.setAttribute("data-print-hidden", "");
  for (const page of workspace.querySelectorAll<HTMLElement>("[data-worksheet-page]")) {
    snapshot.appendChild(page.cloneNode(true));
  }
  document.body.appendChild(snapshot);

  try {
    const { toPng } = await import("html-to-image");
    const images: string[] = [];
    for (const page of snapshot.querySelectorAll<HTMLElement>("[data-worksheet-page]")) {
      images.push(await toPng(page, { pixelRatio, backgroundColor: "#ffffff" }));
    }
    return images;
  } finally {
    snapshot.remove();
  }
}

function download(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

export function ExportButton({ fileName }: { fileName: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportFile(format: "png" | "pdf") {
    setBusy(true);
    setError(null);
    try {
      const images = await renderPages();
      if (format === "png") {
        images.forEach((image, index) => {
          download(image, images.length > 1 ? `${fileName}-第${index + 1}页.png` : `${fileName}.png`);
        });
      } else {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
        images.forEach((image, index) => {
          if (index > 0) doc.addPage();
          doc.addImage(image, "PNG", 0, 0, 210, 297);
        });
        await doc.save(`${fileName}.pdf`, { returnPromise: true });
      }
      setOpen(false);
    } catch {
      setError("导出失败，请重试。");
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="lg" className="w-full justify-between">
          {busy ? "正在导出…" : "导出"}
          <ChevronsUpDown aria-hidden="true" className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="grid w-(--radix-popover-trigger-width) gap-1 p-1">
        <Button type="button" variant="ghost" size="lg" className="justify-start" disabled={busy} onClick={() => exportFile("png")}>
          导出 PNG
        </Button>
        <Button type="button" variant="ghost" size="lg" className="justify-start" disabled={busy} onClick={() => exportFile("pdf")}>
          导出 PDF
        </Button>
        {error ? <p role="alert" className="px-3 py-2 text-sm text-destructive">{error}</p> : null}
      </PopoverContent>
    </Popover>
  );
}
