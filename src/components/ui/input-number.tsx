"use client"

import { useImperativeHandle, useRef, type ComponentProps } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function InputNumber({
  className,
  ref,
  disabled,
  readOnly,
  ...props
}: Omit<ComponentProps<"input">, "type">) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current!, [])

  function adjustValue(direction: number) {
    const input = inputRef.current!
    const previousValue = input.value

    if (input.step === "any") {
      const current = input.value === "" ? 0 : input.valueAsNumber
      const next = Number((current + direction).toPrecision(15))
      input.valueAsNumber = Math.min(
        input.max === "" ? Infinity : Number(input.max),
        Math.max(input.min === "" ? -Infinity : Number(input.min), next),
      )
    } else if (direction > 0) {
      input.stepUp()
    } else {
      input.stepDown()
    }

    if (input.value !== previousValue) {
      // Native number setters let React observe the change at the input and form.
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }

  return (
    <div data-slot="input-number" className={cn("relative w-full", className)}>
      <Input
        {...props}
        ref={inputRef}
        type="number"
        disabled={disabled}
        readOnly={readOnly}
        className="px-10 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 left-1 rounded-sm"
        aria-label="减少"
        aria-controls={props.id}
        disabled={disabled || readOnly}
        onClick={() => adjustValue(-1)}
      >
        <Minus aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 rounded-sm"
        aria-label="增加"
        aria-controls={props.id}
        disabled={disabled || readOnly}
        onClick={() => adjustValue(1)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  )
}

export { InputNumber }
