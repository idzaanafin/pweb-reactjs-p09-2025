import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true); 

      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      if (res.data.data.token) {
        localStorage.setItem("token", res.data.data.token);
        setMessage(res.data.message);

        setTimeout(() => {
          navigate("/books");
        }, 800);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || err.message || "Terjadi kesalahan, silakan coba lagi.");
      } else {
        setMessage((err as Error)?.message || "Terjadi kesalahan, silakan coba lagi.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        {/* Message */}
        {message && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              message.toLowerCase().includes("berhasil")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-400 text-black cursor-not-allowed"
                : "bg-black text-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
