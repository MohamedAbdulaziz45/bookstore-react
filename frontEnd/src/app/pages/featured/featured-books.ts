import { Component, inject, OnInit, signal } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { BookGridComponent } from "../../components/book-grid/book-grid.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { BooksService } from "../../services/books.service";
import { Book } from "../../models/book.model";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { ApiBookService } from "../../services/books/api-book.service";

@Component({
  selector: "app-best-seller",
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    BookGridComponent,
    NewsletterSectionComponent,
    CartSidebarComponent,
  ],
  template: `
    <app-cart-sidebar></app-cart-sidebar>
    <app-header></app-header>
    <app-page-banner
      title="Featured Books"
      subtitle="Our most loved books — the ones readers recommend again and again."
    ></app-page-banner>
    @if (isFallback()) {
      <div class="container mt-3">
        <div
          class="alert alert-light border rounded-4 px-4 py-3 text-muted"
          style="font-size:.88rem"
        >
          <i class="bi bi-info-circle me-1"></i> No featured books yet — showing
          our latest titles instead.
        </div>
      </div>
    }
    <app-book-grid
      [books]="books()"
      [showViewMore]="false"
      [columns]="4"
    ></app-book-grid>
    <app-newsletter-section></app-newsletter-section>
    <app-footer></app-footer>
  `,
})
export class FeaturedComponent implements OnInit {
  private apiBookService = inject(ApiBookService);

  books = signal<IBookSummary[]>([]);
  isFallback = signal(false);

  ngOnInit(): void {
    this.apiBookService.getFeatured(12, 1).subscribe({
      next: (result) => {
        this.books.set(result.items);
        this.isFallback.set(result.meta ?? false);
      },
      error: (err) => {
        console.error("Failed to fetch featured books.", err);
        
      },
    });
  }
}
