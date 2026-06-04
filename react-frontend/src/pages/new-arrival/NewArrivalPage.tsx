import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import BookGrid from "../../components/book-grid/BookGrid";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import * as bookService from "../../services/bookService";
import type { IBookSummary } from "../../types/book.types";

export default function NewArrivalPage() {
  const [books, setBooks] = useState<IBookSummary[]>([]);

  useEffect(() => {
    bookService
      .getAllBooks(undefined, 12, 1, "PublicationDate", "Descending")
      .then((res) => setBooks(res.data.items))
      .catch((err) => console.error("Failed to fetch new arrivals", err));
  }, []);

  return (
    <>
      <CartSidebar />
      <Header />
      <PageBanner
        title="New Arrivals"
        subtitle="The freshest additions to our collection — just arrived."
      />
      <BookGrid books={books} showViewMore={false} columns={4} />
      <NewsletterSection />
      <Footer />
    </>
  );
}
