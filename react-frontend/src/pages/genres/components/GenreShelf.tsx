import { Link } from "react-router-dom";
import BookGrid from "../../../components/book-grid/BookGrid";
import type { IBookSummary } from "../../../types/book.types";

interface GenreShelfProps {
  eyebrow?: string;
  title?: string;
  isFallBack?: boolean;
  books?: IBookSummary[];
  ctaLabel?: string;
  ctaLink?: string;
}

export default function GenreShelf({
  eyebrow = "",
  title = "",
  isFallBack = false,
  books = [],
  ctaLabel = "See all",
  ctaLink = "/all-books",
}: GenreShelfProps) {
  return (
    <section style={{ paddingTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1rem",
          marginBottom: "1.4rem",
        }}
      >
        <div>
          {eyebrow && (
            <p
              style={{
                margin: "0 0 0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: "0.78rem",
                color: "#8f623a",
              }}
            >
              {eyebrow}
            </p>
          )}

          {title && (
            <h3
              style={{
                margin: 0,
                color: "var(--brand-dark)",
                fontFamily: '"Lato", sans-serif',
              }}
            >
              {title}
            </h3>
          )}

          {isFallBack && (
            <span className="badge bg-warning text-dark fs-6">
              Showing fallback data
            </span>
          )}
        </div>

        <Link
          to={ctaLink}
          style={{ color: "#c78b51", fontWeight: 700, textDecoration: "none" }}
        >
          {ctaLabel}
        </Link>
      </div>

      <BookGrid books={books} showViewMore={false} />
    </section>
  );
}
