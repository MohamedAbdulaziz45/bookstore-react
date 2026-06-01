import { Component, input, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Book } from "../../models/book.model";
import { CartService } from "../../services/cart.service";
import { ibook } from "../../models/Book/ibook";
import { IBookSummary } from "../../models/Book/i-book-summary";

@Component({
  selector: "app-book-grid",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./book-grid.component.html",
})
export class BookGridComponent {
  @Input() books: IBookSummary[] | ibook[] | Book[] = [];
  @Input() title?: string;
  @Input() description?: string;
  @Input() isFallBack? = false;
  @Input() showViewMore = true;
  @Input() columns: 2 | 3 | 4 = 4;

  constructor(public cartService: CartService) {}

  get rowColsClass(): string {
    return this.columns === 2
      ? "row-cols-1 row-cols-sm-2"
      : this.columns === 3
        ? "row-cols-2 row-cols-md-3"
        : "row-cols-2 row-cols-md-3 row-cols-lg-4";
  }

  addToCart(book: any, e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.cartService.addToCart(book);
  }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
