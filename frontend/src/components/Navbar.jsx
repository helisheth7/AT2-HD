import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          🍞 Bready to Go!
        </Link>
      </div>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {token && (
          <Link to="/products" style={styles.link}>
            Products
          </Link>
        )}

        {token && (
          <Link style={styles.link} to="/cart">
            Cart
          </Link>
        )}

        {!token ? (
          <Link to="/login" style={styles.loginButton}>
            Login
          </Link>
        ) : (
          <>
            {role === "admin" && (
              <button
                style={styles.adminButton}
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            )}

            <button
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
nav: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 30px",
  background: "linear-gradient(135deg, #8f3232, #b85555)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  fontFamily: "Arial",
},

  left: {
    display: "flex",
    alignItems: "center",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

logo: {
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "24px",
  color: "white",
},

link: {
  textDecoration: "none",
  color: "rgba(255,255,255,0.9)",
  fontWeight: "500",
},

  loginButton: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#e8647c",
    color: "white",
    cursor: "pointer",
  },

  adminButton: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#678ac2",
    color: "white",
    cursor: "pointer",
  },

  logoutButton: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#8f3232",
    color: "white",
    cursor: "pointer",
  },
};