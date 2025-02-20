"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 1,
    title: "New Arrivals",
    description: "Discover our latest collection of designer wear",
    image: "/slides/fashion-1.jpg",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Summer Collection 2024",
    description: "Elevate your style with our exclusive summer pieces",
    image: "/slides/fashion-2.jpg",
    cta: "View Collection"
  },
  {
    id: 3,
    title: "Trending Styles",
    description: "Stay ahead with our curated selection of trending fashion",
    image: "/slides/fashion-3.jpg",
    cta: "Explore More"
  }
]

export function HeroSlider() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[600px] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-5xl font-bold mb-4 text-center tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-xl mb-8 text-center max-w-2xl">
                  {slide.description}
                </p>
                <Button variant="secondary" size="lg">
                  {slide.cta}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-8" />
      <CarouselNext className="right-8" />
    </Carousel>
  )
} 