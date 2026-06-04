import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import PageBanner from "../../components/page-banner/PageBanner";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import { useCartStore } from "../../store/useCartStore";
import * as bookService from "../../services/bookService";
import { getImageUrl } from "../../utils/imageUtils";
import { toSlug } from "../../utils/stringUtils";
import type { IBookSummary, ibook } from "../../types/book.types";

// ── helpers ────────────────────────────────────────────────────────────────
const FALLBACK_PAGE_SIZE = 24;
const PAGE_SIZE = 12;

const fromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const parseSortValue = (value: string) => {
  if (!value || value === "default")
    return { sortBy: "", sortDirection: "Ascending" as const };
  const last = value.lastIndexOf("_");
  const col = value.substring(0, last);
  const dir = value.substring(last + 1);
  return {
    sortBy: col,
    sortDirection: (dir === "desc" ? "Descending" : "Ascending") as
      | "Ascending"
      | "Descending",
  };
};

const toSummary = (book: ibook): IBookSummary => ({
  id: book.id,
  title: book.title,
  price: book.price,
  image: book.image,
  author: book.author,
  authorId: book.authorId,
  rating: book.rating ?? 0,
  reviewCount: book.reviewCount ?? 0,
});

const bookMatchesGenre = (book: ibook, genreId: number, genreSlug: string) =>
  book.categories?.some(
    (c) => c.id === genreId || toSlug(c.name) === genreSlug,
  );

const sortFallbackBooks = (
  books: ibook[],
  sortBy: string,
  sortDirection: "Ascending" | "Descending",
): ibook[] => {
  const sorted = [...books];
  switch (sortBy) {
    case "Title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "Price":
      return sorted.sort((a, b) =>
        sortDirection === "Ascending" ? a.price - b.price : b.price - a.price,
      );
    case "Author":
      return sorted.sort((a, b) =>
        (a.author || "").localeCompare(b.author || ""),
      );
    default:
      return sorted;
  }
};

const buildVisiblePages = (total: number, current: number): number[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: number[] = [1];
  if (current > 3) pages.push(-1);
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push(-1);
  pages.push(total);
  return pages;
};

