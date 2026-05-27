// AdminUsers.jsx
// Admin view of all users' shopping carts, grouped by user
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const [groupedCarts, setGroupedCarts] = useState({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAllCarts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/cart/admin/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        // group cart items by email
        const grouped = {};
        data.forEach(item => {
          const key = item.email;
          if (!grouped[key]) {
            grouped[key] = {
              username: item.username,
              email: item.email,
              items: []
            };
          }
          grouped[key].items.push(item);
        });
        setGroupedCarts(grouped);
      } catch (err) {
        console.error("Failed to fetch carts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCarts();
  }, [token]);

  if (loading) return <p>Loading carts...</p>;

  const users = Object.values(groupedCarts);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>All User Carts</h1>
      <p style={styles.subtitle}>{users.length} active cart{users.length !== 1 ? "s" : ""}</p>

      {users.length === 0 ? (
        <p>No cart items found.</p>
      ) : (
        users.map((user) => {
          const userTotal = user.items.reduce((sum, item) => sum + item.subtotal, 0);
          return (
            <div key={user.email} style={styles.userCard}>
              <div style={styles.userHeader}>
                <div>
                  <h3 style={styles.username}>{user.username}</h3>
                  <p style={styles.email}>{user.email}</p>
                </div>
                <div style={styles.totalBadge}>
                  Total: ${userTotal.toFixed(2)}
                </div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {user.items.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{item.product_name}</td>
                      <td style={styles.td}>${item.product_price}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
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
    marginBottom: "5px",
  },
  subtitle: {
    color: "#6b4d4d",
    marginBottom: "25px",
    fontSize: "15px",
  },
  userCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  username: {
    color: "#8f3232",
    margin: 0,
    fontSize: "18px",
  },
  email: {
    color: "#6b4d4d",
    margin: "4px 0 0 0",
    fontSize: "13px",
  },
  totalBadge: {
    background: "#8f3232",
    color: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "10px 12px",
    background: "#f4dbd7",
    color: "#8f3232",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "bold",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f0e0e0",
    fontSize: "14px",
    color: "#444",
  },
};