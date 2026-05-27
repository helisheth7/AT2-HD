import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>🍞 Admin Panel</h2>
          <nav style={styles.nav}>
            <Link to="/admin" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/admin/products" style={styles.link}>
              Products
            </Link>
            <Link to="/admin/users" style={styles.link}>
              User Carts
            </Link>
          </nav>
        </div>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial",
  },
  sidebar: {
    width: "220px",
    background: "#8f3232",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    color: "white",
    fontSize: "18px",
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.15)",
    fontSize: "14px",
    fontWeight: "500",
  },
  logout: {
    padding: "10px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: "40px",
    background: "linear-gradient(135deg, #f4dbd7 0%, #f8eef1 50%, #ffffff 100%)",
  },
};