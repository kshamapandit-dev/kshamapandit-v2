"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto grid grid-cols-3 items-center h-16">
        {/* Left: Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/shop"
            className="transition-colors hover:text-foreground/80"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80"
          >
            About
          </Link>
        </nav>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Link href="/" className="relative w-40 h-12">
            <Image
              src="/kshamapandit-logo-gold.png"
              alt="Kshama Pandit"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
} 