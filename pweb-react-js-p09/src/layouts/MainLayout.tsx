import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthed(false);
      return;
    }

    setIsAuthed(true);

    axios
      .get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDisplayName(
          res.data?.data?.email || "User"
        );
      })
      .catch(() => {
        setIsAuthed(false);
      });
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItem =
    "px-3 py-2 rounded-md transition hover:bg-white/10 hover:translate-y-[-1px]";
  const activeClass = ({ isActive }: { isActive: boolean }) =>
    `${navItem} ${isActive ? "bg-white/15 font-semibold" : "text-white/90"}`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 shadow-[0_6px_24px_rgba(2,6,23,.08)] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white/95">
        <div className="max-w-[1120px] mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* brand */}
          <Link
            to="/"
            className="font-extrabold tracking-tight text-3xl md:text-4xl text-white"
          >
            IT Literature Shop
          </Link>

          {/* desktop menu */}
          <ul className="hidden md:flex items-center gap-3 text-base">
            <li><NavLink to="/" className={activeClass}>Home</NavLink></li>
            <li><NavLink to="/books" className={activeClass}>Books</NavLink></li>
            <li><NavLink to="/transactions" className={activeClass}>Transactions</NavLink></li>
            <li className="mx-2 h-6 w-px bg-white/15" />

            {isAuthed ? (
              <li className="flex items-center gap-2">
                <span className="text-white/85">{displayName}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-rose-500/90 hover:bg-rose-500 transition shadow-sm text-sm font-medium"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className={`${navItem} bg-white/10 hover:bg-white/20`}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition shadow-sm font-medium">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* hamburger mobile */}
          <button
            className="md:hidden text-3xl px-2 py-1 rounded-md hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {/* mobile menu */}
        {open && (
          <ul className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-2 text-lg bg-slate-900/95 backdrop-blur">
            <li><NavLink to="/" className={activeClass} onClick={() => setOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/books" className={activeClass} onClick={() => setOpen(false)}>Books</NavLink></li>
            <li><NavLink to="/transactions" className={activeClass} onClick={() => setOpen(false)}>Transactions</NavLink></li>

            <div className="h-[1px] w-full bg-white/10 my-1" />

            {isAuthed ? (
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 rounded-md bg-rose-500/90 hover:bg-rose-500 transition text-left"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li><Link to="/login" className={`${navItem} bg-white/10`} onClick={() => setOpen(false)}>Login</Link></li>
                <li><Link to="/register" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition inline-block" onClick={() => setOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-[1120px] mx-auto px-4 lg:px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-[1120px] mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-slate-600 text-base font-medium">
            © {new Date().getFullYear()} IT Literature Shop
          </div>
        </div>
      </footer>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Konfirmasi Logout
            </h3>
            <p className="text-slate-600 mb-6">
              Apakah kamu yakin ingin logout dari akun ini?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-500 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
