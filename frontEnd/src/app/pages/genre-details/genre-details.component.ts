import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { CartService } from "../../services/cart.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { ibook } from "../../models/Book/ibook";
import { forkJoin, of } from "rxjs";

@Component({
  selector: "app-genre-details",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    NewsletterSectionComponent,
    CartSidebarComponent,
  ],
  template: `
    <app-cart-sidebar></app-cart-sidebar>
    <app-header></app-header>
    <app-page-banner
      [title]="genreName()"
      [subtitle]="
        'Browse our complete collection of ' + genreName() + ' books.'
      "
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <div
          class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 gap-3"
        >
          <p class="mb-0 text-brand-gray">
            Showing
            <strong style="color: var(--brand-dark)">{{ totalCount() }}</strong>
            results
          </p>
          <div class="d-flex align-items-center gap-2">
            <label class="mb-0 small fw-bold" style="color: var(--brand-dark)"
              >Sort by:</label
            >
            <select
              class="form-select form-select-sm"
              style="width: auto"
              (change)="onSortChange($any($event.target).value)"
            >
              <option value="default">Default sorting</option>
              <option value="Title_asc">Title A-Z</option>
              <option value="Price_asc">Price: Low to High</option>
              <option value="Price_desc">Price: High to Low</option>
              <option value="Author_asc">Author A-Z</option>
            </select>
          </div>
        </div>

        @if (isLoading()) {
          <div class="text-center py-5 bg-white rounded-4 border">
            <h3 class="section-title mb-2">{{ genreName() }}</h3>
            <p class="text-brand-gray mb-0">Loading books for this genre...</p>
          </div>
        } @else if (paginatedBooks().length) {
          <div class="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            @for (book of paginatedBooks(); track book.id) {
              <div class="col">
                <div class="book-card">
                  <a
                    [routerLink]="['/book', book.id, toSlug(book.title)]"
                    class="d-block text-decoration-none book-cover mb-3"
                  >
                    <img [src]="book.image" [alt]="book.title" loading="lazy" />
                    <div class="cover-overlay">
                      <button
                        class="btn btn-gold btn-sm px-3 fw-bold"
                        (click)="addToCart(book, $event)"
                      >
                        <i class="bi bi-bag-plus me-1"></i>Add
                      </button>
                    </div>
                  </a>
                  <a
                    [routerLink]="['/book', book.id, toSlug(book.title)]"
                    class="text-decoration-none"
                  >
                    <p class="book-title mb-1">{{ book.title }}</p>
                  </a>
                  @if (book.author) {
                    <small class="text-brand-gray d-block mb-2">{{
                      book.author
                    }}</small>
                  }
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <span class="book-price"
                      >\${{ book.price.toFixed(2) }}</span
                    >
                    <button
                      class="btn btn-link btn-sm p-0 text-gold fw-semibold text-decoration-none"
                      (click)="addToCart(book, $event)"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="d-flex flex-column align-items-center mt-5 gap-2">
              <nav>
                <ul class="pagination pagination-brand mb-0">
                  <li class="page-item" [class.disabled]="currentPage() === 1">
                    <button
                      class="page-link"
                      (click)="goToPage(currentPage() - 1)"
                      [disabled]="currentPage() === 1"
                    >
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>

                  @for (page of visiblePages(); track page) {
                    @if (page === -1) {
                      <li class="page-item disabled">
                        <span class="page-link">...</span>
                      </li>
                    } @else {
                      <li
                        class="page-item"
                        [class.active]="page === currentPage()"
                      >
                        <button class="page-link" (click)="goToPage(page)">
                          {{ page }}
                        </button>
                      </li>
                    }
                  }

                  <li
                    class="page-item"
                    [class.disabled]="currentPage() === totalPages()"
                  >
                    <button
                      class="page-link"
                      (click)="goToPage(currentPage() + 1)"
                      [disabled]="currentPage() === totalPages()"
                    >
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
              <small class="text-brand-gray"
                >Page {{ currentPage() }} of {{ totalPages() }}</small
              >
            </div>
          }
        } @else if (loadFailed()) {
          <div class="text-center py-5 bg-white rounded-4 border">
            <h3 class="section-title mb-2">{{ genreName() }}</h3>
            <p class="text-brand-gray mb-0">
              We could not load this genre right now. Please try again shortly.
            </p>
          </div>
        } @else {
          <div class="text-center py-5 bg-white rounded-4 border">
            <h3 class="section-title mb-2">{{ genreName() }}</h3>
            <p class="text-brand-gray mb-0">
              No books are mapped to this genre yet.
            </p>
          </div>
        }
      </div>
    </section>

    <app-newsletter-section></app-newsletter-section>
    <app-footer></app-footer>
  `,
})
export class GenreDetailsComponent {
  private route = inject(ActivatedRoute);
  private apiBookService = inject(ApiBookService);
  public cartService = inject(CartService);

  readonly fallbackCatalogPageSize = 24;
  readonly pageSize = 12;
  currentPage = signal(1);
  genreId = signal<number | null>(null);
  genreSlug = signal("");
  genreName = signal("Genre");
  sortBy = signal("");
  sortDirection = signal<"Ascending" | "Descending">("Ascending");
  books = signal<IBookSummary[]>([]);
  totalCount = signal(0);
  totalPages = signal(1);
  isLoading = signal(true);
  loadFailed = signal(false);

