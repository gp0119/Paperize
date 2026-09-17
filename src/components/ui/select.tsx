"use client"

import type { ComponentProps } from "react"
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Select({
  id,
  className,
  options,
  ...props
}: Omit<ComponentProps<typeof SelectPrimitive.Root>, "children"> & {
  id: string
  className?: string
  options: { value: string; label: string }[]
}) {
  return (
    // Wrapping the root keeps Radix's hidden form input out of the caller's layout.
    <div className={cn("min-w-0", className)}>
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          id={id}
          data-slot="select"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "w-full justify-between font-normal [&>span:first-child]:truncate",
          )}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon asChild>
            <ChevronsUpDown aria-hidden="true" className="text-muted-foreground" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            collisionPadding={8}
            className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:animate-none"
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-muted-foreground">
              <ChevronUp aria-hidden="true" className="size-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex min-h-9 cursor-pointer items-center rounded-md py-2 pr-9 pl-3 text-sm outline-none select-none data-[state=checked]:bg-muted/60 data-[state=checked]:font-medium data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
                    <Check aria-hidden="true" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-muted-foreground">
              <ChevronDown aria-hidden="true" className="size-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}

export { Select }
