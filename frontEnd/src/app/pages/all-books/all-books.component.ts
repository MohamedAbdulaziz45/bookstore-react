import { Component, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { CartService } from "../../services/cart.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { ibook } from "../../models/Book/ibook";

@Component({
  selector: "app-all-books",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    NewsletterSectionComponent,
    CartSidebarComponent,
  ],
  templateUrl: "./all-books.component.html",
})
export class AllBooksComponent implements OnInit {
  books = signal<IBookSummary[]>([]);
  totalCount = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  readonly pageSize = 12;
  sortBy = signal("");
  sortDirection = signal<"Ascending" | "Descending">("Ascending");
  searchPhrase = signal<string | undefined>(undefined);
  isLoading = signal(false);

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
  // sortedBooks = computed(() => {
  //   const books = [...this.allBooks];
  //   switch (this.sortBy()) {
  //     case "name":
  //       return books.sort((a, b) => a.title.localeCompare(b.title));
  //     case "price-asc":
  //       return books.sort((a, b) => a.price - b.price);
  //     case "price-desc":
  //       return books.sort((a, b) => b.price - a.price);
  //     default:
  //       return books;
  //   }
  // });
  constructor(
    private apiBookService: ApiBookService,
    private route: ActivatedRoute,
    public cartService: CartService,
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    //   const q = params["search"];
    //   if (q) {
    //     this.allBooks = this.booksService.searchBooks(q);
    //   } else {
    //     this.allBooks = this.booksService.getAll();
    //   }
    // });

    this.route.queryParams.subscribe((params) => {
      const q = params["search"] ?? undefined;
      this.searchPhrase.set(q);
      this.currentPage.set(1);
      this.loadBooks();
      window.scrollTo(0, 0);
    });
  }
  loadBooks() {
    this.isLoading.set(true);
    this.apiBookService
      .getAllBooks(
        this.searchPhrase(),
        this.pageSize,
        this.currentPage(),
        this.sortBy() || undefined,
        this.sortDirection(),
      )
      .subscribe({
        next: (result) => {
          this.books.set(result.items);
          this.totalCount.set(result.totalItemsCount);
          this.totalPages.set(result.totalPages);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
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

  addToCart(book: IBookSummary, e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.cartService.addToCart(book as ibook);
  }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
