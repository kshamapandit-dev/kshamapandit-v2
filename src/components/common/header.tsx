"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { MiniCart } from "@/components/common/mini-cart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Header() {
  const { cartCount } = useCart()
  
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
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative border border-border/40 hover:border-border/80"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-0 shadow-lg" 
              align="end"
              sideOffset={8}
            >
              <MiniCart />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
} 