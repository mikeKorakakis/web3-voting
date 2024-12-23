import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

const Crossbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-8 w-8 shrink-0 rounded-sm border border-zinc-200 border-zinc-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Plus className="h-8 w-8fill-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Crossbox.displayName = CheckboxPrimitive.Root.displayName

export { Crossbox }