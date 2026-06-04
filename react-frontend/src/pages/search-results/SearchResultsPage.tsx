import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import SearchSummary from "./components/SearchSummary";
import SearchBooksGrid from "./components/SearchBooksGrid";
import * as bookService from "../../services/bookService";
import type { IBookSummary } from "../../types/book.types";

type SortDirection = "Ascending" | "Descending";

const mapSort = (
  sort: string,
): { sortBy?: string; sortDirection: SortDirection } => {
  switch (sort) {
    case "price-asc":
      return { sortBy: "Price", sortDirection: "Ascending" };
    case "price-desc":
      return { sortBy: "Price", sortDirection: "Descending" };
    case "title":
      return { sortBy: "Title", sortDirection: "Ascending" };
    case "author":
      return { sortBy: "Author", sortDirection: "Ascending" };
    default:
      return { sortBy: undefined, sortDirection: "Ascending" };
  }
};

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "featured";

  const [results, setResults] = useState<IBookSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadBooks = useCallback(() => {
    setIsLoading(true);
    const { sortBy, sortDirection } = mapSort(sort);
    bookService
      .getAllBooks(query || undefined, 12, 1, sortBy, sortDirection)
      .then((res) => {
        setResults(res.data.items);
        setTotalCount(res.data.totalItemsCount);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [query, sort]);

  // Re-fetch whenever query or sort params change
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const onSearch = (search: string) => {
    setSearchParams({ search, sort });
  };

  const onSortChange = (newSort: string) => {
    setSearchParams({ search: query, sort: newSort });
  };

  return (
    <>
      <Header />
      <PageBanner
        title="Search Results"
        subtitle="A dedicated search surface with clearer intent, better sorting, and room for real filters later."
      />

      <section className="section-py bg-brand">
        <div className="container">
          <SearchSummary
            query={query}
            resultsCount={totalCount}
            sort={sort}
            onSearch={onSearch}
            onSortChange={onSortChange}
          />

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status" />
            </div>
          ) : (
            <div className="mt-4">
              <SearchBooksGrid books={results} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
