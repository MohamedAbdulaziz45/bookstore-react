export interface MyReview {
  reviewId: number;
  reviewText: string;
  rating: number;
  reviewDate: string;
  bookId: number;
  bookTitle?: string;
  customerId: number;
}
export interface ReviewResponse {
  reviewId: number;
  displayName: string;
  reviewText: string;
  rating: number;
  bookId: number;
  reviewDate: Date;
  userId: string;
}
export interface Review {
  reviewText: string;
  rating: number;
  bookId: number;
}
