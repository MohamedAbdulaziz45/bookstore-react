import BookGrid from "../../../components/book-grid/BookGrid";
import type { IBookSummary } from "../../../types/book.types";

interface SearchBooksGridProps {
  books?: IBookSummary[];
}

export default function SearchBooksGrid({ books = [] }: SearchBooksGridProps) {
  if (books.length) {
    return <BookGrid books={books} showViewMore={false} />;
  }

  return (
    <div
      style={{
        borderRadius: "22px",
        background: "#fff",
        padding: "3rem 1.5rem",
        textAlign: "center",
        border: "1px dashed rgba(199, 139, 81, 0.28)",
      }}
    >
      <h3>No matching books yet</h3>
      <p>
        Try a broader title, author name, or switch to a different sorting
        strategy.
      </p>
    </div>
  );
}
