import { Injectable, signal, computed, inject } from "@angular/core";
import { Book, CartItem } from "../models/book.model";
import { ToastService } from "./toast.service";
import { ibook } from "../models/Book/ibook";
import { ICart } from "../models/Cart/icart";
import { ApiCartService } from "./carts/api-cart.service";
import { ApiUserService } from "./users/api-user.service";
import { ISyncCartItem } from "../models/Cart/isync-cart-request";
import { tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly storageKey = "guest_cart";
  cart = signal<ICart>(this.emptyCart());
  isOpen = signal(false);
  cartItems = computed(() => this.cart().items);
  private toastService = inject(ToastService);

  totalItems = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.quantity, 0),
  );

  totalPrice = computed(() => this.cart().subtotal ?? 0);
  constructor(
    private apiCartService: ApiCartService,
    private apiUserService: ApiUserService,
  ) {
    this.loadCart();
  }

  initializeCart() {
    this.loadCart();
  }
  loadCart() {
    if (this.apiUserService.isLoggedIn()) {
      this.refreshServerCart();
      return;
    }

    this.loadGuestCart();
  }

  toggleCart(): void {
    this.isOpen.update((v) => !v);
  }
  closeCart(): void {
    this.isOpen.set(false);
  }
  clearCart(): void {
    if (this.apiUserService.isLoggedIn()) {
      this.apiCartService.clearCart().subscribe({
        next: () => this.cart.set(this.emptyCart()),
      });
      return;
    }

    this.saveGuestCart([]);
    this.cart.set(this.emptyCart());
  }

  private refreshServerCart(): void {
    this.apiCartService.getCart().subscribe({
      next: (cart) => this.cart.set(cart),
      error: () => this.cart.set(this.emptyCart()),
    });
  }

  private refreshGuestPreview(): void {
    const items = this.getGuestCartItems();

    if (!items.length) {
      this.cart.set(this.emptyCart());
      return;
    }

    this.apiCartService.previewCart({ items }).subscribe({
      next: (cart) => this.cart.set(cart),
    });
  }

  addToCart(book: ibook): void {
    if (this.apiUserService.isLoggedIn()) {
      this.apiCartService.addOrUpdateCartItem(book.id, 1).subscribe(() => {
        this.refreshServerCart();
        this.toastService.show(`Added ${book.title} to cart`);
        this.isOpen.set(true);
      });
      return;
    }

    const items = this.getGuestCartItems();
    const existing = items.find((i) => i.bookId === book.id);
    if (existing) existing.quantity += 1;
    else items.push({ bookId: book.id, quantity: 1 });

    this.saveGuestCart(items);
    this.refreshGuestPreview();
    this.toastService.show(`added ${book.title} to cart`);
    this.isOpen.set(true);
  }

  updateQuantity(bookId: number, newQuantity: number): void {
    const current = this.cart()?.items.find((i) => i.bookId === bookId);
    if (!current) return;

    if (newQuantity <= 0) {
      this.removeItem(bookId);
      return;
    }
    if (this.apiUserService.isLoggedIn()) {
      const quantityChange = newQuantity - current.quantity;
      if (quantityChange === 0) return;

      this.apiCartService
        .addOrUpdateCartItem(bookId, quantityChange)
        .subscribe(() => {
          this.refreshServerCart();
        });
      return;
    }

    this.setGuestQuantity(bookId, newQuantity);
    this.refreshGuestPreview();
  }

  removeItem(bookId: number): void {
    if (this.apiUserService.isLoggedIn()) {
      this.apiCartService.removeItem(bookId).subscribe({
        next: (cart) => this.cart.set(cart),
        error: () => this.toastService.show("Failed to remove item", "error"),
      });
      return;
    }

    this.saveGuestCart(
      this.getGuestCartItems().filter((i) => i.bookId !== bookId),
    );
    this.refreshGuestPreview();
  }

  syncGuestCartAfterLogin() {
    const guestItems = this.getGuestCartItems();

    if (!guestItems.length) {
      this.refreshServerCart();
      return;
    }

    return this.apiCartService.syncCart({ items: guestItems }).subscribe({
      next: (cart) => {
        this.cart.set(cart);
        localStorage.removeItem(this.storageKey);
        this.toastService.show("Guest cart synced with your account");
      },
      error: () => {
        this.toastService.show(
          "Failed to sync cart, your guest cart is preserved",
          "error",
        );
        // storageKey untouched — guest cart still there ✓
      },
    });
  }

  private setGuestQuantity(bookId: number, quantity: number): void {
    const original = this.getGuestCartItems().find((i) => i.bookId === bookId);
    if (!original) return;

    const items = this.getGuestCartItems().map((i) =>
      i.bookId === bookId ? { ...i, quantity } : i,
    );

    if (quantity <= 0) {
      this.saveGuestCart(items.filter((i) => i.bookId !== bookId));
      return;
    }

    this.saveGuestCart(items);
  }

  private getGuestCartItems(): ISyncCartItem[] {
    return JSON.parse(localStorage.getItem(this.storageKey) ?? "[]");
  }

  private saveGuestCart(items: ISyncCartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadGuestCart(): void {
    this.refreshGuestPreview();
  }

  private emptyCart(): ICart {
    return {
      cartId: 0,
      customerId: 0,
      totalItems: 0,
      subtotal: 0,
      items: [],
    };
  }
  switchToGuestCart() {
    const guestItems = this.cart().items.map((i) => ({
      bookId: i.bookId,
      quantity: i.quantity,
    }));
    localStorage.setItem("guest_cart", JSON.stringify(guestItems));
    this.toastService.show("Switched to guest cart");
  }
}
