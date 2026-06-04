import type { Payment } from "./payment.types";

export interface MyOrderSummary {
  totalOrders: number;
  totalSpent: number;
}
export interface OrderItem {
  orderItemId: number;
  quantity: number;
  price: number;
  totalItemsPrice: number;
  bookId: number;
  orderId: number;
}
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface ShippingAddressDto {
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
}
export interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  stripeSessionId?: string | null;

  shippingAddress: ShippingAddressDto;

  customerId: number;
  orderItems: OrderItem[];
  payment?: Payment | null;
}
