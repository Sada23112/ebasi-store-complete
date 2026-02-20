// lib/api.js
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

class EbasiAPI {
  // Token management
  getToken() {
    return localStorage.getItem('authToken');
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    localStorage.removeItem('authToken');
  }

  // Get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
    }

    return headers;
  }

  // Generic request helper
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(true);

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Request Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(username, email, password, firstName, lastName) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Parse Django validation errors
        let message = 'Registration failed';
        if (errorData.username) {
          message = 'ACCOUNT_EXISTS';
        } else if (errorData.email) {
          message = 'ACCOUNT_EXISTS';
        } else if (errorData.password) {
          message = Array.isArray(errorData.password) ? errorData.password.join(' ') : errorData.password;
        } else if (errorData.non_field_errors) {
          message = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors.join(' ') : errorData.non_field_errors;
        }
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  async login(usernameOrEmail, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({
          username: usernameOrEmail,
          email: usernameOrEmail,
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'NO_ACCOUNT');
      }

      const data = await response.json();
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  // Google OAuth Login
  async googleLogin(code) {
    try {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const response = await fetch(`${API_BASE_URL}/accounts/google/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Google login failed');
      }

      const data = await response.json();
      const token = data.token;
      if (token) {
        this.setToken(token);
      }
      return data;
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile Error:', error);
      throw error;
    }
  }

  logout() {
    this.removeToken();
  }

  // Products
  async getProducts() {
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products/`);
      const response = await fetch(`${API_BASE_URL}/products/`);
      const data = await response.json();
      console.log('Products data:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { results: [] };
    }
  }

  async searchProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/?search=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      const data = await response.json();
      // Handle pagination if present
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Search API Error:', error);
      return [];
    }
  }

  async getProductBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/`);
      return await response.json();
    } catch (error) {
      console.error('Product Error:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/categories/`);
      const response = await fetch(`${API_BASE_URL}/categories/`);
      const data = await response.json();
      console.log('Categories data:', data);
      return data;
    } catch (error) {
      console.error('Categories API Error:', error);
      return [];
    }
  }

  async getFeaturedProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured/`);
      return await response.json();
    } catch (error) {
      return { results: [] };
    }
  }

  // Cart operations
  async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/cart/`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Cart Error:', error);
      return { items: [], total_price: '0.00' };
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/cart/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Add to Cart Error:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/cart/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      return true;
    } catch (error) {
      console.error('Clear Cart Error:', error);
      throw error;
    }
  }

  async removeCartItem(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/cart/item/${productId}/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      return true;
    } catch (error) {
      console.error('Remove Cart Item Error:', error);
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/cart/item/${productId}/`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      return await response.json();
    } catch (error) {
      console.error('Update Cart Item Error:', error);
      throw error;
    }
  }

  // Wishlist
  async getWishlist() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/wishlist/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Get Wishlist Error:', error);
      return [];
    }
  }

  async toggleWishlist(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/wishlist/toggle/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist item');
      }

      return await response.json();
    } catch (error) {
      console.error('Toggle Wishlist Error:', error);
      throw error;
    }
  }

  // Orders
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/checkout/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create Order Error:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get Orders Error:', error); // Corrected error message for getOrders
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
        method: 'DELETE',
        headers: this.getHeaders(true)
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return true;
    } catch (error) {
      console.error('Delete Product Error:', error);
      throw error;
    }
  }

  // Admin Order Management
  async getAdminOrders() {
    return this.request('/admin/orders/');
  }

  async updateOrderStatus(id, status) {
    return this.request(`/admin/orders/${id}/update_status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Admin User Management
  async getAdminUsers() {
    return this.request('/admin/users/');
  }

  async toggleUserStatus(id) {
    return this.request(`/admin/users/${id}/toggle_status/`, {
      method: 'PATCH'
    });
  }

  // Contact Messages
  async submitContactForm(data) {
    // Public endpoint
    const response = await fetch(`${API_BASE_URL}/accounts/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to submit message');
    return response.json();
  }

  // Admin Login
  async adminLogin(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/admin/login/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({
          username,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Admin login failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Admin Login Error:', error);
      throw error;
    }
  }

  // Admin Dashboard Stats
  async getAdminDashboardStats() {
    return this.request('/admin/dashboard/');
  }

  // Reviews
  async getProductReviews(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/reviews/`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Get Reviews Error:', error);
      return [];
    }
  }

  async submitReview(slug, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/reviews/`, {
        method: 'POST',
        headers: this.getHeaders(false), // Public endpoint, but let's see if we need auth. View says AllowAny.
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      return await response.json();
    } catch (error) {
      console.error('Submit Review Error:', error);
      throw error;
    }
  }
}

export const api = new EbasiAPI();
export default api;
