import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { BookGridComponent } from "../../components/book-grid/book-grid.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartService } from "../../services/cart.service";
import { BooksService } from "../../services/books.service";
import { Book } from "../../models/book.model";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    CartSidebarComponent,
    BookGridComponent,
    NewsletterSectionComponent,
  ],
  templateUrl: "./cart.component.html",
})
export class CartComponent {
  couponCode = "";
  couponApplied = signal(false);
  couponError = signal(false);
  suggestedBooks: Book[];

  // readonly COUPON      = 'BOOKWORM10';
  // readonly DISCOUNT_PC = 10;

  // discount   = computed(() => this.couponApplied()
  //   ? this.cartService.totalPrice() * this.DISCOUNT_PC / 100 : 0);
  orderTotal = computed(() => this.cartService.totalPrice());

  trustBadges = [
    { icon: "bi-shield-fill-check", label: "Secure Checkout" },
    { icon: "bi-truck", label: "Free Shipping" },
    { icon: "bi-arrow-return-left", label: "Easy Returns" },
  ];

  constructor(
    public cartService: CartService,
    booksService: BooksService,
  ) {
    this.suggestedBooks = booksService.getAll().slice(0, 4);
  }

  // applyCoupon() {
  //   if (this.couponCode.trim().toUpperCase() === this.COUPON) {
  //     this.couponApplied.set(true); this.couponError.set(false);
  //   } else {
  //     this.couponError.set(true);
  //     setTimeout(() => this.couponError.set(false), 3000);
  //   }
  // }

  // removeCoupon() {
  //   this.couponApplied.set(false);
  //   this.couponCode = "";
  // }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  updateQty(bookId: number, qty: number) {
    this.cartService.updateQuantity(bookId, qty);
  }
  clamp(value: number, max: number): number {
    return Math.min(value, max);
  }
}
