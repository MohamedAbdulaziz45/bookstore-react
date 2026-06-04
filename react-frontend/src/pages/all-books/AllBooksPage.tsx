import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import { getAllBooks } from "../../services/bookService";
import { useCartStore } from "../../store/useCartStore";
import { toSlug } from "../../utils/stringUtils";
import type { IBookSummary } from "../../types/book.types";

const PAGE_SIZE = 12;

export default function AllBooksPage() {
  const [books, setBooks] = useState<IBookSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const searchPhrase = searchParams.get("search") ?? undefined;

  const addToCart = useCartStore((state) => state.addToCart);

  const visiblePages = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (currentPage > 3) pages.push(-1);
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push(-1);
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const loadBooks = useCallback(
    async (page: number, sb: string, sd: "Ascending" | "Descending") => {
      setIsLoading(true);
      try {
        const res = await getAllBooks(
          searchPhrase,
          PAGE_SIZE,
          page,
          sb || undefined,
          sd,
        );
        setBooks(res.data.items);
        setTotalCount(res.data.totalItemsCount);
        setTotalPages(res.data.totalPages);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    },
    [searchPhrase],
  );

  // Reset to page 1 and reload when search phrase changes
  useEffect(() => {
    setCurrentPage(1);
    setSortBy("");
    setSortDirection("Ascending");
    void loadBooks(1, "", "Ascending");
    window.scrollTo(0, 0);
  }, [searchPhrase]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSortChange = (value: string) => {
    let newSortBy = "";
    let newSortDir: "Ascending" | "Descending" = "Ascending";

    if (value && value !== "default") {
      const lastUnderscore = value.lastIndexOf("_");
      newSortBy = value.substring(0, lastUnderscore);
      newSortDir =
        value.substring(lastUnderscore + 1) === "desc"
          ? "Descending"
          : "Ascending";
    }

    setSortBy(newSortBy);
    setSortDirection(newSortDir);
    setCurrentPage(1);
    void loadBooks(1, newSortBy, newSortDir);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    void loadBooks(page, sortBy, sortDirection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (book: IBookSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void addToCart(book as any);
  };

  return (
    <>
      <CartSidebar />
      <Header />
      <PageBanner
        title="All Books"
        subtitle="Browse our complete collection of books."
      />

      <section className="section-py bg-brand">
        <div className="container">
          {/* Toolbar */}
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 gap-3">
            <p className="mb-0 text-brand-gray">
              Showing{" "}
              <strong style={{ color: "var(--brand-dark)" }}>
                {totalCount}
              </strong>{" "}
              results
            </p>
            <div className="d-flex align-items-center gap-2">
              <label
                className="mb-0 small fw-bold"
                style={{ color: "var(--brand-dark)" }}
              >
                Sort by:
              </label>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="default">Default sorting</option>
                <option value="Title_asc">Title A–Z</option>
                <option value="Price_asc">Price: Low → High</option>
                <option value="Price_desc">Price: High → Low</option>
                <option value="Author_asc">Author A–Z</option>
                <option value="Rating_desc">Best Rated</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status" />
            </div>
          )}

          {/* Grid */}
          {!isLoading && (
            <>
              <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
                {books.map((book) => (
                  <div key={book.id} className="col">
                    <div className="book-card">
                      <Link
                        to={`/book/${book.id}/${toSlug(book.title)}`}
                        className="d-block text-decoration-none book-cover mb-3"
                      >
                        <img
                          src={book.image ?? undefined}
                          alt={book.title}
                          loading="lazy"
                        />
                        <div className="cover-overlay">
                          <button
                            className="btn btn-gold btn-sm px-3 fw-bold"
                            onClick={(e) => handleAddToCart(book, e)}
                          >
                            <i className="bi bi-bag-plus me-1" />
                            Add
                          </button>
                        </div>
                      </Link>
                      <Link
                        to={`/book/${book.id}/${toSlug(book.title)}`}
                        className="text-decoration-none"
                      >
                        <p className="book-title mb-1">{book.title}</p>
                      </Link>
                      {book.author && (
                        <small className="text-brand-gray d-block mb-2">
                          {book.author}
                        </small>
                      )}
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="book-price">
                          ${book.price.toFixed(2)}
                        </span>
                        <button
                          className="btn btn-link btn-sm p-0 text-gold fw-semibold text-decoration-none"
                          onClick={(e) => handleAddToCart(book, e)}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex flex-column align-items-center mt-5 gap-2">
                  <nav>
                    <ul className="pagination pagination-brand mb-0">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="bi bi-chevron-left" />
                        </button>
                      </li>

                      {visiblePages.map((page, idx) =>
                        page === -1 ? (
                          <li
                            key={`ellipsis-${idx}`}
                            className="page-item disabled"
                          >
                            <span className="page-link">…</span>
                          </li>
                        ) : (
                          <li
                            key={page}
                            className={`page-item ${page === currentPage ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => goToPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ),
                      )}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="bi bi-chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                  <small className="text-brand-gray">
                    Page {currentPage} of {totalPages}
                  </small>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  );
}