// ── component ──────────────────────────────────────────────────────────────
export default function GenreDetailsPage() {
  const { id, slug = "" } = useParams<{ id: string; slug?: string }>();

  const genreId = Number(id);
  const genreName = fromSlug(slug) || "Genre";

  const addToCart = useCartStore((s) => s.addToCart);

  const [books, setBooks] = useState<IBookSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const visiblePages = useMemo(
    () => buildVisiblePages(totalPages, currentPage),
    [totalPages, currentPage],
  );

  // ── fallback loader ───────────────────────────────────────────────────
  const loadBooksFromCatalogFallback = useCallback(
    async (markAsFailedOnError: boolean) => {
      if (!genreId) {
        setBooks([]);
        setTotalCount(0);
        setTotalPages(1);
        setIsLoading(false);
        setLoadFailed(markAsFailedOnError);
        return;
      }

      try {
        const firstRes = await bookService.getAllBooks(
          undefined,
          FALLBACK_PAGE_SIZE,
          1,
        );
        const firstPage = firstRes.data;

        const remainingRequests = Array.from(
          { length: Math.max(firstPage.totalPages - 1, 0) },
          (_, i) =>
            bookService.getAllBooks(undefined, FALLBACK_PAGE_SIZE, i + 2),
        );

        const remainingResponses = await Promise.all(remainingRequests);
        const allItems = [
          firstPage,
          ...remainingResponses.map((r) => r.data),
        ].flatMap((p) => p.items);

        if (!allItems.length) {
          setBooks([]);
          setTotalCount(0);
          setTotalPages(1);
          setIsLoading(false);
          setLoadFailed(false);
          return;
        }

        const detailResponses = await Promise.all(
          allItems.map((b) => bookService.getBookById(b.id)),
        );
        const detailBooks = detailResponses.map((r) => r.data);

        const filtered = detailBooks.filter((b) =>
          bookMatchesGenre(b, genreId, slug),
        );
        const sorted = sortFallbackBooks(filtered, sortBy, sortDirection);
        const count = sorted.length;
        const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
        const safePage = Math.min(currentPage, pages);
        const start = (safePage - 1) * PAGE_SIZE;

        setBooks(sorted.slice(start, start + PAGE_SIZE).map(toSummary));
        setTotalCount(count);
        setTotalPages(pages);
        setCurrentPage(safePage);
        setIsLoading(false);
        setLoadFailed(false);
      } catch {
        setBooks([]);
        setTotalCount(0);
        setTotalPages(1);
        setIsLoading(false);
        setLoadFailed(markAsFailedOnError);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [genreId, slug, sortBy, sortDirection, currentPage],
  );

  // ── primary loader ────────────────────────────────────────────────────
  const loadBooks = useCallback(async () => {
    if (!genreId || !Number.isFinite(genreId) || genreId <= 0) {
      setBooks([]);
      setTotalCount(0);
      setTotalPages(1);
      setIsLoading(false);
      setLoadFailed(true);
      return;
    }

    setIsLoading(true);
    setLoadFailed(false);

    try {
      const res = await bookService.getAllBooksByGenre(
        genreId,
        undefined,
        PAGE_SIZE,
        currentPage,
        sortBy || undefined,
        sortDirection,
      );
      const result = res.data;

      if (!result.items.length) {
        await loadBooksFromCatalogFallback(false);
        return;
      }

      setBooks(result.items);
      setTotalCount(result.totalItemsCount);
      setTotalPages(Math.max(result.totalPages, 1));
      setIsLoading(false);
    } catch {
      await loadBooksFromCatalogFallback(true);
    }
  }, [
    genreId,
    currentPage,
    sortBy,
    sortDirection,
    loadBooksFromCatalogFallback,
  ]);

  // re-run when route params or sort/page change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [id, slug]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  // ── handlers ─────────────────────────────────────────────────────────
  const onSortChange = (value: string) => {
    const { sortBy: sb, sortDirection: sd } = parseSortValue(value);
    setSortBy(sb);
    setSortDirection(sd);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (book: IBookSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void addToCart(book as any);
  };

  // ── render ────────────────────────────────────────────────────────────
  return (
    <>
      <CartSidebar />
      <Header />

      <PageBanner
        title={genreName}
        subtitle={`Browse our complete collection of ${genreName} books.`}
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
                <option value="Title_asc">Title A-Z</option>
                <option value="Price_asc">Price: Low to High</option>
                <option value="Price_desc">Price: High to Low</option>
                <option value="Author_asc">Author A-Z</option>
              </select>
            </div>
          </div>

          {/* States */}
          {isLoading ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <h3 className="section-title mb-2">{genreName}</h3>
              <p className="text-brand-gray mb-0">
                Loading books for this genre...
              </p>
            </div>
          ) : books.length > 0 ? (
            <>
              {/* Book grid */}
              <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
                {books.map((book) => (
                  <div className="col" key={book.id}>
                    <div className="book-card">
                      <Link
                        to={`/book/${book.id}/${toSlug(book.title)}`}
                        className="d-block text-decoration-none book-cover mb-3"
                      >
                        <img
                          src={getImageUrl(book.image, "card")}
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
                        className={`page-item${currentPage === 1 ? " disabled" : ""}`}
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
                            <span className="page-link">...</span>
                          </li>
                        ) : (
                          <li
                            key={page}
                            className={`page-item${page === currentPage ? " active" : ""}`}
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
                        className={`page-item${currentPage === totalPages ? " disabled" : ""}`}
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
          ) : loadFailed ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <h3 className="section-title mb-2">{genreName}</h3>
              <p className="text-brand-gray mb-0">
                We could not load this genre right now. Please try again
                shortly.
              </p>
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 border">
              <h3 className="section-title mb-2">{genreName}</h3>
              <p className="text-brand-gray mb-0">
                No books are mapped to this genre yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  );
}
