"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { wooApi } from "@/lib/woocommerce"

const AUTOPLAY_INTERVAL = 3000

type Product = {
  id: number
  name: string
  price: string
  images: { src: string }[]
}

export function FeaturedProducts() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      if (api) {
        api.scrollNext()
      }
    }, AUTOPLAY_INTERVAL)

    return () => clearInterval(timer)
  }, [api])

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await wooApi.getProducts({ featured: true })
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-medium tracking-tight">Featured Products</h2>
        </div>
        <p className="text-muted-foreground mb-8">Discover our handpicked selection of trending styles just for you</p>
        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <div className="absolute -left-4 top-1/2 -translate-y-1/2">
              <CarouselPrevious />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
              <CarouselNext />
            </div>
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem 
                  key={product.id} 
                  className="pl-2 md:pl-4 basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <Card className="overflow-hidden shadow-none">
                    <div className="relative aspect-[4/5] bg-muted">
                      <Image
                        src={product.images[0]?.src || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-all hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="p-4 relative">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.price}
                      </p>
                      <Button 
                        size="icon" 
                        className="rounded-full absolute bottom-4 right-4 h-8 w-8"
                        variant="secondary"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  current === index ? "bg-primary" : "bg-muted"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 