import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Books from "./pages/books/Book";
import Transactions from "./pages/transactions/Transaction";
import MainLayout from "./layouts/MainLayout";
import BookDetail from "./pages/books/BookDetail";
import AddBook from "./pages/books/AddBook";
import TransactionDetail from "./pages/transactions/TransactionDetail";
import EditBook from "./pages/books/EditBook";
import "./App.css";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected pages dibungkus MainLayout; guard ada di masing-masing page */}
      <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />   {/* ← ganti Welcome jadi Home */}
    <Route path="books" element={<Books />} />
    <Route path="books/:id" element={<BookDetail />} />
    <Route path="books/:id/edit" element={<EditBook />} />
    <Route path="books/add" element={<AddBook />} />
    <Route path="transactions" element={<Transactions />} />
    <Route path="transactions/:id" element={<TransactionDetail />} />
    </Route>
    </Routes>
  );
}
