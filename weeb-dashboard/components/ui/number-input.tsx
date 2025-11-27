"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showStepper?: boolean
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, step = 1, showStepper = true, className, ...props }, ref) => {
    const handleIncrement = () => {
      const newValue = value + step
      if (max === undefined || newValue <= max) {
        onChange(newValue)
      } else if (max !== undefined) {
        onChange(max)
      }
    }

    const handleDecrement = () => {
      const newValue = value - step
      if (min === undefined || newValue >= min) {
        onChange(newValue)
      } else if (min !== undefined) {
        onChange(min)
      }
    }

    const normalizeValue = (numValue: number): number => {
      // Se step > 1, garantir que o valor seja múltiplo do step
      if (step > 1 && min !== undefined) {
        // Arredondar para o múltiplo mais próximo do step
        const remainder = (numValue - min) % step
        if (remainder !== 0) {
          // Arredondar para cima ou para baixo dependendo do que estiver mais próximo
          const lower = numValue - remainder
          const upper = lower + step
          numValue = Math.abs(numValue - lower) < Math.abs(numValue - upper) ? lower : upper
        }
      }

      let finalValue = numValue
      if (min !== undefined && numValue < min) {
        finalValue = min
      } else if (max !== undefined && numValue > max) {
        finalValue = max
      }

      return finalValue
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === "") {
        onChange(min ?? 0)
        return
      }
      
      const numValue = parseInt(inputValue, 10)
      if (isNaN(numValue)) {
        return
      }

      const finalValue = normalizeValue(numValue)
      onChange(finalValue)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === "") {
        onChange(min ?? 0)
        return
      }
      
      const numValue = parseInt(inputValue, 10)
      if (isNaN(numValue)) {
        onChange(min ?? 0)
        return
      }

      const finalValue = normalizeValue(numValue)
      onChange(finalValue)
    }

    return (
      <div className="flex items-center gap-2">
        {showStepper && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleDecrement}
            disabled={min !== undefined && value <= min}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <Input
          ref={ref}
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={cn(showStepper && "text-center", className)}
          {...props}
        />
        {showStepper && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleIncrement}
            disabled={max !== undefined && value >= max}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

