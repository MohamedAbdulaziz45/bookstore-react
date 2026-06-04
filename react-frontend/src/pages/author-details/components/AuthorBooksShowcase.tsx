import BookGrid from "../../../components/book-grid/BookGrid";
import type { IBookSummary } from "../../../types/book.types";

interface AuthorBooksShowcaseProps {
  title?: string;
  books?: IBookSummary[];
}

export default function AuthorBooksShowcase({
  title = "",
  books = [],
}: AuthorBooksShowcaseProps) {
  return (
    <section style={{ paddingTop: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <p
          style={{
            margin: "0 0 0.35rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: "0.74rem",
            color: "#8f623a",
          }}
        >
          Shelf by Author
        </p>
        <h3
          style={{
            margin: 0,
            color: "var(--brand-dark)",
            fontFamily: '"Lato", sans-serif',
          }}
        >
          {title}
        </h3>
      </div>

      <BookGrid books={books} showViewMore={false} />
    </section>
  );
}
