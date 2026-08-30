import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // Um <button> sem type dentro de um <form> vale como submit. Nenhum form existe
    // hoje, mas o primeiro que envolver qualquer um destes ganha submits acidentais
    // — e sao 78 usos deste componente. O default vem daqui em vez de ser repetido
    // em cada chamada; quem precisa de submit passa type explicitamente.
    // Com asChild o Slot repassa as props para o filho, que pode ser um <a>, onde
    // type nao existe — por isso so e injetado quando renderiza um button de fato.
    const typeProp = asChild ? (type !== undefined ? { type } : {}) : { type: type ?? "button" }
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...typeProp} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
