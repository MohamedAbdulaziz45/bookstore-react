export interface Payment {
  paymentId: number;
  amount: number;
  paymentMethod: string;
  transactionDate: string; // ISO
  stripePaymentIntentId?: string | null;
  currency: string;
  orderId: number;
}
