import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
  }, []);

  const handleLogout = () => {
    if (!confirm("Yakin ingin logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Berhasil logout.");
    navigate("/login");
  };

  // ukuran item menu dibuat lebih kecil di mobile, normal di md+
  const navItem =
    "px-3 py-2 rounded-md transition hover:bg-white/10 hover:translate-y-[-1px] text-[15px] md:text-base";
  const activeClass = ({ isActive }: { isActive: boolean }) =>
    `${navItem} ${isActive ? "bg-white/20 font-semibold" : "text-white/90"}`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* NAVBAR */}
      <nav
        role="navigation"
        className="sticky top-0 z-40 w-full shadow-md bg-[#001F3F] text-white pt-[env(safe-area-inset-top)]"
      >
        <div className="max-w-[1120px] mx-auto px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {/* brand */}
          <Link
            to="/"
            className="font-extrabold tracking-tight text-xl sm:text-2xl md:text-4xl text-white hover:scale-[1.03] md:hover:scale-105 transition-transform duration-200"
          >
            IT Literature Shop
          </Link>

          {/* desktop menu */}
          <ul className="hidden md:flex items-center gap-2 lg:gap-3 text-base">
            <li>
              <NavLink to="/" className={activeClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/books" className={activeClass}>
                Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" className={activeClass}>
                Transactions
              </NavLink>
            </li>
            <li className="mx-2 h-6 w-px bg-white/15" />
            {isAuthed ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-rose-500 hover:bg-rose-600 transition shadow-sm text-sm font-semibold"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`${navItem} bg-white/10 hover:bg-white/20`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition shadow-sm font-medium"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* hamburger mobile */}
          <button
            className="md:hidden text-2xl px-2 py-1 rounded-md hover:bg-white/10 active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* mobile menu */}
        {open && (
          <ul className="md:hidden px-3 pb-3 pt-1 flex flex-col gap-2 text-[15px] bg-[#001F3F]/95 backdrop-blur border-t border-white/10">
            <li>
              <NavLink
                to="/"
                className={activeClass}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/books"
                className={activeClass}
                onClick={() => setOpen(false)}
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transactions"
                className={activeClass}
                onClick={() => setOpen(false)}
              >
                Transactions
              </NavLink>
            </li>

            <div className="h-px w-full bg-white/10 my-1" />

            {isAuthed ? (
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 transition text-left font-semibold"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`${navItem} bg-white/10 block text-center`}
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="w-full block text-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-[1120px] mx-auto px-3 md:px-6 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#00264D] bg-[#001F3F] text-white pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-[1120px] mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
          <div className="text-[13px] md:text-base font-medium">
            © {new Date().getFullYear()} IT Literature Shop
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-[13px] md:text-sm">
            <Link to="/about" className="hover:text-gray-200">
              About
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/privacy" className="hover:text-gray-200">
              Privacy
            </Link>
            <span className="text-white/40">•</span>
            <a
              href="https://its.ac.id"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-200"
            >
              ITS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
