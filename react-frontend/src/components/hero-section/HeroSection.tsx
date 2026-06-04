import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../../services/bookService";
import type { IBookSummary } from "../../types/book.types";

export default function HeroSection() {
  const [books, setBooks] = useState<IBookSummary[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const activeBook = books[activeIndex] ?? null;

  useEffect(() => {
    getAllBooks(undefined, 4, 1, "PublicationDate", "Descending")
      .then((res) => setBooks(res.data.items))
      .catch(() => {
        // silently fail — hero still renders with fallback
      })
      .finally(() => setLoading(false));
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? books.length - 1 : i - 1));
  }, [books.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === books.length - 1 ? 0 : i + 1));
  }, [books.length]);

  const goTo = (index: number) => setActiveIndex(index);

  // Fallback cover image
  const fallbackImage =
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop";
  const currentImageUrl =
    !loading && activeBook?.image ? activeBook.image : fallbackImage;

  return (
    <section
      className="hero-section py-5 position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fdfbf7 0%, #f5f0e6 100%)",
      }}
    >
      <div className="container py-4">
        <div className="row align-items-center g-5">
          {/* Left text column */}
          <div className="col-lg-6 order-2 order-lg-1">
            <span
              className="badge bg-gold text-dark text-uppercase px-3 py-2 mb-3 fw-semibold tracking-wider"
              style={{
                backgroundColor: "var(--color-gold, #c9a84c)",
                letterSpacing: "1px",
              }}
            >
              Latest Releases
            </span>

            {!loading && activeBook ? (
              <>
                <h1 className="display-4 fw-bold text-dark mb-2 lh-sm">
                  {activeBook.title}
                </h1>
                <p className="text-muted fs-5 mb-3 italic">
                  by{" "}
                  <span className="fw-medium text-dark">
                    {activeBook.author}
                  </span>
                </p>

                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="text-warning fs-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`bi ${s <= (activeBook.rating ?? 0) ? "bi-star-fill" : "bi-star"}`}
                        style={{ marginRight: "2px" }}
                      />
                    ))}
                  </span>
                  <span className="text-muted small fw-medium">
                    ({activeBook.reviewCount} customer reviews)
                  </span>
                </div>

                <p className="text-dark fs-3 fw-extrabold mb-4">
                  ${activeBook.price.toFixed(2)}
                </p>
              </>
            ) : (
              <h1 className="display-4 fw-bold text-dark mb-4 lh-sm">
                You're Only One Book Away From a Good Mood
              </h1>
            )}

            <p
              className="text-secondary fs-5 lh-base mb-5"
              style={{ maxWidth: 520 }}
            >
              Discover your next favourite read from our carefully curated
              collection of books spanning all genres.
            </p>

            <div className="d-flex align-items-center gap-3 flex-wrap mb-5">
              <Link
                to={activeBook ? `/book/${activeBook.id}` : "/all-books"}
                className="btn btn-dark btn-lg px-5 py-3 text-uppercase fw-bold shadow-sm"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "none",
                  fontSize: "0.9rem",
                }}
              >
                {activeBook ? "View Details" : "Discover Now"}
              </Link>
              <Link
                to="/all-books"
                className="btn btn-outline-dark btn-lg px-4 py-3 text-uppercase fw-bold"
                style={{ fontSize: "0.9rem" }}
              >
                Browse Entire Catalog
              </Link>
            </div>

            {/* Dot indicators */}
            {books.length > 0 && (
              <div className="d-flex gap-2">
                {books.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="btn p-0 border-0 transition-all"
                    style={{
                      width: i === activeIndex ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background:
                        i === activeIndex
                          ? "var(--color-gold, #c9a84c)"
                          : "#ccc",
                      transition: "all 0.3s ease",
                    }}
                    aria-label={`Go to book ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Image Display Column */}
          <div className="col-lg-6 order-1 order-lg-2 d-flex justify-content-center">
            <div
              className="position-relative w-100"
              style={{ maxWidth: "380px" }}
            >
              {/* Decorative Ambient Soft Glow Behind the Book */}
              <div
                className="position-absolute start-50 top-50 translate-middle w-75 h-75 rounded-4 opacity-25 d-none d-sm-block"
                style={{
                  backgroundImage: `url(${currentImageUrl})`,
                  backgroundSize: "cover",
                  filter: "blur(40px)",
                  zIndex: 0,
                  transform: "translate(-50%, -45%) scale(1.1)",
                }}
              />

              {/* Main Showcase Wrapper */}
              <div
                className="position-relative mx-auto"
                style={{
                  aspectRatio: "2/3",
                  zIndex: 1,
                  perspective: "1000px",
                }}
              >
                <div
                  className="w-100 h-100 rounded-3 overflow-hidden"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                    transform: "rotateY(-5deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.5s ease",
                  }}
                >
                  <img
                    src={currentImageUrl}
                    alt={activeBook?.title || "Book collection"}
                    loading="eager"
                    className="w-100 h-100 object-fit-contain bg-white"
                  />
                </div>

                {/* Left Edge Spine Highlight Simulation */}
                <div
                  className="position-absolute top-0 start-0 h-100"
                  style={{
                    width: "10px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.15) 100%)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />

                {/* Navigation Arrows floating cleanly on side of the element container */}
                {books.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="btn btn-light position-absolute top-50 start-0 translate-middle rounded-circle shadow-lg border-0 d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44, zIndex: 10 }}
                      aria-label="Previous book"
                    >
                      <i className="bi bi-chevron-left fs-5" />
                    </button>
                    <button
                      onClick={next}
                      className="btn btn-light position-absolute top-50 start-100 translate-middle rounded-circle shadow-lg border-0 d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44, zIndex: 10 }}
                      aria-label="Next book"
                    >
                      <i className="bi bi-chevron-right fs-5" />
                    </button>
                  </>
                )}

                {/* Sleek Floating Book counter badge */}
                {books.length > 0 && (
                  <span
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-3 badge rounded-pill bg-dark bg-opacity-75 px-3 py-2 fs-7 tracking-wide"
                    style={{ zIndex: 3 }}
                  >
                    {activeIndex + 1} of {books.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
