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

  return (
    <section className="hero-section">
      <div className="container w-100">
        <div className="row align-items-center g-5">
          {/* Left text */}
          <div className="col-lg-6">
            <div className="hero-badge">Latest Books</div>

            {!loading && activeBook ? (
              <>
                <h1 className="display-title mb-2">{activeBook.title}</h1>
                <p className="text-brand-gray fs-6 mb-1">
                  by {activeBook.author}
                </p>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-warning">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`bi ${s <= (activeBook.rating ?? 0) ? "bi-star-fill" : "bi-star"}`}
                      />
                    ))}
                  </span>
                  <span className="text-brand-gray small">
                    ({activeBook.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-brand-gray fs-4 fw-bold mb-4">
                  ${activeBook.price.toFixed(2)}
                </p>
              </>
            ) : (
              <h1 className="display-title mb-4">
                You're Only One Book Away From a Good Mood
              </h1>
            )}

            <p
              className="text-brand-gray fs-5 lh-lg mb-4"
              style={{ maxWidth: 480 }}
            >
              Discover your next favourite read from our carefully curated
              collection of books spanning all genres.
            </p>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Link
                to={activeBook ? `/book/${activeBook.id}` : "/all-books"}
                className="btn btn-gold btn-lg px-5 py-3 text-uppercase fw-bold"
              >
                {activeBook ? "View Book" : "Discover Now"}
              </Link>
              <Link
                to="/all-books"
                className="btn btn-outline-secondary btn-lg px-4 py-3"
              >
                Browse All
              </Link>
            </div>

            {/* Dot indicators */}
            {books.length > 0 && (
              <div className="d-flex gap-2 mt-4">
                {books.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="btn p-0 border-0 rounded-circle"
                    style={{
                      width: 10,
                      height: 10,
                      background:
                        i === activeIndex
                          ? "var(--color-gold, #c9a84c)"
                          : "#ccc",
                    }}
                    aria-label={`Go to book ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right image + nav arrows */}
          <div className="col-lg-6">
            <div
              className="hero-image-wrap position-relative"
              style={{ aspectRatio: "4/3" }}
            >
              {!loading && activeBook ? (
                <img
                  src={activeBook.image!}
                  alt={activeBook.title}
                  loading="eager"
                  className="w-100 h-100 object-fit-cover rounded"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=900&h=700&fit=crop&q=80"
                  alt="Book collection"
                  loading="eager"
                />
              )}

              {/* Prev / Next arrows */}
              {books.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow"
                    style={{ width: 40, height: 40, padding: 0 }}
                    aria-label="Previous book"
                  >
                    <i className="bi bi-chevron-left" />
                  </button>
                  <button
                    onClick={next}
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow"
                    style={{ width: 40, height: 40, padding: 0 }}
                    aria-label="Next book"
                  >
                    <i className="bi bi-chevron-right" />
                  </button>
                </>
              )}

              {/* Book counter badge */}
              {books.length > 0 && (
                <span className="position-absolute bottom-0 end-0 mb-2 me-2 badge bg-dark bg-opacity-75 text-white">
                  {activeIndex + 1} / {books.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
