import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    fontFamily: "Arial",
    background: "linear-gradient(135deg, #f4dbd7, #e2a8b6)",
  },

  content: {
    padding: "20px",
  },
};