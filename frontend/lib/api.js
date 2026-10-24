// lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

function removeCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

const TOKEN_KEY = 'ebasi_admin_token';

class EbasiAPI {
  // Token management
  getToken() {
    if (typeof window === 'undefined') return null;
    let token = null;
    try {
      token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('authToken');
    } catch (e) {}

    if (!token) {
      token = getCookie(TOKEN_KEY) || getCookie('authToken');
      if (token) {
        try {
          localStorage.setItem(TOKEN_KEY, token);
        } catch (e) {}
      }
    }
    return token;
  }

  setToken(token) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {}
    setCookie(TOKEN_KEY, token, 30);
  }

  removeToken() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('authToken');
    } catch (e) {}
    removeCookie(TOKEN_KEY);
    removeCookie('authToken');
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

  logout() {
    this.removeToken();
  }

  // Products
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'All') {
          queryParams.append(key, value);
        }
      });
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/products/${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error in getProducts:', error);
      throw error;
    }
  }

  async searchProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/?search=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Search API Error:', error);
      return [];
    }
  }

  async getProductBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`API error (${response.status}): ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Product Error in getProductBySlug:', error);
      throw error;
    }
  }

  _categoriesCache = null;
  _categoriesCacheTime = 0;

  async getCategories() {
    const now = Date.now();
    // Cache for 5 minutes (300,000 ms)
    if (this._categoriesCache && (now - this._categoriesCacheTime < 300000)) {
      return this._categoriesCache;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) return this._categoriesCache || [];
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.results || []);
      this._categoriesCache = list;
      this._categoriesCacheTime = now;
      return list;
    } catch (error) {
      console.error('Categories API Error:', error);
      return this._categoriesCache || [];
    }
  }

  async getFeaturedProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured/`);
      if (!response.ok) return { results: [] };
      return await response.json();
    } catch (error) {
      console.error('Featured Products API Error:', error);
      return { results: [] };
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

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      let errorMsg = 'Failed to submit message';
      if (err?.error) {
        errorMsg = err.error;
      } else if (err?.details) {
        const fieldErrors = Object.entries(err.details)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
        if (fieldErrors) errorMsg = fieldErrors;
      }
      throw new Error(errorMsg);
    }
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
        headers: this.getHeaders(false),
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

