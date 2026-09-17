"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { defaultPageMargins, type PageMargins } from "./page-margins"

const marginFields = [
  ["marginTop", "上边距"],
  ["marginBottom", "下边距"],
  ["marginLeft", "左边距"],
  ["marginRight", "右边距"],
] as const

type PageMarginsFieldProps = {
  margins: PageMargins
  onChange: (margins: PageMargins) => void
  validate?: (margins: PageMargins) => string | null
}

export function PageMarginsField({ margins, onChange, validate }: PageMarginsFieldProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(margins)
  const error = validate?.(draft) ?? null

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3">
      <span className="text-sm font-medium">页边距（mm）</span>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next) setDraft(margins)
          setOpen(next)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full justify-between font-normal tabular-nums"
          >
            {marginFields.map(([name]) => margins[name]).join(", ")}
            <ChevronsUpDown aria-hidden="true" className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 space-y-4">
          {marginFields.map(([name, label]) => (
            <div key={name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-3">
              <span className="text-sm font-medium">{label}</span>
              <div className="flex min-w-0 items-center gap-3">
                <Slider
                  aria-label={label}
                  min={5}
                  max={30}
                  step={0.5}
                  value={[draft[name]]}
                  onValueChange={([value]) => setDraft({ ...draft, [name]: value })}
                />
                <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{draft[name]}</span>
              </div>
            </div>
          ))}
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setDraft(defaultPageMargins)}>
              重置
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={Boolean(error)}
              onClick={() => {
                onChange(draft)
                setOpen(false)
              }}
            >
              确认
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
