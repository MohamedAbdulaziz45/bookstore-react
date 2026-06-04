import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import BookGrid from "../../components/book-grid/BookGrid";
import PageBanner from "../../components/page-banner/PageBanner";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import * as bookService from "../../services/bookService";
import { showToast } from "../../utils/toast";
import type { IBookSummary } from "../../types/book.types";

export default function FeaturedPage() {
  const [books, setBooks] = useState<IBookSummary[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    bookService
      .getFeatured(12, 1)
      .then((res) => {
        setBooks(res.data.items);
        setIsFallback(res.data.meta ?? false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured books.", err);
        showToast("Failed to load featured books", "error");
      });
  }, []);

  return (
    <>
      <CartSidebar />
      <Header />

      <PageBanner
        title="Featured Books"
        subtitle="Our most loved books — the ones readers recommend again and again."
      />

      {isFallback && (
        <div className="container mt-3">
          <div
            className="alert alert-light border rounded-4 px-4 py-3 text-muted"
            style={{ fontSize: ".88rem" }}
          >
            <i className="bi bi-info-circle me-1" />
            No featured books yet — showing our latest titles instead.
          </div>
        </div>
      )}

      <BookGrid books={books} showViewMore={false} columns={4} />

      <NewsletterSection />
      <Footer />
    </>
  );
}