  paginatedBooks = computed(() => this.books());

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (current > 3) pages.push(-1);
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get("id"));
      const slug = params.get("slug") ?? "";

      this.genreId.set(Number.isFinite(id) && id > 0 ? id : null);
      this.genreSlug.set(slug);
      this.genreName.set(this.fromSlug(slug) || "Genre");
      this.currentPage.set(1);
      this.loadBooks();
      window.scrollTo(0, 0);
    });
  }

  onSortChange(value: string) {
    this.sortBy.set("");
    this.sortDirection.set("Ascending");

    if (value && value !== "default") {
      const lastUnderscore = value.lastIndexOf("_");
      const col = value.substring(0, lastUnderscore);
      const dir = value.substring(lastUnderscore + 1);
      this.sortBy.set(col);
      this.sortDirection.set(dir === "desc" ? "Descending" : "Ascending");
    }

    this.currentPage.set(1);
    this.loadBooks();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadBooks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  addToCart(book: IBookSummary, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(book as any);
  }

  private loadBooks() {
    const id = this.genreId();

    if (!id) {
      this.resetBooksState();
      this.isLoading.set(false);
      this.loadFailed.set(true);
      return;
    }

    this.isLoading.set(true);
    this.loadFailed.set(false);

    this.apiBookService
      .getAllBooksByGenre(
        id,
        undefined,
        this.pageSize,
        this.currentPage(),
        this.sortBy() || undefined,
        this.sortDirection(),
      )
      .subscribe({
        next: (result) => {
          if (!result.items.length) {
            this.loadBooksFromCatalogFallback(false);
            return;
          }

          this.books.set(result.items);
          this.totalCount.set(result.totalItemsCount);
          this.totalPages.set(Math.max(result.totalPages, 1));
          this.isLoading.set(false);
        },
        error: () => {
          this.loadBooksFromCatalogFallback(true);
        },
      });
  }

  private loadBooksFromCatalogFallback(markAsFailedOnError: boolean) {
    const genreId = this.genreId();
    const genreSlug = this.genreSlug();

    if (!genreId) {
      this.resetBooksState();
      this.isLoading.set(false);
      this.loadFailed.set(markAsFailedOnError);
      return;
    }

    this.apiBookService
      .getAllBooks(undefined, this.fallbackCatalogPageSize, 1)
      .subscribe({
        next: (firstPage) => {
          const remainingPageRequests = Array.from(
            { length: Math.max(firstPage.totalPages - 1, 0) },
            (_, index) =>
              this.apiBookService.getAllBooks(
                undefined,
                this.fallbackCatalogPageSize,
                index + 2,
              ),
          );

          const remainingPages$ = remainingPageRequests.length
            ? forkJoin(remainingPageRequests)
            : of([]);

          remainingPages$.subscribe({
            next: (remainingPages) => {
              const allItems = [firstPage, ...remainingPages].flatMap(
                (page) => page.items,
              );

              if (!allItems.length) {
                this.resetBooksState();
                this.isLoading.set(false);
                this.loadFailed.set(false);
                return;
              }

              forkJoin(
                allItems.map((book) =>
                  this.apiBookService.getBookById(book.id),
                ),
              ).subscribe({
                next: (books) => {
                  const filtered = books.filter((book) =>
                    this.bookMatchesGenre(book, genreId, genreSlug),
                  );
                  const sorted = this.sortFallbackBooks(filtered);
                  const totalCount = sorted.length;
                  const totalPages = Math.max(
                    1,
                    Math.ceil(totalCount / this.pageSize),
                  );
                  const safePage = Math.min(this.currentPage(), totalPages);
                  const start = (safePage - 1) * this.pageSize;

                  this.books.set(
                    sorted
                      .slice(start, start + this.pageSize)
                      .map((book) => this.toSummary(book)),
                  );
                  this.totalCount.set(totalCount);
                  this.totalPages.set(totalPages);
                  this.currentPage.set(safePage);
                  this.isLoading.set(false);
                  this.loadFailed.set(false);
                },
                error: () => {
                  this.resetBooksState();
                  this.isLoading.set(false);
                  this.loadFailed.set(markAsFailedOnError);
                },
              });
            },
            error: () => {
              this.resetBooksState();
              this.isLoading.set(false);
              this.loadFailed.set(markAsFailedOnError);
            },
          });
        },
        error: () => {
          this.resetBooksState();
          this.isLoading.set(false);
          this.loadFailed.set(markAsFailedOnError);
        },
      });
  }

  private bookMatchesGenre(book: ibook, genreId: number, genreSlug: string) {
    return book.categories?.some(
      (category) =>
        category.id === genreId || this.toSlug(category.name) === genreSlug,
    );
  }

  private sortFallbackBooks(books: ibook[]) {
    const sorted = [...books];

    switch (this.sortBy()) {
      case "Title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "Price":
        return sorted.sort((a, b) =>
          this.sortDirection() === "Ascending"
            ? a.price - b.price
            : b.price - a.price,
        );
      case "Author":
        return sorted.sort((a, b) =>
          (a.author || "").localeCompare(b.author || ""),
        );
      default:
        return sorted;
    }
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

  private resetBooksState() {
    this.books.set([]);
    this.totalCount.set(0);
    this.totalPages.set(1);
  }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private fromSlug(slug: string) {
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
}
