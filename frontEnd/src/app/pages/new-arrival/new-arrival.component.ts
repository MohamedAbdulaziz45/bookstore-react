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
  selector: "app-new-arrival",
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
      title="New Arrivals"
      subtitle="The freshest additions to our collection — just arrived."
    ></app-page-banner>
    <app-book-grid
      [books]="books()"
      [showViewMore]="false"
      [columns]="4"
    ></app-book-grid>
    <app-newsletter-section></app-newsletter-section>
    <app-footer></app-footer>
  `,
})
export class NewArrivalComponent implements OnInit {
  private apiBookService = inject(ApiBookService);
  books = signal<IBookSummary[]>([]);
  ngOnInit(): void {
    this.apiBookService
      .getAllBooks(undefined, 12, 1, "PublicationDate", "Descending")
      .subscribe({
        next: (result) => {
          this.books.set(result.items);
        },
        error: (err) => {
          console.error("Failed to fetch new arrivals", err);
        },
      });
  }
}
