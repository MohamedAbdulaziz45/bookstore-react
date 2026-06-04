export interface ICart {
  cartId: number;
  customerId: number;
  totalItems: number;
  subtotal: number;
  items: ICartItem[];
}
export interface ICartItem {
  cartItemId: number;
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  quantityInStock: number;
  imageUrl?: string | null;
  lineTotal: number;
}
export interface ISyncCartRequest {
  items: ISyncCartItem[];
}
export interface ISyncCartItem {
  bookId: number;
  quantity: number;
}
