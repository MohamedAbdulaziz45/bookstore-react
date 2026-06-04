import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import BookGrid from "../../components/book-grid/BookGrid";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import BookReviews from "../../components/book-reviews/BookReviews";
import { getBookById, getAllBooks } from "../../services/bookService";
import { useCartStore } from "../../store/useCartStore";
import { toSlug } from "../../utils/stringUtils";
import type { ibook } from "../../types/book.types";
import type { IBookSummary } from "../../types/book.types";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<ibook | null>(null);
  const [related, setRelated] = useState<IBookSummary[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");
  const [justAdded, setJustAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  const loadRelated = useCallback(async (b: ibook) => {
    try {
      const res = await getAllBooks(b.author, 4, 1, "Rating", "Descending");
      setRelated(res.data.items);
    } catch {
      setRelated([]);
    }
  }, []);

  const loadBook = useCallback(
    async (bookId: number) => {
      try {
        const res = await getBookById(bookId);
        setBook(res.data);
        setIsLoading(false);
        void loadRelated(res.data);
      } catch {
        setBook(null);
        setIsLoading(false);
      }
    },
    [loadRelated],
  );

  useEffect(() => {
    const numId = Number(id);
    if (!numId) return;

    setIsLoading(true);
    setQuantity(1);
    setJustAdded(false);
    setActiveTab("desc");
    window.scrollTo(0, 0);

    void loadBook(numId);
  }, [id, loadBook]);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  const handleAddToCart = async () => {
    if (!book) return;
    for (let i = 0; i < quantity; i++) await addToCart(book);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <>
      <CartSidebar />
      <Header />

      {book ? (
        <>
          {/* Breadcrumb */}
          <div className="bg-warm border-bottom border-brand py-3">
            <div className="container">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 small">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-gold">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/all-books" className="text-gold">
                      All Books
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-brand-gray">
                    {book.title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Product */}
          <section className="section-py bg-brand">
            <div className="container">
              <div className="row g-5">
                {/* Image */}
                <div className="col-lg-5">
                  <div
                    className="rounded-3 overflow-hidden shadow"
                    style={{
                      aspectRatio: "3/4",
                      maxWidth: 380,
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="col-lg-7 d-flex flex-column justify-content-center">
                  {book.categories.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {book.categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/genres/${category.id}/${toSlug(category.name)}`}
                          className="badge rounded-pill fw-semibold text-uppercase small text-decoration-none"
                          style={{
                            background: "rgba(212,175,55,0.15)",
                            color: "var(--brand-dark)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <h1
                    className="section-title mb-2"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                  >
                    {book.title}
                  </h1>

                  {book.author && (
                    <p className="text-brand-gray fw-semibold mb-3">
                      By{" "}
                      <Link
                        to={`/author/${book.authorId}/${toSlug(book.author)}`}
                        className="author-link"
                      >
                        {book.author}
                      </Link>
                    </p>
                  )}

                  {/* Stars */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="d-flex" style={{ color: "#f5c518" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className={`bi small ${s <= (book.rating ?? 0) ? "bi-star-fill" : "bi-star"}`}
                        />
                      ))}
                    </div>
                    <small className="text-brand-gray">
                      ({book.reviewCount} reviews)
                    </small>
                  </div>

                  <div
                    className="fw-bold text-gold mb-3"
                    style={{ fontSize: "2rem" }}
                  >
                    ${book.price.toFixed(2)}
                  </div>

                  <p className="text-brand-gray lh-lg mb-4">
                    {book.description}
                  </p>

                  {/* Qty + Add to cart */}
                  <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                    <div className="input-group" style={{ width: 120 }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={dec}
                      >
                        −
                      </button>
                      <input
                        type="text"
                        className="form-control text-center fw-bold"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={inc}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={`btn btn-lg fw-bold text-uppercase px-5 flex-grow-1 ${justAdded ? "btn-success" : "btn-gold"}`}
                      onClick={handleAddToCart}
                    >
                      <i
                        className={`${justAdded ? "bi bi-check-lg" : "bi bi-bag-plus"} me-2`}
                      />
                      {justAdded ? "Added to Cart!" : "Add to Cart"}
                    </button>
                  </div>

                  <hr
                    className="my-4"
                    style={{ borderColor: "var(--brand-border)" }}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-5">
                <ul
                  className="nav nav-tabs"
                  style={{ borderColor: "var(--brand-border)" }}
                >
                  <li className="nav-item">
                    <button
                      className={`nav-link fw-semibold ${activeTab === "desc" ? "active" : ""}`}
                      onClick={() => setActiveTab("desc")}
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link fw-semibold ${activeTab === "reviews" ? "active" : ""}`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews ({book.reviewCount})
                    </button>
                  </li>
                </ul>
                <div className="py-4 text-brand-gray lh-lg">
                  {activeTab === "desc" ? (
                    <p>{book.description}</p>
                  ) : (
                    <BookReviews
                      bookId={book.id}
                      onReviewAdded={() => void loadBook(book.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <BookGrid
            books={related}
            title="Related Products"
            showViewMore={false}
          />
        </>
      ) : (
        !isLoading && (
          <div className="container section-py text-center">
            <h2 className="fw-bold mb-4">Book Not Found</h2>
            <Link
              to="/all-books"
              className="btn btn-gold btn-lg px-5 fw-bold text-uppercase"
            >
              Back to All Books
            </Link>
          </div>
        )
      )}

      <NewsletterSection />
      <Footer />
    </>
  );
}
