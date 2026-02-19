from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/featured/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/reviews/', views.ReviewListCreateView.as_view(), name='product-reviews'),
    path('categories/<slug:category_slug>/products/', views.CategoryProductsView.as_view(), name='category-products'),
]
