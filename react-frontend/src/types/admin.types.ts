import type { IpagedResult } from "./common.types";
import type { OrderStatus } from "./orders.types";

export interface AdminCategoryRef {
  id: number;
  name: string;
}

export interface AdminBook {
  id: number;
  title: string;
  isbn: string;
  author: string;
  authorId: number;
  genres: AdminCategoryRef[];
  price: number;
  stock: number;
  publicationDate: string;
  additionalDetails?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  featuredAt?: string | null;
  isEditorsPick: boolean;
  editorsPickAt?: string | null;
}

export interface AdminBookFormValue {
  title: string;
  isbn: string;
  price: number;
  quantityInStock: number;
  publicationDate: string;
  authorId: number;
  genreIds: number[];
  additionalDetails?: string | null;
  isFeatured: boolean;
  isEditorsPick: boolean;
  image?: File | null;
}

export interface AdminAuthor {
  authorId: number;
  name: string;
  bio: string;
  image?: string | null;
  imagePublicId?: string | null;
  isFeatured: boolean;
  featuredAt?: string | null;
  booksCount?: number;
}

export interface AdminAuthorFormValue {
  name: string;
  bio: string;
  isFeatured: boolean;
  image?: File | null;
}

export interface AdminDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalBooks: number;
  recentOrders: AdminRecentOrder[];
  topSellingBooks: AdminTopSellingBook[];
  orderStatusBreakdown: Record<string, number>;
  lowStockBooks: AdminLowStockBook[];
}

export interface AdminRecentOrder {
  orderId: number;
  customer: string;
  itemsCount: number;
  amount: number;
  status: string;
  orderDate: string;
}

export interface AdminTopSellingBook {
  bookId: number;
  title: string;
  author: string;
  sold: number;
}

export interface AdminLowStockBook {
  bookId: number;
  title: string;
  author: string;
  stock: number;
}

export interface AdminCustomer {
  customerId: number;
  userId: string;
  displayName: string;
  email: string;
  phone?: string | null;
  imagePath?: string | null;
  memberSince: string;
  ordersCount: number;
  totalSpent: number;
  isDeleted: boolean;
}

export interface AdminPayment {
  paymentId: number;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  stripePaymentIntentId?: string | null;
  currency: string;
  orderId: number;
  customer?: string;
}

export type AdminOrderStatus = OrderStatus | number;

export interface AdminOrder {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: AdminOrderStatus;
  stripeSessionId?: string | null;
  customerName?: string;
  itemsCount?: number;
  customerId: number;
  orderItems?: unknown[];
  payment?: AdminPayment | null;
  shipping?: AdminShipping | null;
}

export interface AdminShipping {
  shippingId: number;
  carrierName: string;
  trackingNumber: string;
  shippingStatus: number | string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string | null;
  orderId: number;
  customer?: string;
}

export interface AdminShippingFormValue {
  carrierName: string;
  trackingNumber: string;
  shippingStatus: number;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string | null;
  orderId: number;
}

export interface AdminReview {
  reviewId: number;
  displayName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
  bookId: number;
  userId: string;
}

export type AdminBookPage = IpagedResult<AdminBook>;
export type AdminCustomerPage = IpagedResult<AdminCustomer>;
