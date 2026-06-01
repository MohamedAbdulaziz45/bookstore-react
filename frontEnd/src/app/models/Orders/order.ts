import { Payment } from "../Payments/payment";
import { OrderItem } from "./order-item";
import { OrderStatus } from "./order-status";

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
  orderDate: string; // ISO
  totalAmount: number;
  status: OrderStatus;
  stripeSessionId?: string | null;

  shippingAddress: ShippingAddressDto;

  customerId: number;
  orderItems: OrderItem[];
  payment?: Payment | null;
}
