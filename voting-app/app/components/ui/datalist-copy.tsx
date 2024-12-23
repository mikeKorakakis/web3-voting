"use client"

import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatalistOption {
  value: string
  label: string
}

interface DatalistProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: DatalistOption[]
  onValueChange?: (value: string) => void
  emptyMessage?: string
}

export function Datalist({
  options,
  placeholder,
  onValueChange,
  emptyMessage = "Δεν βρέθηκε αποτέλεσμα.",
  className,
  ...props
}: DatalistProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onValueChange?.(e.target.value)
    if (!open) {
      setOpen(true)
    }
  }

  const handleSelect = (value: string) => {
    setInputValue(value)
    onValueChange?.(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            {...props}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              "w-full",
              className
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            <CommandInput placeholder="Αναζήτηση..." />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

