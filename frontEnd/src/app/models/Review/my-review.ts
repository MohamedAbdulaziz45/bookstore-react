export interface MyReview {
  reviewId: number;
  reviewText: string;
  rating: number;
  reviewDate: string;
  bookId: number;
  bookTitle?: string;
  customerId: number;
}
