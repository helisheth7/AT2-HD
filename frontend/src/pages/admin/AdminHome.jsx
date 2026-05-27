import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const [stats, setStats] = useState({ products: 0, cartItems: 0, categories: 0 });
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await fetch("http://127.0.0.1:8000/products/");
        const products = await productsRes.json();

        const cartRes = await fetch("http://127.0.0.1:8000/cart/admin/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cart = await cartRes.json();

        const categories = new Set(products.map(p => p.category)).size;

        const uniqueUsers = new Set(cart.map(item => item.email)).size;
        setStats({
          products: products.length,
          cartItems: uniqueUsers,
          categories
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🍞 Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome back! Here's what's happening at Bready to Go.</p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.products}</h2>
          <p style={styles.statLabel}>Products</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.cartItems}</h2>
          <p style={styles.statLabel}>Open Carts</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.categories}</h2>
          <p style={styles.statLabel}>Categories</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "10px",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "32px",
    color: "#8f3232",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#6b4d4d",
    marginBottom: "30px",
    fontSize: "15px",
  },
  statsGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px 32px",
    minWidth: "150px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    borderTop: "4px solid #8f3232",
  },
  statNumber: {
    fontSize: "36px",
    color: "#8f3232",
    margin: 0,
  },
  statLabel: {
    color: "#6b4d4d",
    margin: "6px 0 0 0",
    fontSize: "14px",
  },
};