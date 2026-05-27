// Login.jsx
// Handles both login and registration with tab switching
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.detail || "Login failed");
        return;
      }
      // decode the JWT token to extract the role
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      auth.login(data.access_token, payload.role);
      navigate("/products");
    } catch (err) {
      setMessage("Server error. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.detail || "Registration failed");
        return;
      }
      setMessage("Account created! Please log in.");
      setIsLogin(true);
    } catch (err) {
      setMessage("Server error. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍞 Bready to Go!</h1>

        {/* toggle between login and register */}
        <div style={styles.tabs}>
          <button
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(true); setMessage(""); }}
          >
            Login
          </button>
          <button
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(false); setMessage(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f4dbd7, #e2a8b6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "360px",
  },
  title: {
    textAlign: "center",
    color: "#8f3232",
    marginBottom: "20px",
  },
  tabs: {
    display: "flex",
    marginBottom: "20px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e0c0c0",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "white",
    cursor: "pointer",
    color: "#8f3232",
  },
  activeTab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#8f3232",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e0c0c0",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#8f3232",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "12px",
    textAlign: "center",
    color: "#678ac2",
    fontSize: "14px",
  },
};