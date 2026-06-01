import { Component, computed, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BooksService } from "../../services/books.service";
import { CartService } from "../../services/cart.service";
import { Book } from "../../models/book.model";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { BookGridComponent } from "../../components/book-grid/book-grid.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { ibook } from "../../models/Book/ibook";
import { ApiBookService } from "../../services/books/api-book.service";
import { BookReviewsComponent } from "../../components/book-reviews/book-reviews.component";
import { IBookSummary } from "../../models/Book/i-book-summary";
@Component({
  selector: "app-book-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    BookGridComponent,
    NewsletterSectionComponent,
    CartSidebarComponent,
    BookReviewsComponent,
  ],
  templateUrl: "./book-detail.component.html",
})
export class BookDetailComponent implements OnInit {
  book = signal<ibook | null>(null);
  related = signal<IBookSummary[]>([]);
  quantity = signal(1);
  activeTab = signal<"desc" | "reviews">("desc");
  justAdded = signal(false);
  isLoading = signal(true);
  categoryNames = computed(
    () =>
      this.book()
        ?.categories.map((category) => category.name)
        .filter(Boolean)
        .join(", ") ?? "",
  );

  constructor(
    private route: ActivatedRoute,
    private apiBookService: ApiBookService,
    public cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.isLoading.set(true);
      this.quantity.set(1);
      this.justAdded.set(false);
      this.activeTab.set("desc");
      window.scrollTo(0, 0);

      this.loadBook(+p["id"]);
    });
  }

  private loadRelated(book: ibook) {
    this.apiBookService
      .getAllBooks(book.author, 4, 1, "Rating", "Descending")
      .subscribe({
        next: (result) => {
          this.related.set(result.items);
        },
        error: () => this.related.set([]),
      });
  }

  loadBook(id: number) {
    this.apiBookService.getBookById(id).subscribe({
      next: (book) => {
        this.book.set(book);
        this.isLoading.set(false);
        this.loadRelated(book);
      },
      error: () => {
        this.book.set(null);
        this.isLoading.set(false);
      },
    });
  }
  dec() {
    if (this.quantity() > 1) this.quantity.update((q) => q - 1);
  }
  inc() {
    this.quantity.update((q) => q + 1);
  }

  addToCart() {
    const b = this.book();
    if (!b) return;
    for (let i = 0; i < this.quantity(); i++) this.cartService.addToCart(b);

    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 2500);
  }

  toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
}
