import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { WishlistSummaryComponent } from "./components/wishlist-summary.component";
import { WishlistListComponent } from "./components/wishlist-list.component";
import { BooksService } from "../../services/books.service";
import { Book } from "../../models/book.model";
import { CartService } from "../../services/cart.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-wishlist",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    WishlistSummaryComponent,
    WishlistListComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Wishlist"
      subtitle="A proper storefront page for saved books, not just a dashboard panel."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <app-wishlist-summary [stats]="stats"></app-wishlist-summary>

        <div class="mt-4">
          <app-wishlist-list
            [books]="wishlistBooks"
            (moveToCart)="addToCart($event)"
            (remove)="removeBook($event)"
          ></app-wishlist-list>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class WishlistComponent {
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  wishlistBooks: Book[] = this.booksService.getAll().slice(0, 4);

  get stats() {
    return [
      { label: "Saved titles", value: String(this.wishlistBooks.length) },
      {
        label: "Estimated total",
        value: `$${this.wishlistBooks.reduce((sum, book) => sum + book.price, 0).toFixed(2)}`,
      },
      { label: "Ready to gift", value: String(this.wishlistBooks.filter((book) => book.price < 20).length) },
    ];
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book as any);
  }

  removeBook(bookId: string) {
    const book = this.wishlistBooks.find((item) => item.id === bookId);
    this.wishlistBooks = this.wishlistBooks.filter((item) => item.id !== bookId);
    if (book) {
      this.toastService.show(`${book.title} removed from wishlist`, "info");
    }
  }
}
