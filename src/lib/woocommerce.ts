import axios from 'axios'

type WooCommerceParams = Record<string, any>

class WooCommerceAPI {
  private baseUrl: string
  private consumerKey: string
  private consumerSecret: string
  private version: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WOO_COMMERCE_URL!
    this.consumerKey = process.env.NEXT_PUBLIC_WOO_COMMERCE_CONSUMER_KEY!
    this.consumerSecret = process.env.NEXT_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET!
    this.version = process.env.NEXT_PUBLIC_WOO_COMMERCE_API_VERSION || "v3"
  }

  private getUrl(endpoint: string) {
    return `${this.baseUrl}/wp-json/wc/${this.version}/${endpoint}`
  }

  private async request(endpoint: string, params: WooCommerceParams = {}) {
    try {
      const response = await axios.get(this.getUrl(endpoint), {
        params: {
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret,
          ...params
        }
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`WooCommerce API error: ${error.response?.data?.message || error.message}`)
      }
      throw error
    }
  }

  // API Methods
  async getProducts(params: WooCommerceParams = {}) {
    try {
      return await this.request('products', params)
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  async getProduct(id: number) {
    try {
      return await this.request(`products/${id}`)
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  async getCategories(params: WooCommerceParams = {}) {
    try {
      return await this.request('products/categories', params)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  async searchProducts(search: string) {
    try {
      return await this.request('products', { search })
    } catch (error) {
      console.error("Error searching products:", error)
      throw error
    }
  }
}

export const wooApi = new WooCommerceAPI() 