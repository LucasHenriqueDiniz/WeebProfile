"use client"

import { useAuth } from "@/hooks/useAuth"
import { useWizardStore } from "@/stores/wizard-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Copy, Loader2, AlertCircle, AlertTriangle, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LivePreview } from "../LivePreview"

export function Step4Preview() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const {
    name,
    slug,
    plugins,
    pluginsOrder,
    style,
    size,
    isValid,
    validateStep,
  } = useWizardStore()

  // Validate step 3 when component mounts (Preview is now step 3)
  useEffect(() => {
    validateStep(3)
  }, [validateStep])

  // URL será gerada após criar a imagem (usando ID)
  const markdownCode = `![Profile Stats](URL_SERA_GERADA_APOS_CRIAR)`
  const imageUrl = ""

  const enabledPlugins = pluginsOrder.filter(
    (name) => plugins[name]?.enabled
  )
  const totalSections = enabledPlugins.reduce(
    (acc, name) => acc + (plugins[name]?.sections?.length || 0),
    0
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownCode)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Markdown code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not copy code",
        variant: "destructive",
      })
    }
  }

  const validations = [
    {
      label: "Style configured",
      valid: isValid.step1,
    },
    {
      label: "At least 1 plugin enabled",
      valid: enabledPlugins.length > 0,
    },
    {
      label: "At least 1 section selected",
      valid: totalSections > 0,
    },
    {
      label: "Plugins configured",
      valid: isValid.step2,
    },
  ]

  const allValid = validations.every((v) => v.valid)

  return (
    <div className="space-y-6">
      {/* Main Preview Card - Centered */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            Final Preview
          </CardTitle>
          <CardDescription>Review your configuration before creating the image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Centered Preview */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Image Preview</Label>
            <div className="border-2 border-dashed rounded-xl p-8 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 overflow-auto max-h-[70vh]">
              <div className="flex justify-center items-start min-h-[400px]">
                <LivePreview compact={true} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              This is a preview using mock data. The final image will be generated after creation.
            </p>
            <style jsx global>{`
              /* Custom scrollbar styles for preview */
              .border-2.rounded-xl::-webkit-scrollbar {
                width: 12px;
                height: 12px;
              }
              .border-2.rounded-xl::-webkit-scrollbar-track {
                background: hsl(var(--muted));
                border-radius: 6px;
              }
              .border-2.rounded-xl::-webkit-scrollbar-thumb {
                background: hsl(var(--muted-foreground) / 0.3);
                border-radius: 6px;
                border: 2px solid hsl(var(--muted));
              }
              .border-2.rounded-xl::-webkit-scrollbar-thumb:hover {
                background: hsl(var(--muted-foreground) / 0.5);
              }
            `}</style>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validations */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Validations</CardTitle>
            <CardDescription>Check if everything is configured correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validations.map((validation) => (
                <div
                  key={validation.label}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    validation.valid 
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  )}
                >
                  {validation.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      validation.valid
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    )}
                  >
                    {validation.label}
                  </span>
                </div>
              ))}
            </div>
            {!allValid && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-800 dark:text-yellow-200 shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please complete all validations before finishing
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Configuration Summary</CardTitle>
            <CardDescription>Overview of your selected settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Plugins</div>
                <div className="flex flex-wrap gap-1.5">
                  {enabledPlugins.length > 0 ? (
                    enabledPlugins.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Sections</div>
                <div className="text-2xl font-bold">{totalSections}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Style</div>
                <div className="text-sm font-semibold capitalize">{style}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Size</div>
                <div className="text-sm font-semibold capitalize">{size}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Markdown Code */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">GitHub README Code</CardTitle>
          <CardDescription>Copy this code to your GitHub README.md</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto border border-border">
              {markdownCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute top-3 right-3"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
