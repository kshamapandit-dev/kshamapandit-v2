import { Header } from "@/components/common/header"
import { HeroSlider } from "@/components/common/hero-slider"
import { FeaturedProducts } from "@/components/common/featured-products"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSlider />
      <FeaturedProducts />
    </div>
  )
}
