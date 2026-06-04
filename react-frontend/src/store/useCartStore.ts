import { create } from "zustand";
import { toast } from "sonner";
import * as cartService from "../services/cartService";
import { useAuthStore } from "../services/auth/useAuthStore";
import type { ICart } from "../types/cart.types";
import type { ISyncCartItem } from "../types/cart.types";
import type { ibook } from "../types/book.types";

const STORAGE_KEY = "guest_cart";

const emptyCart = (): ICart => ({
  cartId: 0,
  customerId: 0,
  totalItems: 0,
  subtotal: 0,
  items: [],
});

const getGuestCartItems = (): ISyncCartItem[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

const saveGuestCart = (items: ISyncCartItem[]): void =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

interface CartState {
  cart: ICart;
  isOpen: boolean;
  loadCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
  addToCart: (book: ibook) => Promise<void>;
  updateQuantity: (bookId: number, newQuantity: number) => Promise<void>;
  removeItem: (bookId: number) => Promise<void>;
  syncGuestCartAfterLogin: () => Promise<void>;
  switchToGuestCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart(),
  isOpen: false,

  loadCart: async () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
      try {
        const res = await cartService.getCart();
        set({ cart: res.data });
      } catch {
        set({ cart: emptyCart() });
      }
      return;
    }

    const items = getGuestCartItems();
    if (!items.length) {
      set({ cart: emptyCart() });
      return;
    }
    try {
      const res = await cartService.previewCart({ items });
      set({ cart: res.data });
    } catch {
      set({ cart: emptyCart() });
    }
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  closeCart: () => set({ isOpen: false }),

  clearCart: async () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
      try {
        await cartService.clearCart();
        set({ cart: emptyCart() });
      } catch {
        toast.error("Failed to clear cart");
      }
      return;
    }

    saveGuestCart([]);
    set({ cart: emptyCart() });
  },

  addToCart: async (book: ibook) => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
      try {
        await cartService.addOrUpdateCartItem(book.id, 1);
        const res = await cartService.getCart();
        set({ cart: res.data, isOpen: true });
        toast.success(`Added ${book.title} to cart`);
      } catch {
        toast.error("Failed to add item to cart");
      }
      return;
    }

    const items = getGuestCartItems();
    const existing = items.find((i) => i.bookId === book.id);
    if (existing) existing.quantity += 1;
    else items.push({ bookId: book.id, quantity: 1 });
    saveGuestCart(items);

    try {
      const res = await cartService.previewCart({ items });
      set({ cart: res.data, isOpen: true });
    } catch {
      set({ isOpen: true });
    }
    toast.success(`Added ${book.title} to cart`);
  },

  updateQuantity: async (bookId: number, newQuantity: number) => {
    const { cart } = get();
    const current = cart.items.find((i) => i.bookId === bookId);
    if (!current) return;

    if (newQuantity <= 0) {
      await get().removeItem(bookId);
      return;
    }

    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
      const quantityChange = newQuantity - current.quantity;
      if (quantityChange === 0) return;
      try {
        await cartService.addOrUpdateCartItem(bookId, quantityChange);
        const res = await cartService.getCart();
        set({ cart: res.data });
      } catch {
        toast.error("Failed to update quantity");
      }
      return;
    }

    const items = getGuestCartItems().map((i) =>
      i.bookId === bookId ? { ...i, quantity: newQuantity } : i,
    );
    saveGuestCart(items);
    try {
      const res = await cartService.previewCart({ items });
      set({ cart: res.data });
    } catch {
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (bookId: number) => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
      try {
        const res = await cartService.removeItem(bookId);
        set({ cart: res.data });
      } catch {
        toast.error("Failed to remove item");
      }
      return;
    }

    const items = getGuestCartItems().filter((i) => i.bookId !== bookId);
    saveGuestCart(items);

    if (!items.length) {
      set({ cart: emptyCart() });
      return;
    }
    try {
      const res = await cartService.previewCart({ items });
      set({ cart: res.data });
    } catch {
      toast.error("Failed to remove item");
    }
  },

  syncGuestCartAfterLogin: async () => {
    const guestItems = getGuestCartItems();

    if (!guestItems.length) {
      await get().loadCart();
      return;
    }

    try {
      const res = await cartService.syncCart({ items: guestItems });
      set({ cart: res.data });
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Guest cart synced with your account");
    } catch {
      toast.error("Failed to sync cart, your guest cart is preserved");
    }
  },

  switchToGuestCart: () => {
    const { cart } = get();
    const guestItems = cart.items.map((i) => ({
      bookId: i.bookId,
      quantity: i.quantity,
    }));
    saveGuestCart(guestItems);
    toast.success("Switched to guest cart");
  },
}));

// selectors
export const selectCartItems = (state: CartState) => state.cart.items;
export const selectTotalItems = (state: CartState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectTotalPrice = (state: CartState) => state.cart.subtotal ?? 0;
