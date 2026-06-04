import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../../services/bookService";
import type { IBookSummary } from "../../types/book.types";
import { toSlug } from "../../utils/stringUtils";

interface AuthorSectionProps {
  name: string | null;
  bio: string | null;
  isFallback?: boolean;
  image: string | null;
  id: number | null;
}

export default function AuthorSection({
  name,
  bio,
  isFallback = false,
  image,
  id,
}: AuthorSectionProps) {
  const [authorBooks, setAuthorBooks] = useState<IBookSummary[]>([]);

  useEffect(() => {
    getAllBooks(name ?? undefined, 4, 1, undefined, undefined)
      .then((res) => setAuthorBooks(res.data.items))
      .catch(() => {
        // silently fail
      });
  }, [name]);

  return (
    <section className="section-py bg-warm">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image */}
          <div className="col-lg-5">
            <div className="split-img">
              <Link to={`/author/${id}/${toSlug(name ?? "")}`}>
                <img src={image ?? undefined} alt={name ?? ""} loading="lazy" />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-7">
            <span className="section-label">
              {isFallback ? "Author Spotlight" : "Author of the Month"}
            </span>

            <h2 className="section-title mb-3">{name}</h2>
            <p className="text-brand-gray lh-lg mb-4">{bio}</p>

            <h6
              className="fw-bold mb-3"
              style={{ fontFamily: '"Lato", sans-serif' }}
            >
              Featured Works
            </h6>

            {authorBooks.map((book) => (
              <div
                key={book.id}
                className="d-flex align-items-center gap-3 py-3 border-bottom border-brand"
              >
                {book.image && (
                  <Link to={`/book/${book.id}/${toSlug(book.title)}`}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="rounded flex-shrink-0"
                      style={{ width: 48, height: 62, objectFit: "cover" }}
                    />
                  </Link>
                )}
                <span
                  className="fw-semibold flex-grow-1"
                  style={{ fontSize: "0.95rem" }}
                >
                  {book.title}
                </span>
                <span className="text-gold fw-bold small">{book.price}</span>
              </div>
            ))}

            <Link
              to={`/author/${id}/${toSlug(name ?? "")}`}
              className="btn btn-gold btn-lg px-5 text-uppercase fw-bold mt-4"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
