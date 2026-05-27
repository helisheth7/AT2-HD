import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🍞 Bready to Go!</h1>

        <p style={styles.subtitle}>
          Freshly baked goods delivered daily with love.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f4dbd7, #e2a8b6)",
    fontFamily: "Arial",
    padding: "20px",
  },

  hero: {
    background: "white",
    padding: "60px 40px",
    borderRadius: "20px",
    textAlign: "center",
    maxWidth: "650px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },

  title: {
    color: "#8f3232",
    fontSize: "48px",
    marginBottom: "20px",
  },

  subtitle: {
    color: "#6b3b3b",
    fontSize: "20px",
    marginBottom: "35px",
    lineHeight: "1.6",
  },

  button: {
    background: "#8f3232",
    color: "white",
    border: "none",
    padding: "14px 28px",
    fontSize: "18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};