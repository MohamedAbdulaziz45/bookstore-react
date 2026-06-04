import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import GenreHero from "./components/GenreHero";
import GenreGrid, { type GenreCard } from "./components/GenreGrid";
import GenreShelf from "./components/GenreShelf";
import * as categoryService from "../../services/categoryService";
import * as bookService from "../../services/bookService";
import { toSlug } from "../../utils/stringUtils";
import type { IBookSummary } from "../../types/book.types";

const TONES = [
  "linear-gradient(135deg, #e9c89d 0%, #c78b51 100%)",
  "linear-gradient(135deg, #c9d9d1 0%, #7aa08f 100%)",
  "linear-gradient(135deg, #eed8cf 0%, #d38d71 100%)",
  "linear-gradient(135deg, #d7d9ef 0%, #8a92c9 100%)",
  "linear-gradient(135deg, #e7dfc9 0%, #bea46a 100%)",
];

const pickTone = (index: number) => TONES[index % TONES.length];

const buildDescription = (name: string) =>
  `${name} titles gathered into one shelf so you can expand this storefront without changing the page structure every time.`;

export default function GenresPage() {
  const [genreCards, setGenreCards] = useState<GenreCard[]>([]);
  const [fallbackNotice, setFallbackNotice] = useState("");
  const [genreShelves, setGenreShelves] = useState<
    Record<string, IBookSummary[]>
  >({});

  const [featuredShelf, setFeaturedShelf] = useState<IBookSummary[]>([]);
  const [isFallbackFeatured, setIsFallbackFeatured] = useState(false);

  const [editorShelf, setEditorShelf] = useState<IBookSummary[]>([]);
  const [isFallbackEditors, setIsFallbackEditors] = useState(false);

  // Load genre shelves from API once genre cards are ready
  const loadGenreShelves = (cards: GenreCard[]) => {
    cards.forEach((card) => {
      if (!card.genreId) return;
      bookService
        .getAllBooksByGenre(card.genreId, undefined, 4, 1)
        .then((res) => {
          setGenreShelves((prev) => ({
            ...prev,
            [card.title]: res.data.items,
          }));
        })
        .catch(() => {});
    });
  };

  // Categories
  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((res) => {
        const categories = res.data;
        if (categories.length) {
          setFallbackNotice("");
          const cards = categories.map((cat, index) => ({
            genreId: Number(cat.genreId),
            title: cat.genreName,
            count: cat.count ?? 0,
            tone: pickTone(index),
            description: buildDescription(cat.genreName),
            link: `/genres/${cat.genreId}/${toSlug(cat.genreName)}`,
          }));
          setGenreCards(cards);
          loadGenreShelves(cards);
        } else {
          setFallbackNotice(
            "Genre links are temporarily unavailable until category data loads from the API.",
          );
        }
      })
      .catch(() => {
        setFallbackNotice(
          "Genre links are temporarily unavailable until category data loads from the API.",
        );
      });
  }, []);

  // Featured shelf
  useEffect(() => {
    bookService
      .getFeatured(4, 1)
      .then((res) => {
        setFeaturedShelf(res.data.items);
        setIsFallbackFeatured(res.data.meta);
      })
      .catch(() => {});
  }, []);

  // Editor's picks shelf
  useEffect(() => {
    bookService
      .getEditorsPicks(4, 1)
      .then((res) => {
        setEditorShelf(res.data.items);
        setIsFallbackEditors(res.data.meta);
      })
      .catch(() => {});
  }, []);

  const getBooksByGenre = (genreTitle: string): IBookSummary[] =>
    genreShelves[genreTitle] ?? [];

  return (
    <>
      <Header />
      <PageBanner
        title="Genres & Shelves"
        subtitle="Browse the bookstore the way readers actually shop: by mood, shelf, and reading appetite."
      />

      <section className="section-py bg-brand">
        <div className="container">
          <GenreHero
            eyebrow="Curated Browsing"
            title="Pick a shelf, then let the collection do the talking."
            subtitle="These shelves turn the catalog into something more editorial. Instead of a flat list, readers can jump straight into the kind of story or learning experience they want."
          />

          {fallbackNotice && (
            <div className="alert alert-light border rounded-4 px-4 py-3 mb-4 text-brand-gray">
              {fallbackNotice}
            </div>
          )}

          <GenreGrid genres={genreCards} />

          <GenreShelf
            eyebrow="Featured Books"
            title="Strong entry points for first-time visitors"
            books={featuredShelf}
            isFallBack={isFallbackFeatured}
            ctaLabel="Open all books"
            ctaLink="/all-books"
          />

          <GenreShelf
            eyebrow="Editor Trail"
            title="Curated picks worth putting on the front table"
            books={editorShelf}
            isFallBack={isFallbackEditors}
            ctaLabel="View editor's picks"
            ctaLink="/editors-pick"
          />

          {genreCards.map((genre) => (
            <GenreShelf
              key={genre.title}
              eyebrow={genre.title}
              title={genre.description}
              books={getBooksByGenre(genre.title)}
              ctaLabel="Explore shelf"
              ctaLink={genre.link ?? "/all-books"}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
