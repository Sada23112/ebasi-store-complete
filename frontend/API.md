# API Documentation - EBASI STORE

This document outlines the API structure and endpoints for the EBASI STORE e-commerce platform.

## 🔗 Base URL

\`\`\`
Production: https://your-domain.com/api
Development: http://localhost:3000/api
\`\`\`

## 🔐 Authentication

### Authentication Methods

The platform uses session-based authentication with the following endpoints:

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt-token-here"
}
\`\`\`

#### POST `/api/auth/register`
Register new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\`

#### POST `/api/auth/logout`
Logout user and invalidate session.

## 🛍 Products API

### GET `/api/products`
Retrieve product catalog with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `search` (string): Search query
- `sort` (string): Sort by (price, name, rating, date)
- `order` (string): Sort order (asc, desc)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter

**Response:**
\`\`\`json
{
  "products": [
    {
      "id": "prod-123",
      "name": "Elegant Silk Saree",
      "description": "Beautiful traditional silk saree...",
      "price": 2999,
      "originalPrice": 3999,
      "category": "sarees",
      "images": ["image1.jpg", "image2.jpg"],
      "rating": 4.8,
      "reviewCount": 45,
      "inStock": true,
      "stockQuantity": 15,
      "sku": "SAR-ELG-001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
\`\`\`

### GET `/api/products/[id]`
Get detailed product information.

**Response:**
\`\`\`json
{
  "id": "prod-123",
  "name": "Elegant Silk Saree",
  "description": "Detailed product description...",
  "price": 2999,
  "originalPrice": 3999,
  "category": "sarees",
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "material": "Pure Silk",
    "color": "Royal Blue",
    "size": "Free Size"
  },
  "rating": 4.8,
  "reviewCount": 45,
  "reviews": [
    {
      "id": "rev-123",
      "userId": "user-456",
      "userName": "Priya S.",
      "rating": 5,
      "comment": "Beautiful saree, excellent quality!",
      "date": "2024-01-15"
    }
  ],
  "relatedProducts": ["prod-124", "prod-125"]
}
\`\`\`

### GET `/api/products/categories`
Get all product categories.

**Response:**
\`\`\`json
{
  "categories": [
    {
      "id": "sarees",
      "name": "Sarees",
      "description": "Traditional and contemporary sarees",
      "productCount": 45,
      "image": "category-sarees.jpg"
    },
    {
      "id": "kurtis",
      "name": "Kurtis",
      "description": "Stylish kurtis and kurta sets",
      "productCount": 32,
      "image": "category-kurtis.jpg"
    }
  ]
}
\`\`\`

## 🛒 Cart API

### GET `/api/cart`
Get user's shopping cart.

**Headers:**
\`\`\`
Authorization: Bearer jwt-token
\`\`\`

**Response:**
\`\`\`json
{
  "items": [
    {
      "id": "cart-item-123",
      "productId": "prod-123",
      "product": {
        "name": "Elegant Silk Saree",
        "price": 2999,
        "image": "image1.jpg"
      },
      "quantity": 2,
      "subtotal": 5998
    }
  ],
  "summary": {
    "itemCount": 2,
    "subtotal": 5998,
    "tax": 539.82,
    "shipping": 0,
    "total": 6537.82
  }
}
\`\`\`

### POST `/api/cart/add`
Add item to cart.

**Request Body:**
\`\`\`json
{
  "productId": "prod-123",
  "quantity": 1,
  "variant": {
    "size": "M",
    "color": "Blue"
  }
}
\`\`\`

### PUT `/api/cart/update`
Update cart item quantity.

**Request Body:**
\`\`\`json
{
  "itemId": "cart-item-123",
  "quantity": 3
}
\`\`\`

### DELETE `/api/cart/remove`
Remove item from cart.

**Request Body:**
\`\`\`json
{
  "itemId": "cart-item-123"
}
\`\`\`

## ❤️ Wishlist API

### GET `/api/wishlist`
Get user's wishlist.

**Response:**
\`\`\`json
{
  "items": [
    {
      "id": "wish-123",
      "productId": "prod-123",
      "product": {
        "name": "Elegant Silk Saree",
        "price": 2999,
        "image": "image1.jpg",
        "inStock": true
      },
      "addedDate": "2024-01-15"
    }
  ]
}
\`\`\`

### POST `/api/wishlist/add`
Add product to wishlist.

**Request Body:**
\`\`\`json
{
  "productId": "prod-123"
}
\`\`\`

### DELETE `/api/wishlist/remove`
Remove product from wishlist.

**Request Body:**
\`\`\`json
{
  "productId": "prod-123"
}
\`\`\`

## 📦 Orders API

### GET `/api/orders`
Get user's order history.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status

**Response:**
\`\`\`json
{
  "orders": [
    {
      "id": "ord-123",
      "orderNumber": "EB-2024-001",
      "status": "delivered",
      "orderDate": "2024-01-15",
      "deliveryDate": "2024-01-20",
      "items": [
        {
          "productId": "prod-123",
          "name": "Elegant Silk Saree",
          "quantity": 1,
          "price": 2999
        }
      ],
      "summary": {
        "subtotal": 2999,
        "tax": 269.91,
        "shipping": 0,
        "total": 3268.91
      },
      "shippingAddress": {
        "name": "John Doe",
        "address": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      }
    }
  ]
}
\`\`\`

### GET `/api/orders/[id]`
Get detailed order information.

### POST `/api/orders/create`
Create new order.

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "productId": "prod-123",
      "quantity": 1,
      "price": 2999
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "+91 9876543210"
  },
  "paymentMethod": "card",
  "paymentDetails": {
    "cardToken": "card-token-123"
  }
}
\`\`\`

## 👤 User Profile API

### GET `/api/user/profile`
Get user profile information.

**Response:**
\`\`\`json
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 9876543210",
  "addresses": [
    {
      "id": "addr-123",
      "type": "home",
      "name": "John Doe",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "isDefault": true
    }
  ],
  "preferences": {
    "newsletter": true,
    "smsUpdates": false
  }
}
\`\`\`

### PUT `/api/user/profile`
Update user profile.

### POST `/api/user/addresses`
Add new address.

### PUT `/api/user/addresses/[id]`
Update address.

### DELETE `/api/user/addresses/[id]`
Delete address.

## 🔍 Search API

### GET `/api/search`
Search products and content.

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Search type (products, categories, all)
- `limit` (number): Results limit

**Response:**
\`\`\`json
{
  "query": "silk saree",
  "results": {
    "products": [
      {
        "id": "prod-123",
        "name": "Elegant Silk Saree",
        "price": 2999,
        "image": "image1.jpg",
        "relevance": 0.95
      }
    ],
    "categories": [
      {
        "id": "sarees",
        "name": "Sarees",
        "productCount": 45
      }
    ]
  },
  "suggestions": ["silk sarees", "silk blouse", "silk fabric"]
}
\`\`\`

## 📊 Admin API

### Authentication Required
All admin endpoints require authentication and appropriate permissions.

### GET `/api/admin/dashboard`
Get dashboard statistics.

**Response:**
\`\`\`json
{
  "stats": {
    "totalRevenue": 328000,
    "totalOrders": 885,
    "activeUsers": 2345,
    "conversionRate": 3.2
  },
  "recentOrders": [...],
  "lowStockItems": [...],
  "topProducts": [...]
}
\`\`\`

### GET `/api/admin/products`
Get products for admin management.

### POST `/api/admin/products`
Create new product.

### PUT `/api/admin/products/[id]`
Update product.

### DELETE `/api/admin/products/[id]`
Delete product.

### GET `/api/admin/orders`
Get orders for admin management.

### PUT `/api/admin/orders/[id]/status`
Update order status.

### GET `/api/admin/users`
Get users for admin management.

### GET `/api/admin/analytics`
Get detailed analytics data.

## 📈 Analytics API

### GET `/api/analytics/sales`
Get sales analytics.

**Query Parameters:**
- `period` (string): Time period (7d, 30d, 3m, 6m, 1y)
- `granularity` (string): Data granularity (day, week, month)

### GET `/api/analytics/customers`
Get customer analytics.

### GET `/api/analytics/products`
Get product performance analytics.

## 🔄 Webhooks

### POST `/api/webhooks/payment`
Handle payment gateway webhooks.

### POST `/api/webhooks/shipping`
Handle shipping provider webhooks.

## 📝 Reviews API

### GET `/api/products/[id]/reviews`
Get product reviews.

### POST `/api/products/[id]/reviews`
Add product review.

**Request Body:**
\`\`\`json
{
  "rating": 5,
  "title": "Excellent quality!",
  "comment": "Beautiful saree, exactly as described.",
  "images": ["review-image1.jpg"]
}
\`\`\`

## 🎁 Gift Cards API

### GET `/api/gift-cards/[code]`
Validate gift card.

### POST `/api/gift-cards/apply`
Apply gift card to order.

### POST `/api/gift-cards/purchase`
Purchase gift card.

## 🏆 Loyalty API

### GET `/api/loyalty/points`
Get user loyalty points.

### POST `/api/loyalty/redeem`
Redeem loyalty points.

## 📧 Notifications API

### GET `/api/notifications`
Get user notifications.

### PUT `/api/notifications/[id]/read`
Mark notification as read.

## 🚨 Error Responses

All API endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
\`\`\`

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_REQUIRED`: User not authenticated
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## 📊 Rate Limiting

API endpoints are rate limited:
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Admin endpoints**: 500 requests per minute

Rate limit headers are included in responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`

## 🔒 Security

### API Security Features
- JWT token authentication
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection
- CORS configuration

### Best Practices
- Always use HTTPS in production
- Validate all input data
- Implement proper error handling
- Log security events
- Regular security audits

---

**API Version**: v1.0.0  
**Last Updated**: January 2024
