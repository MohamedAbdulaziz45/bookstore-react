import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import AuthorProfileCard from "./components/AuthorProfileCard";
import SortedBookGrid from "../../components/sorted-book-grid/SortedBookGrid";
import { getAuthorById } from "../../services/authorService";
import { getAllBooks } from "../../services/bookService";
import type { IAuthor } from "../../types/author.types";
import type { IBookSummary } from "../../types/book.types";

export default function AuthorDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [author, setAuthor] = useState<IAuthor | null>(null);
  const [authorBooks, setAuthorBooks] = useState<IBookSummary[]>([]);

  const stats = useMemo(
    () => [
      {
        label: "Titles in store",
        value: String(authorBooks.length),
      },
      {
        label: "Average price",
        value: `$${(
          authorBooks.reduce((sum, book) => sum + book.price, 0) /
          Math.max(authorBooks.length, 1)
        ).toFixed(2)}`,
      },
    ],
    [authorBooks],
  );

  useEffect(() => {
    const numId = Number(id);
    if (!Number.isFinite(numId) || numId <= 0) {
      setAuthor(null);
      setAuthorBooks([]);
      return;
    }

    getAuthorById(numId)
      .then((res) => {
        const authorData = res.data;
        setAuthor(authorData);

        return getAllBooks(authorData.name, 4, 1, undefined, undefined);
      })
      .then((res) => {
        if (res) setAuthorBooks(res.data.items);
      })
      .catch(() => {
        setAuthor(null);
        setAuthorBooks([]);
      });
  }, [id]);

  return (
    <>
      <Header />
      <PageBanner
        title="Author Details"
        subtitle="A dedicated destination for author identity, shelf depth, and stronger discovery paths."
      />

      <section className="section-py bg-brand">
        <div className="container">
          {author && (
            <>
              <AuthorProfileCard
                name={author.name}
                bio={author.bio}
                image={author.image ?? null}
                stats={stats}
              />

              <SortedBookGrid
                title="Books By this author"
                searchPhrase={author.name}
              />
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
