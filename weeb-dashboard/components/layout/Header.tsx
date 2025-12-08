"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { Github, Menu, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]
  )
  
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(148, 163, 184, 0)", "rgba(148, 163, 184, 0.1)"]
  )

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "#templates" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "/docs" },
  ]

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderBottomColor: headerBorder,
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all",
        className
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="relative"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 blur-md opacity-50 -z-10" />
          </motion.div>
          <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            WeebProfile
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link
              href="https://github.com/LucasHenriqueDiniz/WeebProfile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/20"
          >
            <Link href="/signup">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Get Started
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start sm:hidden"
              >
                <Link
                  href="https://github.com/LucasHenriqueDiniz/WeebProfile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}














