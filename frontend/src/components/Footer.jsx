export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "12px 0",
        background: "#f2f2f2",
        color: "#555",
        marginTop: "20px"
      }}
    >
      © {new Date().getFullYear()} Store Rating System
    </footer>
  );
}
