import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="w-full bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">IT LITERATURE SHOP</h1>

        {/* hamburger mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* menu desktop */}
        <ul className="hidden md:flex gap-6 text-lg">
          <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link to="/books" className="hover:text-gray-300">Books</Link></li>
          <li><Link to="/transactions" className="hover:text-gray-300">Transactions</Link></li>
        </ul>
      </nav>

      {/* menu mobile */}
      {open && (
        <ul className="md:hidden w-full bg-slate-800 text-white px-6 py-4 flex flex-col gap-3">
          <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
          <li><Link to="/books" onClick={() => setOpen(false)}>Books</Link></li>
          <li><Link to="/transactions" onClick={() => setOpen(false)}>Transactions</Link></li>
        </ul>
      )}

      {/* CONTENT */}
      <main className="flex-1 w-full px-6 py-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-slate-900 text-white py-4 text-center">
        <p>&copy; P09</p>
      </footer>
    </div>
  );
}
