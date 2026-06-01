import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { BooksService } from "../../services/books.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { CategoryService } from "../../services/categories/api-category.service";
import { icategory } from "../../models/icategory";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { ibook } from "../../models/Book/ibook";
import { forkJoin, of } from "rxjs";
import { GenreHeroComponent } from "./components/genre-hero.component";
import {
  GenreGridComponent,
  GenreCard,
} from "./components/genre-grid.component";
import { GenreShelfComponent } from "./components/genre-shelf.component";

@Component({
  selector: "app-genres",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    GenreHeroComponent,
    GenreGridComponent,
    GenreShelfComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Genres & Shelves"
      subtitle="Browse the bookstore the way readers actually shop: by mood, shelf, and reading appetite."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <app-genre-hero
          eyebrow="Curated Browsing"
          title="Pick a shelf, then let the collection do the talking."
          subtitle="These shelves turn the catalog into something more editorial. Instead of a flat list, readers can jump straight into the kind of story or learning experience they want."
        ></app-genre-hero>

        @if (fallbackNotice) {
          <div
            class="alert alert-light border rounded-4 px-4 py-3 mb-4 text-brand-gray"
          >
            {{ fallbackNotice }}
          </div>
        }

        <app-genre-grid [genres]="genreCards"></app-genre-grid>

        <app-genre-shelf
          eyebrow="Featured Books"
          title="Strong entry points for first-time visitors"
          [books]="featuredShelf()"
          [isFallBack]="isFallbackFeatured()"
          ctaLabel="Open all books"
          ctaLink="/all-books"
        ></app-genre-shelf>

        <app-genre-shelf
          eyebrow="Editor Trail"
          title="Curated picks worth putting on the front table"
          [books]="editorShelf()"
          [isFallBack]="isFallbackEditors()"
          ctaLabel="View editor's picks"
          ctaLink="/editors-pick"
        ></app-genre-shelf>

        @for (genre of genreCards; track genre.title) {
          <app-genre-shelf
            [eyebrow]="genre.title"
            [title]="genre.description"
            [books]="getBooksByGenre(genre.title)"
            ctaLabel="Explore shelf"
            [ctaLink]="genre.link || '/all-books'"
          ></app-genre-shelf>
        }
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class GenresComponent implements OnInit {
  featuredShelf = signal<IBookSummary[]>([]);
  editorShelf = signal<IBookSummary[]>([]);
  isFallbackFeatured = signal(false);
  isFallbackEditors = signal(false);
  private booksService = inject(BooksService);
  private apiBookService = inject(ApiBookService);
  private categoryService = inject(CategoryService);
  private books = this.booksService.getAll();
  private readonly catalogPageSize = 12;

  genreCards: GenreCard[] = [];
  fallbackNotice = "";
  genreShelves: Record<string, IBookSummary[]> = {};

  getBooksByGenre(genreTitle: string): IBookSummary[] {
    return this.genreShelves[genreTitle] ?? [];
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        if (categories.length) {
          this.fallbackNotice = "";
          this.genreCards = this.mapApiCategories(categories);
          this.loadGenreShelves(this.genreCards);
          return;
        }

        this.fallbackNotice =
          "Genre links are temporarily unavailable until category data loads from the API.";
        this.genreCards = this.buildFallbackGenres();
        this.genreShelves = this.buildLocalGenreShelves(this.genreCards);
      },
      error: () => {
        this.fallbackNotice =
          "Genre links are temporarily unavailable until category data loads from the API.";
        this.genreCards = this.buildFallbackGenres();
        this.genreShelves = this.buildLocalGenreShelves(this.genreCards);
      },
    });

    this.apiBookService.getFeatured(4, 1).subscribe({
      next: (result) => {
        this.featuredShelf.set(result.items);
        this.isFallbackFeatured.set(result.meta);
      },
    });

    this.apiBookService.getEditorsPicks(4, 1).subscribe({
      next: (result) => {
        this.editorShelf.set(result.items);
        this.isFallbackEditors.set(result.meta);
      },
    });
  }

  private mapApiCategories(categories: icategory[]): GenreCard[] {
    return categories.map((category, index) => {
      const slug = this.toSlug(category.genreName);
      return {
        genreId: Number(category.genreId),
        title: category.genreName,
        count: category.count ?? this.countBooksByGenre(slug),
        tone: this.pickTone(index),
        description: this.buildDescription(category.genreName),
        link: `/genres/${category.genreId}/${slug}`,
      };
    });
  }

  private buildFallbackGenres(): GenreCard[] {
    const genreMap = new Map<string, number>();

    this.books.forEach((book) => {
      book.category
        ?.filter((category) => category !== "all-books")
        .forEach((category) => {
          genreMap.set(category, (genreMap.get(category) ?? 0) + 1);
        });
    });

    return Array.from(genreMap.entries()).map(([slug, count], index) => ({
      title: this.fromSlug(slug),
      count,
      tone: this.pickTone(index),
      description: this.buildDescription(this.fromSlug(slug)),
    }));
  }

  private countBooksByGenre(slug: string) {
    return this.books.filter((book) => book.category?.includes(slug)).length;
  }

  private loadGenreShelves(cards: GenreCard[]) {
    cards.forEach((card) => {
      this.apiBookService
        .getAllBooksByGenre(card.genreId!, undefined, 4, 1)
        .subscribe({
          next: (result) => {
            this.genreShelves = {
              ...this.genreShelves,
              [card.title]: result.items,
            };
          },
        });
    });
  }

  private buildApiGenreShelves(
    cards: GenreCard[],
    books: ibook[],
  ): Record<string, IBookSummary[]> {
    return Object.fromEntries(
      cards.map((card) => [
        card.title,
        books
          .filter((book) => this.bookMatchesGenre(book, card))
          .slice(0, 4)
          .map((book) => this.toSummary(book)),
      ]),
    );
  }

  private buildLocalGenreShelves(
    cards: GenreCard[],
  ): Record<string, IBookSummary[]> {
    return Object.fromEntries(
      cards.map((card) => {
        const slug = this.toSlug(card.title);
        const books = this.books
          .filter((book) => book.category?.includes(slug))
          .slice(0, 4)
          .map((book) => ({
            id: Number(book.id),
            title: book.title,
            price: book.price,
            image: book.image,
            author: book.author ?? "",
            authorId: 0,
            rating: book.rating ?? 0,
            reviewCount: book.reviewCount ?? 0,
          }));

        return [card.title, books];
      }),
    );
  }

  private bookMatchesGenre(book: ibook, card: GenreCard) {
    if (card.genreId) {
      return book.categories?.some((category) => category.id === card.genreId);
    }

    const genreSlug = this.toSlug(card.title);
    return book.categories?.some(
      (category) => this.toSlug(category.name) === genreSlug,
    );
  }

  private toSummary(book: ibook): IBookSummary {
    return {
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      author: book.author,
      authorId: book.authorId,
      rating: book.rating ?? 0,
      reviewCount: book.reviewCount ?? 0,
    };
  }

  private buildDescription(name: string) {
    return `${name} titles gathered into one shelf so you can expand this storefront without changing the page structure every time.`;
  }

  private fromSlug(slug: string) {
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  private toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private pickTone(index: number) {
    const tones = [
      "linear-gradient(135deg, #e9c89d 0%, #c78b51 100%)",
      "linear-gradient(135deg, #c9d9d1 0%, #7aa08f 100%)",
      "linear-gradient(135deg, #eed8cf 0%, #d38d71 100%)",
      "linear-gradient(135deg, #d7d9ef 0%, #8a92c9 100%)",
      "linear-gradient(135deg, #e7dfc9 0%, #bea46a 100%)",
    ];

    return tones[index % tones.length];
  }
}
