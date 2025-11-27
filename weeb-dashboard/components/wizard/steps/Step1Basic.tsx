"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useWizardStore } from "@/stores/wizard-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Zap, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export function Step1Basic() {
  const { user } = useAuth()
  const { name, slug, setBasicInfo } = useWizardStore()
  const [localName, setLocalName] = useState(name)
  const [localSlug, setLocalSlug] = useState(slug)

  useEffect(() => {
    if (localName) {
      // Auto-generate slug from name
      const generatedSlug = localName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setLocalSlug(generatedSlug)
    } else {
      setLocalSlug("")
    }
  }, [localName])

  useEffect(() => {
    // Update store when fields change
    setBasicInfo(localName, localSlug, true) // Always use profile
  }, [localName, localSlug, setBasicInfo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            Basic Information
          </CardTitle>
          <CardDescription>Configure the name and identifier for your SVG image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Image Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Ex: My GitHub Stats"
              className={cn(localName && "border-green-500")}
            />
            <p className="text-sm text-muted-foreground">
              This name will appear in your dashboard
            </p>
            {localSlug && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="font-mono">URL: /api/{localSlug}.svg</span>
                {localSlug && (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                )}
              </div>
            )}
          </div>

          {/* Info about automatic profile usage */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Profile settings will be applied automatically</p>
                <p className="text-xs text-muted-foreground">
                  Your saved usernames in the profile will be used automatically in the next steps.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
