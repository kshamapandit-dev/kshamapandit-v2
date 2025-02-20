"use client"

import { Heart, Minus, Plus, Trash } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { formatPrice, numberToWords } from "@/lib/utils"

export function MiniCart() {
  const { items = [], total = 0, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Your cart is empty
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold text-sm">Your Basket Contains</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{items.length} item(s)</p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[24rem]">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="p-4 flex gap-3">
              {/* Product Image */}
              <div className="relative w-20 h-24 bg-muted rounded">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(item.price)}
                </p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 mt-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="h-7 w-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive/80"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index < items.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Subtotal</span>
            <span className="text-sm font-semibold">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {numberToWords(total)} rupees only
          </p>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button asChild className="w-full">
          <Link href="/checkout">
            Checkout
          </Link>
        </Button>
      </div>
    </div>
  )
} 