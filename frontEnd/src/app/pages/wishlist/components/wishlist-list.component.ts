import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Book } from "../../../models/book.model";

@Component({
  selector: "app-wishlist-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
      @for (book of books; track book.id) {
        <div class="col">
          <div class="book-card h-100">
            <a [routerLink]="['/book', book.id, toSlug(book.title)]" class="d-block text-decoration-none book-cover mb-3">
              <img [src]="book.image" [alt]="book.title" loading="lazy" />
            </a>

            <a [routerLink]="['/book', book.id, toSlug(book.title)]" class="text-decoration-none">
              <p class="book-title mb-1">{{ book.title }}</p>
            </a>

            <small class="text-brand-gray d-block mb-2">{{ book.author }}</small>

            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="book-price">\${{ book.price.toFixed(2) }}</span>
              <button
                class="btn btn-link btn-sm p-0 fw-semibold text-gold text-decoration-none"
                (click)="moveToCart.emit(book)"
              >
                Move to cart
              </button>
            </div>

            <button
              class="btn btn-link btn-sm p-0 text-danger text-decoration-none"
              (click)="remove.emit(book.id)"
            >
              Remove
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .book-cover img {
        width: 100%;
        aspect-ratio: 4 / 5;
        object-fit: cover;
        border-radius: 14px;
      }
    `,
  ],
})
export class WishlistListComponent {
  @Input() books: Book[] = [];
  @Output() moveToCart = new EventEmitter<Book>();
  @Output() remove = new EventEmitter<string>();

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
