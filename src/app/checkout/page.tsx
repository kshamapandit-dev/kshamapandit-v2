"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/common/header"
import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { Check, Wallet, BanknoteIcon } from "lucide-react"

export default function CheckoutPage() {
  const { items = [], total = 0 } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cod")

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container max-w-[600px] mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6 text-center">Checkout</h1>
        
        {/* Order Summary Receipt */}
        <Card className="bg-[#FCFCFC] mb-8">
          <CardHeader className="text-center border-b py-3">
            <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Cart Items */}
            <div className="divide-y divide-dotted">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-16 h-20 bg-muted rounded shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                            sizes="64px"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium text-sm tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">Your cart is empty</p>
              )}
            </div>

            {/* Dotted Separator */}
            <div className="border-t border-dotted border-gray-200 my-4" />

            {/* Coupon Code */}
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-white h-9 text-sm"
              />
              <Button variant="outline" className="h-9 text-sm">Apply</Button>
            </div>

            {/* Shipping Method */}
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-sm">Shipping Method</h3>
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="text-sm">
                    Standard Delivery (Free) - 3-5 business days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="text-sm">
                    Express Delivery (₹1,500) - 1-2 business days
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dotted Separator */}
            <div className="border-t border-dotted border-gray-200 my-4" />

            {/* Order Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium tabular-nums">
                  {shippingMethod === "express" ? formatPrice(1500) : "Free"}
                </span>
              </div>
              <div className="border-t border-dotted border-gray-200 my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatPrice(total + (shippingMethod === "express" ? 1500 : 0))}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-sm">Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                  <Label
                    htmlFor="cod"
                    className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer relative"
                  >
                    <Wallet className="h-6 w-6 mb-2" />
                    <div className="text-sm font-medium">Cash on Delivery</div>
                    <div className="absolute top-2 right-2 opacity-0 peer-data-[state=checked]:opacity-100">
                      <Check className="h-4 w-4" />
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                  <Label
                    htmlFor="bank"
                    className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer relative"
                  >
                    <BanknoteIcon className="h-6 w-6 mb-2" />
                    <div className="text-sm font-medium">Bank Transfer</div>
                    <div className="absolute top-2 right-2 opacity-0 peer-data-[state=checked]:opacity-100">
                      <Check className="h-4 w-4" />
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Place Order Button */}
            <Button className="w-full h-10 text-sm" size="default">
              Place Order
            </Button>

            {/* Receipt Footer */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              Thank you for shopping with us!
            </p>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center border-b py-3">
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Returning Customer</TabsTrigger>
                  <TabsTrigger value="guest">New Customer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your password" />
                    </div>
                    <Button className="w-full">Login</Button>
                  </div>
                </TabsContent>

                <TabsContent value="guest" className="pt-4">
                  {/* Billing & Shipping Address */}
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" required />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode *</Label>
                        <Input id="postcode" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" required />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button className="w-full h-10" size="lg">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
} 