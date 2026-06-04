import { useEffect, useState } from "react";
import BookGrid from "../../components/book-grid/BookGrid";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import CategoriesSection from "../../components/categories-section/CategoriesSection";
import Header from "../../components/header/Header";
import HeroSection from "../../components/hero-section/HeroSection";
import FeaturedBook from "../../components/featured-book/FeaturedBook";
import AuthorSection from "../../components/author-section/AuthorSection";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";
import { getEditorsPicks, getFeatured } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";
import { getSpotlight } from "../../services/homeService";
import type { IBookSummary } from "../../types/book.types";
import type { icategory } from "../../types/category.types";
import type { IAuthor } from "../../types/author.types";
import Footer from "../../components/footer/Footer";

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<IBookSummary[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<IBookSummary[]>([]);
  const [categories, setCategories] = useState<icategory[]>([]);
  const [featuredBooksFallback, setFeaturedBooksFallback] = useState(false);
  const [editorsPicksFallback, setEditorsPicksFallback] = useState(false);

  const [spotlightBook, setSpotlightBook] = useState<IBookSummary | null>(null);
  const [spotlightAuthor, setSpotlightAuthor] = useState<IAuthor | null>(null);
  const [spotlightAuthorFallback, setSpotlightAuthorFallback] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadHomeSections = async () => {
      try {
        const [
          featuredResponse,
          categoriesResponse,
          editorsResponse,
          spotlightResponse,
        ] = await Promise.all([
          getFeatured(8),
          getAllCategories(),
          getEditorsPicks(8),
          getSpotlight(),
        ]);

        if (!isActive) return;

        setFeaturedBooks(featuredResponse.data.items);
        setFeaturedBooksFallback(featuredResponse.data.meta);
        setCategories(categoriesResponse.data);
        setEditorsPicks(editorsResponse.data.items);
        setEditorsPicksFallback(editorsResponse.data.meta);

        setSpotlightBook(spotlightResponse.data.featuredBook ?? null);
        setSpotlightAuthor(spotlightResponse.data.featuredAuthor ?? null);
        setSpotlightAuthorFallback(
          spotlightResponse.data.isFeaturedAuthorFallback,
        );
      } catch {
        if (!isActive) return;

        setFeaturedBooks([]);
        setFeaturedBooksFallback(false);
        setCategories([]);
        setEditorsPicks([]);
        setEditorsPicksFallback(false);
      }
    };

    void loadHomeSections();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <CartSidebar />
      <Header />
      <main>
        <HeroSection />
        <BookGrid
          books={featuredBooks}
          isFallBack={featuredBooksFallback}
          title="Discover Featured Book"
          description="Congue, gravida placeat nibh sunt semper elementum anim integer lectus debitis auctor."
        />
        <CategoriesSection categories={categories} />

        {spotlightBook && (
          <FeaturedBook
            title={spotlightBook.title}
            subtitle="featuredBook"
            author={spotlightBook.author}
            description="Explore this handpicked title from our collection."
            image={spotlightBook.image ?? ""}
            price={`$${spotlightBook.price}`}
          />
        )}

        {spotlightAuthor && (
          <AuthorSection
            name={spotlightAuthor.name}
            isFallback={spotlightAuthorFallback}
            bio={spotlightAuthor.bio}
            image={spotlightAuthor.image ?? null}
            id={spotlightAuthor.authorId}
          />
        )}

        <BookGrid
          books={editorsPicks}
          isFallBack={editorsPicksFallback}
          title="Picked By Editors"
          description="Congue, gravida placeat nibh sunt semper elementum anim integer lectus debitis auctor."
          showViewMore={false}
        />

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
