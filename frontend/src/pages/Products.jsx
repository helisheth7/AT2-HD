import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000/products";
const CART_API_URL = "http://127.0.0.1:8000/cart/";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [cart, setCart] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProducts();
  }, []);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load bakery products right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // ADD TO CART
  // -------------------------
  const addToCart = async (product) => {
    try {
      setMessage("");

      // local frontend cart
      setCart((prev) => [...prev, product]);

      // optional backend cart API
      await fetch(CART_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      setMessage(`${product.name} added to cart 🛒`);

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError("Failed to add item to cart");
    }
  };

  // -------------------------
  // UNIQUE CATEGORIES
  // -------------------------
  const categories = useMemo(() => {
    const allCategories = products.map(
      (p) => p.category || "Uncategorized"
    );

    return ["All", ...new Set(allCategories)];
  }, [products]);

  // -------------------------
  // LIVE SEARCH + FILTER
  // -------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>🍞 Bready to Go!</h1>

        <p style={styles.subtitle}>
          Fresh artisan breads, pastries, and desserts baked daily.
        </p>
      </div>

      {/* ALERTS */}
      {message && (
        <div style={styles.successMessage}>
          {message}
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search breads, cakes, pastries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
          style={styles.select}
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>
            Loading fresh bakery items...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No products found</h3>
          <p>
            Try adjusting your search or category
            filter.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={styles.card}
            >
              {/* IMAGE */}
              <div style={styles.imageWrapper}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>
                    🍰 No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div style={styles.cardContent}>
                <div style={styles.categoryBadge}>
                  {product.category ||
                    "Bakery Item"}
                </div>

                <h3 style={styles.productName}>
                  {product.name}
                </h3>

                <p style={styles.description}>
                  {product.description ||
                    "Freshly baked with premium ingredients."}
                </p>

                <div style={styles.bottomRow}>
                  <div>
                    <p style={styles.price}>
                      $
                      {Number(
                        product.price
                      ).toFixed(2)}
                    </p>

                    <p style={styles.stock}>
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Sold out"}
                    </p>
                  </div>

                  <button
                    style={{
                      ...styles.cartButton,
                      opacity:
                        product.stock <= 0
                          ? 0.5
                          : 1,
                    }}
                    disabled={product.stock <= 0}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    Add to Cart
                  </button>
                </div>

                {/* ADMIN BADGE */}
                {role === "admin" && (
                  <div style={styles.adminBadge}>
                    Admin View
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg, #f4dbd7 0%, #f8eef1 50%, #ffffff 100%)",
    fontFamily: "Arial, sans-serif",
  },

  hero: {
    marginBottom: "35px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
    color: "#8f3232",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b4d4d",
    marginBottom: "25px",
  },

  heroStats: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  statCard: {
    background: "white",
    padding: "16px",
    borderRadius: "14px",
    minWidth: "140px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },

  controls: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid #f0d3da",
    outline: "none",
    fontSize: "15px",
    background: "white",
  },

  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid #f0d3da",
    background: "white",
    minWidth: "180px",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    transition: "0.2s ease",
  },

  imageWrapper: {
    width: "100%",
    height: "190px",
    background: "#f6f6f6",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
    fontSize: "15px",
  },

  cardContent: {
    padding: "18px",
  },

  categoryBadge: {
    display: "inline-block",
    background: "#678ac2",
    color: "white",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    marginBottom: "10px",
  },

  productName: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#8f3232",
  },

  description: {
    fontSize: "14px",
    color: "#666",
    minHeight: "42px",
    lineHeight: 1.5,
  },

  bottomRow: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  price: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#e8647c",
    margin: 0,
  },

  stock: {
    fontSize: "13px",
    color: "#666",
    marginTop: "4px",
  },

  cartButton: {
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "#8f3232",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  adminBadge: {
    marginTop: "14px",
    background: "#d29985",
    color: "white",
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  loadingContainer: {
    padding: "40px",
    textAlign: "center",
  },

  loadingText: {
    color: "#8f3232",
    fontSize: "18px",
  },

  emptyState: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },

  successMessage: {
    background: "#22c55e",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    width: "fit-content",
  },

  errorMessage: {
    background: "#ef4444",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    width: "fit-content",
  },
};