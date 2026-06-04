import { type MouseEvent } from "react";
import { Link } from "react-router";
import { useCartStore } from "../../store/useCartStore";
import type { IBookSummary, ibook } from "../../types/book.types";
import { toSlug } from "../../utils/stringUtils";

type BookGridBook = IBookSummary | ibook;

interface BookGridProps {
  books?: BookGridBook[];
  title?: string;
  description?: string;
  isFallBack?: boolean;
  showViewMore?: boolean;
  columns?: 2 | 3 | 4;
}

const getRowColsClass = (columns: 2 | 3 | 4): string => {
  if (columns === 2) return "row-cols-1 row-cols-sm-2";
  if (columns === 3) return "row-cols-2 row-cols-md-3";
  return "row-cols-2 row-cols-md-3 row-cols-lg-4";
};

export default function BookGrid({
  books = [],
  title,
  description,
  isFallBack = false,
  showViewMore = true,
  columns = 4,
}: BookGridProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const rowColsClass = getRowColsClass(columns);

  const handleAddToCart = (
    book: BookGridBook,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    void addToCart(book as ibook);
  };

  return (
    <section className="section-py bg-brand">
      <div className="container-fluid px-2">
        {title && (
          <div className="text-center mb-5">
            <h2 className="section-title">{title}</h2>
            {description && (
              <p
                className="text-brand-gray mt-2 mx-auto"
                style={{ maxWidth: "520px" }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {isFallBack && (
          <div className="alert alert-warning text-center" role="alert">
            No books found. Displaying newest content.
          </div>
        )}

        <div className={`row g-4 ${rowColsClass}`}>
          {books.map((book) => (
            <div className="col" key={book.id}>
              <div className="book-card">
                <Link
                  to={`/book/${book.id}/${toSlug(book.title)}`}
                  className="d-block text-decoration-none book-cover mb-3"
                >
                  <img src={book.image ?? ""} alt={book.title} loading="lazy" />
                  <div className="cover-overlay">
                    <button
                      className="btn btn-gold btn-sm px-3 fw-bold"
                      onClick={(event) => handleAddToCart(book, event)}
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
                  <span className="book-price">${book.price.toFixed(2)}</span>
                  <button
                    className="btn btn-link btn-sm p-0 fw-semibold text-gold text-decoration-none"
                    onClick={(event) => handleAddToCart(book, event)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showViewMore && (
          <div className="text-center mt-5">
            <Link
              to="/all-books"
              className="btn btn-gold btn-lg px-5 text-uppercase fw-bold"
            >
              Discover More Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
