export interface ReviewResponse {
  reviewId: number;
  displayName: string;
  reviewText: string;
  rating: number;
  bookId: number;
  reviewDate: Date;
  userId: string;
}
