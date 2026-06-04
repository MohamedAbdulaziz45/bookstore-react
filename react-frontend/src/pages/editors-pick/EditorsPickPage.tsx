import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import BookGrid from "../../components/book-grid/BookGrid";
import PageBanner from "../../components/page-banner/PageBanner";
import * as bookService from "../../services/bookService";
import { showToast } from "../../utils/toast";
import type { IBookSummary } from "../../types/book.types";

export default function EditorsPickPage() {
  const [books, setBooks] = useState<IBookSummary[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    bookService
      .getEditorsPicks(12, 1)
      .then((res) => {
        setBooks(res.data.items);
        setIsFallback(res.data.meta ?? false);
      })
      .catch((err) => {
        console.error("Failed to fetch editor's picks from API.", err);
        showToast("Failed to load editor's picks", "error");
        setIsFallback(true);
      });
  }, []);

  return (
    <>
      <CartSidebar />
      <Header />

      <PageBanner
        title="Editors' Picks"
        subtitle="Handpicked by our editorial team — books they can't put down."
      />

      {/* Fallback notice */}
      {isFallback && (
        <div className="container mt-3">
          <div
            className="alert alert-light border rounded-4 px-4 py-3 text-muted"
            style={{ fontSize: ".88rem" }}
          >
            <i className="bi bi-info-circle me-1" />
            No curated editor picks yet — showing our latest titles instead.
          </div>
        </div>
      )}

      <BookGrid books={books} showViewMore={false} columns={4} />

      <Footer />
    </>
  );
}
