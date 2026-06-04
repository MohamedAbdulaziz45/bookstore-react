import { useState, useEffect } from "react";

interface SearchSummaryProps {
  query?: string;
  resultsCount?: number;
  sort?: string;
  onSearch?: (query: string) => void;
  onSortChange?: (sort: string) => void;
}

export default function SearchSummary({
  query = "",
  resultsCount = 0,
  sort = "Title",
  onSearch,
  onSortChange,
}: SearchSummaryProps) {
  const [draftQuery, setDraftQuery] = useState(query);

  // Keep draftQuery in sync when query prop changes (mirrors ngOnChanges)
  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const submitSearch = () => onSearch?.(draftQuery.trim());

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitSearch();
  };

  return (
    <>
      <style>{`
        .search-summary-card {
          background: linear-gradient(135deg, #fff8ef 0%, #f3e7d7 100%);
          border: 1px solid rgba(199, 139, 81, 0.18);
          border-radius: 22px;
          padding: 1.5rem;
          display: grid;
          gap: 1.2rem;
        }
        .search-eyebrow {
          margin: 0 0 0.35rem;
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.14em;
          color: #8f623a;
        }
        .search-title {
          margin: 0 0 0.45rem;
          color: var(--brand-dark);
          font-family: "Lato", sans-serif;
        }
        .search-copy {
          margin: 0;
          color: var(--brand-gray);
        }
        .search-controls {
          display: grid;
          grid-template-columns: 1.7fr 1fr auto;
          gap: 0.75rem;
        }
        @media (max-width: 767px) {
          .search-controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="search-summary-card">
        <div>
          <p className="search-eyebrow">Search Focus</p>
          <h3 className="search-title">"{query || "All books"}"</h3>
          <p className="search-copy">
            {resultsCount} matching books across title and author.
          </p>
        </div>

        <div className="search-controls">
          <input
            className="form-control"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Refine search..."
          />
          <select
            className="form-select"
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button className="btn btn-gold" onClick={submitSearch}>
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
