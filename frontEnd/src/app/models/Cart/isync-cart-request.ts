export interface ISyncCartRequest {
  items: ISyncCartItem[];
}
export interface ISyncCartItem {
  bookId: number;
  quantity: number;
}
