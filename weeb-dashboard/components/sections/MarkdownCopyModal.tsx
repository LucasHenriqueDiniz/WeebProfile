"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MarkdownCopyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  markdown?: string
}

const defaultMarkdown = "![My nerd life stats](https://cdn.weebprofile.com/u/username/main.svg)"

export function MarkdownCopyModal({ open, onOpenChange, markdown = defaultMarkdown }: MarkdownCopyModalProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Copiar Markdown</DialogTitle>
          <DialogDescription>
            Cole este código no seu README.md para exibir seu perfil
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <pre className="rounded-lg border bg-muted/50 p-4 text-sm font-mono overflow-x-auto">
              <code>{markdown}</code>
            </pre>
          </div>
          <Button
            onClick={handleCopy}
            className="w-full"
            variant={copied ? "secondary" : "default"}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copiar Markdown
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

