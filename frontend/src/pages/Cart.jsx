import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Shows the logged in user's cart with ability to update quantity and remove items

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/cart/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await fetch(`http://127.0.0.1:8000/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await fetch(`http://127.0.0.1:8000/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Item removed from cart");
      setTimeout(() => setMessage(""), 2000);
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) return <p style={{ padding: "30px" }}>Loading your cart...</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Your Cart</h1>

      {message && <div style={styles.successMessage}>{message}</div>}

      {cartItems.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from our products page!</p>
          <button style={styles.shopButton} onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.cart_item_id} style={styles.card}>
              <div style={styles.cardLeft}>
                <h3 style={styles.productName}>{item.name}</h3>
                <p style={styles.price}>${item.price} each</p>
              </div>

              <div style={styles.cardRight}>
                {/* quantity controls */}
                <div style={styles.quantityRow}>
                  <button
                    style={styles.qtyButton}
                    onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    style={styles.qtyButton}
                    onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <p style={styles.subtotal}>${item.subtotal.toFixed(2)}</p>

                <button
                  style={styles.removeButton}
                  onClick={() => removeItem(item.cart_item_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* total */}
          <div style={styles.totalRow}>
            <h2 style={styles.totalText}>Total: ${total.toFixed(2)}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg, #f4dbd7 0%, #f8eef1 50%, #ffffff 100%)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "36px",
    color: "#8f3232",
    marginBottom: "25px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  productName: {
    color: "#8f3232",
    margin: 0,
    marginBottom: "5px",
  },
  price: {
    color: "#666",
    margin: 0,
    fontSize: "14px",
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  qtyButton: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: "#f0d3da",
    color: "#8f3232",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  quantity: {
    fontSize: "18px",
    fontWeight: "bold",
    minWidth: "24px",
    textAlign: "center",
  },
  subtotal: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#e8647c",
    margin: 0,
  },
  removeButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  totalRow: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    textAlign: "right",
  },
  totalText: {
    color: "#8f3232",
    margin: 0,
  },
  emptyState: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },
  shopButton: {
    marginTop: "15px",
    padding: "12px 24px",
    background: "#8f3232",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  successMessage: {
    background: "#22c55e",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    width: "fit-content",
  },
};