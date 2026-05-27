export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          🍞 Bready to Go!
        </h1>

        <p style={styles.subtitle}>
          Fresh artisan breads, pastries, and desserts
          delivered daily.
        </p>

        <a href="/products">
          <button style={styles.button}>
            Shop Now
          </button>
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f4dbd7, #f8eef1)",
    padding: "40px",
    fontFamily: "Arial",
  },

  hero: {
    textAlign: "center",
    background: "white",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    maxWidth: "700px",
  },

  title: {
    fontSize: "52px",
    color: "#8f3232",
    marginBottom: "15px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#6b4d4d",
    marginBottom: "30px",
    lineHeight: 1.6,
  },

  button: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px",
    background: "#e8647c",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};