"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/common/header"
import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { Check, Wallet, BanknoteIcon } from "lucide-react"
import { graphqlClient } from "@/lib/graphql-client"
import { 
  APPLY_COUPON_MUTATION, 
  UPDATE_SHIPPING_METHOD_MUTATION, 
  CHECKOUT_MUTATION,
  GET_SHIPPING_METHODS_QUERY
} from "@/lib/graphql/queries"
import { toast } from "sonner"

interface ShippingMethod {
  id: string;
  cost: string;
  label: string;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface ShippingMethodsResponse {
  cart: {
    availableShippingMethods: Array<{
      rates: ShippingMethod[];
    }>;
  };
}

interface CheckoutResponse {
  checkout: {
    redirect?: string;
    result: string;
    order: {
      id: string;
      orderKey: string;
      orderNumber: string;
      status: string;
      total: string;
    };
  };
}

export default function CheckoutPage() {
  const { items = [], total = 0, isLoading: cartLoading } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: ""
  })

  // Fetch available shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const data = await graphqlClient.request<ShippingMethodsResponse>(GET_SHIPPING_METHODS_QUERY)
        if (data.cart?.availableShippingMethods?.[0]?.rates) {
          setShippingMethods(data.cart.availableShippingMethods[0].rates)
          // Set default shipping method
          if (data.cart.availableShippingMethods[0].rates.length > 0) {
            setShippingMethod(data.cart.availableShippingMethods[0].rates[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error)
      }
    }

    fetchShippingMethods()
  }, [])

  const handleApplyCoupon = async () => {
    if (!couponCode) return

    try {
      await graphqlClient.request(APPLY_COUPON_MUTATION, {
        input: { code: couponCode }
      })
      toast.success("Coupon applied successfully")
    } catch (error) {
      console.error("Error applying coupon:", error)
      toast.error("Failed to apply coupon")
    }
  }

  const handleShippingMethodChange = async (methodId: string) => {
    setShippingMethod(methodId)
    try {
      await graphqlClient.request(UPDATE_SHIPPING_METHOD_MUTATION, {
        input: { shippingMethods: [methodId] }
      })
    } catch (error) {
      console.error("Error updating shipping method:", error)
      toast.error("Failed to update shipping method")
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const response = await graphqlClient.request<CheckoutResponse>(CHECKOUT_MUTATION, {
        input: {
          billing: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
            email: formData.email,
            phone: formData.phone
          },
          shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country
          },
          paymentMethod,
          shipmentMethod: shippingMethod
        }
      })

      if (response.checkout?.redirect) {
        window.location.href = response.checkout.redirect
      } else {
        toast.success("Order placed successfully!")
      }
    } catch (error) {
      console.error("Error processing checkout:", error)
      toast.error("Failed to process checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartLoading) {
    return <div className="container py-8">Loading...</div>
  }

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
              ) :
                <p className="text-sm text-muted-foreground text-center py-2">Your cart is empty</p>
              }
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
              <Button 
                variant="outline" 
                className="h-9 text-sm"
                onClick={handleApplyCoupon}
              >
                Apply
              </Button>
            </div>

            {/* Shipping Method */}
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-sm">Shipping Method</h3>
              <RadioGroup
                value={shippingMethod}
                onValueChange={handleShippingMethodChange}
                className="space-y-2"
              >
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="text-sm">
                      {method.label} ({formatPrice(parseFloat(method.cost))})
                    </Label>
                  </div>
                ))}
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
                  {shippingMethod ? formatPrice(parseFloat(shippingMethods.find(m => m.id === shippingMethod)?.cost || "0")) : "Not selected"}
                </span>
              </div>
              <div className="border-t border-dotted border-gray-200 my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatPrice(total + parseFloat(shippingMethods.find(m => m.id === shippingMethod)?.cost || "0"))}
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

            {/* Customer Information */}
            <Card>
              <CardHeader className="text-center border-b py-3">
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postal Code *</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      required
                      value={formData.postcode}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>

            {/* Receipt Footer */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              Thank you for shopping with us!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 