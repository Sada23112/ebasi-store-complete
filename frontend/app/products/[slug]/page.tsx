"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/useToast";

// Product type
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: string;
  compare_price?: string;
  is_on_sale: boolean;
  discount_percentage?: number;
  primary_image?: string;
  images?: { id: number; image: string }[];
  category: { name: string };
  stock_status: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toast, RenderToast } = useToast();

  useEffect(() => {
    if (params.slug) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/v1/products/${params.slug}/`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading)
    return (
      <div style={{ padding: 40 }}>
        <div className="animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 mb-6 rounded"></div>
          <div className="flex gap-10">
            <div className="w-80 h-80 bg-gray-200 rounded"></div>
            <div>
              <div className="h-6 w-48 bg-gray-200 mb-4 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 mb-2 rounded"></div>
              <div className="h-12 w-32 bg-gray-200 mt-6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  if (!product)
    return <div style={{ padding: 40, color: "#ef4444" }}>Product not found.</div>;

  async function handleAddToCart() {
    if (!product) return;
    await addToCart(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: Number(product.compare_price || product.price),
        primary_image: product.primary_image,
        inStock: product.stock_status === "in_stock",
        stock_status: product.stock_status,
      },
      1
    );
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{product.name}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, margin: "30px 0" }}>
        <img
          src={product.images && product.images.length > 0 ? product.images[0].image : "/placeholder.svg"}
          alt={product.name}
          style={{ width: 320, borderRadius: 10, objectFit: "cover" }}
        />
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#DB2777" }}>
            ₹{product.price}
            {product.is_on_sale && (
              <span style={{ marginLeft: 10, color: "#aaa", textDecoration: "line-through", fontSize: 16 }}>
                ₹{product.compare_price}
              </span>
            )}
            {product.is_on_sale && (
              <span style={{ marginLeft: 10, color: "#ef4444", fontWeight: 700 }}>
                ({product.discount_percentage}% OFF)
              </span>
            )}
          </div>
          <div style={{ margin: "20px 0" }}>
            <strong>Category:</strong> {product.category?.name} <br />
            <strong>Stock status:</strong> {product.stock_status}
          </div>
          <div style={{ fontSize: 16, marginBottom: 16 }}>{product.short_description}</div>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "10px 25px",
              background: "#db2777",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <h3 style={{ marginBottom: 8 }}>Product Description</h3>
      <p style={{ color: "#333", fontSize: 15 }}>{product.description}</p>
      <RenderToast />
    </div>
  );
}
