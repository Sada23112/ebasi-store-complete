interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  category: string
  colors?: string[]
  sizes?: string[]
  inStock: boolean
  stockCount: number
  description: string
  features: string[]
  badge?: string
  tags?: string[]
}

interface UserBehavior {
  viewedProducts: number[]
  cartItems: number[]
  purchasedProducts: number[]
  searchQueries: string[]
  categoryPreferences: Record<string, number>
}

export class RecommendationEngine {
  private products: Product[]
  private userBehavior: UserBehavior

  constructor(products: Product[], userBehavior?: UserBehavior) {
    this.products = products
    this.userBehavior = userBehavior || {
      viewedProducts: [],
      cartItems: [],
      purchasedProducts: [],
      searchQueries: [],
      categoryPreferences: {}
    }
  }

  // Get similar products based on category, price range, and features
  getSimilarProducts(productId: number, limit: number = 4): Product[] {
    const targetProduct = this.products.find(p => p.id === productId)
    if (!targetProduct) return []

    const priceRange = {
      min: targetProduct.price * 0.7,
      max: targetProduct.price * 1.3
    }

    return this.products
      .filter(product =>
        product.id !== productId &&
        product.inStock &&
        (product.category === targetProduct.category ||
          (product.price >= priceRange.min && product.price <= priceRange.max))
      )
      .map(product => ({
        ...product,
        similarity: this.calculateSimilarity(targetProduct, product)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }

  // Get personalized recommendations based on user behavior
  getPersonalizedRecommendations(limit: number = 6): Product[] {
    const scores = new Map<number, number>()

    // Score based on viewed products
    this.userBehavior.viewedProducts.forEach(productId => {
      const similar = this.getSimilarProducts(productId, 10)
      similar.forEach(product => {
        const currentScore = scores.get(product.id) || 0
        scores.set(product.id, currentScore + 0.3)
      })
    })

    // Score based on cart items (higher weight)
    this.userBehavior.cartItems.forEach(productId => {
      const similar = this.getSimilarProducts(productId, 10)
      similar.forEach(product => {
        const currentScore = scores.get(product.id) || 0
        scores.set(product.id, currentScore + 0.5)
      })
    })

    // Score based on category preferences
    Object.entries(this.userBehavior.categoryPreferences).forEach(([category, preference]) => {
      this.products
        .filter(p => p.category === category && p.inStock)
        .forEach(product => {
          const currentScore = scores.get(product.id) || 0
          scores.set(product.id, currentScore + preference * 0.2)
        })
    })

    // Convert to array and sort by score
    const recommendations = Array.from(scores.entries())
      .map(([productId, score]) => ({
        product: this.products.find(p => p.id === productId)!,
        score
      }))
      .filter(item => item.product && item.product.inStock)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product)

    // Fill remaining slots with trending products if needed
    if (recommendations.length < limit) {
      const trending = this.getTrendingProducts(limit - recommendations.length)
        .filter(p => !recommendations.some(r => r.id === p.id))
      recommendations.push(...trending)
    }

    return recommendations
  }

  // Get trending products based on ratings and reviews
  getTrendingProducts(limit: number = 8): Product[] {
    return this.products
      .filter(product => product.inStock)
      .map(product => ({
        ...product,
        trendingScore: (product.rating * product.reviews) + (product.reviews * 0.1)
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)
  }

  // Get products frequently bought together
  getFrequentlyBoughtTogether(productId: number, limit: number = 3): Product[] {
    // In a real implementation, this would use purchase history data
    // For now, we'll use category and price-based logic
    const targetProduct = this.products.find(p => p.id === productId)
    if (!targetProduct) return []

    return this.products
      .filter(product =>
        product.id !== productId &&
        product.inStock &&
        product.category !== targetProduct.category && // Different category for variety
        product.price <= targetProduct.price * 0.8 // Complementary price range
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  // Get products on sale
  getSaleProducts(limit: number = 6): Product[] {
    return this.products
      .filter(product =>
        product.inStock &&
        product.originalPrice > product.price
      )
      .map(product => ({
        ...product,
        discountPercentage: ((product.originalPrice - product.price) / product.originalPrice) * 100
      }))
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, limit)
  }

  // Update user behavior
  updateUserBehavior(behavior: Partial<UserBehavior>) {
    this.userBehavior = { ...this.userBehavior, ...behavior }
  }

  // Track product view
  trackProductView(productId: number) {
    if (!this.userBehavior.viewedProducts.includes(productId)) {
      this.userBehavior.viewedProducts.push(productId)
    }

    const product = this.products.find(p => p.id === productId)
    if (product) {
      const currentPreference = this.userBehavior.categoryPreferences[product.category] || 0
      this.userBehavior.categoryPreferences[product.category] = currentPreference + 1
    }
  }

  // Calculate similarity between two products
  private calculateSimilarity(product1: Product, product2: Product): number {
    let similarity = 0

    // Category match
    if (product1.category === product2.category) similarity += 0.4

    // Price similarity
    const priceDiff = Math.abs(product1.price - product2.price)
    const maxPrice = Math.max(product1.price, product2.price)
    const priceScore = 1 - (priceDiff / maxPrice)
    similarity += priceScore * 0.3

    // Rating similarity
    const ratingDiff = Math.abs(product1.rating - product2.rating)
    const ratingScore = 1 - (ratingDiff / 5)
    similarity += ratingScore * 0.2

    // Feature overlap
    const commonFeatures = product1.features.filter(f =>
      product2.features.some(f2 => f2.toLowerCase().includes(f.toLowerCase()))
    )
    const featureScore = commonFeatures.length / Math.max(product1.features.length, product2.features.length)
    similarity += featureScore * 0.1

    return similarity
  }
}

// Utility function to create recommendation engine instance
export function createRecommendationEngine(products: Product[], userBehavior?: UserBehavior) {
  return new RecommendationEngine(products, userBehavior)
}
