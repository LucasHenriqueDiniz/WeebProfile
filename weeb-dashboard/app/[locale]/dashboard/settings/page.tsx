"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { LanguageSelector } from "@/components/layout/LanguageSelector"

export default function SettingsPage() {
  const t = useTranslations('settings')
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('description')}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <CardTitle>{t('profile.title')}</CardTitle>
              <CardDescription>
                {t('profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t('profile.emailCannotChange')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">{t('profile.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={user.user_metadata?.user_name || t('profile.username')}
                  defaultValue={user.user_metadata?.user_name || ""}
                />
              </div>
              <Button className="w-full sm:w-auto">
                {t('profile.saveChanges')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <CardTitle>{t('appearance.title')}</CardTitle>
              <CardDescription>
                {t('appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('appearance.theme')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('appearance.themeDescription')}
                  </p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label>{t('appearance.language')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('appearance.languageDescription')}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setLanguageSelectorOpen(true)}>
                  {t('appearance.language')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <CardTitle>{t('account.title')}</CardTitle>
              <CardDescription>
                {t('account.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <Label>{t('account.dangerZone')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('account.dangerZoneDescription')}
                </p>
                <Button variant="destructive" className="w-full sm:w-auto">
                  {t('account.deleteAccount')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <LanguageSelector open={languageSelectorOpen} onOpenChange={setLanguageSelectorOpen} />
    </div>
  )
}
















