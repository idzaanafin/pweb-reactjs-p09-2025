import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <nav style={{ background: "#eee", padding: "10px" }}>
        <Link to="/books">Books</Link> |{" "}
        <Link to="/transactions">Transactions</Link>
      </nav>

      <Outlet />
    </div>
  );
}
