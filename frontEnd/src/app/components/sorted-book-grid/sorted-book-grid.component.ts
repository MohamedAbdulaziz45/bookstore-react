import {
  Component,
  computed,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { ApiBookService } from "../../services/books/api-book.service";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { IBookSummary } from "../../models/Book/i-book-summary";

@Component({
  selector: "app-sorted-book-grid",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./sorted-book-grid.component.html",
  styleUrl: "./sorted-book-grid.component.scss",
})
export class SortedBookGridComponent implements OnInit {
  @Input() searchPhrase: string | undefined = undefined;
  @Input() title: string = "All Books";
  books = signal<IBookSummary[]>([]);
  totalCount = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  readonly pageSize = 4;
  sortBy = signal("");
  sortDirection = signal<"Ascending" | "Descending">("Ascending");
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

  constructor(
    private apiBookService: ApiBookService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    this.apiBookService
      .getAllBooks(
        this.searchPhrase,
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
    this.cartService.addToCart(book as any);
  }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
