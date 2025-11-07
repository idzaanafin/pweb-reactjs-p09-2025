import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Books from "./pages/books/Book";
import Transactions from "./pages/transactions/Transaction";
import MainLayout from "./layouts/MainLayout";
import BookDetail from "./pages/books/BookDetail";
import AddBook from "./pages/books/AddBook";
import TransactionDetail from "./pages/transactions/TransactionDetail";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected pages dibungkus MainLayout; guard ada di masing-masing page */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<h2>Welcome to My App</h2>} />
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<AddBook />} />        {/* <= BARU */}
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/:id" element={<TransactionDetail />} />
      </Route>
    </Routes>
  );
}
