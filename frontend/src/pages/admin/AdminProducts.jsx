import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/products";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(API_URL + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.detail || "Create failed", "error"); return; }
      setForm(emptyForm);
      await fetchProducts();
      showToast("Product created successfully!");
    } catch {
      showToast("Server error", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { showToast("Delete failed", "error"); return; }
      setProducts((p) => p.filter((x) => x.id !== id));
      showToast("Product deleted");
    } catch {
      showToast("Server error", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.detail || "Update failed", "error"); return; }
      setProducts((p) => p.map((x) => (x.id === editingProduct.id ? data : x)));
      setEditingProduct(null);
      showToast("Product updated!");
    } catch {
      showToast("Server error", "error");
    }
  };

  return (
    <div style={styles.page}>

      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#ef4444" : "#22c55e" }}>
          {toast.msg}
        </div>
      )}

      <h1 style={styles.title}>Product Management</h1>
      <p style={styles.subtitle}>Add, edit or remove products from the bakery.</p>

      {/* CREATE FORM */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add New Product</h3>
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <input
            style={styles.inputSmall}
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            style={styles.inputSmall}
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <button style={styles.createButton} disabled={actionLoading}>
            {actionLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* PRODUCT TABLE */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Inventory ({products.length} items)</h3>
        {loading ? (
          <p style={{ color: "#6b4d4d" }}>Loading products...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>${p.price}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => { setEditingProduct(p); setEditForm(p); }}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Edit Product</h3>
            <form onSubmit={handleUpdate} style={styles.modalForm}>
              <input
                style={styles.input}
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Image URL"
                value={editForm.image_url}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
              />
              <input
                style={styles.inputSmall}
                placeholder="Price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
              <input
                style={styles.inputSmall}
                placeholder="Stock"
                type="number"
                value={editForm.stock}
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
              />
              <div style={styles.modalButtons}>
                <button style={styles.createButton} type="submit">Save Changes</button>
                <button style={styles.cancelButton} type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "10px",
    fontFamily: "Arial",
    minHeight: "100vh",
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
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    color: "#8f3232",
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "18px",
  },
  form: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #f0d3da",
    fontSize: "14px",
    flex: 1,
    minWidth: "160px",
  },
  inputSmall: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #f0d3da",
    fontSize: "14px",
    width: "100px",
  },
  createButton: {
    padding: "10px 20px",
    background: "#8f3232",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  cancelButton: {
    padding: "10px 20px",
    background: "#e0c0c0",
    color: "#8f3232",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
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
  editButton: {
    padding: "6px 12px",
    background: "#678ac2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "13px",
  },
  deleteButton: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "440px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    color: "#8f3232",
    marginTop: 0,
    marginBottom: "20px",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "5px",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 18px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    zIndex: 2000,
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  },
};