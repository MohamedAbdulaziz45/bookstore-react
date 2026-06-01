import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Review } from "../../models/Review/review";
import { environment } from "../../../environments/environment";
import { ReviewResponse } from "../../models/Review/review-response";
import { MyReview } from "../../models/Review/my-review";
import { AdminReview } from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiReviewService {
  constructor(private httpClient: HttpClient) {}

  addReview(bookId: number, review: Review) {
    return this.httpClient.post(
      `${environment.baseUrl}/books/${bookId}/reviews`,
      review,
    );
  }

  getAllReviewByBookId(bookId: number): Observable<ReviewResponse[]> {
    return this.httpClient.get<ReviewResponse[]>(
      `${environment.baseUrl}/books/${bookId}/reviews`,
    );
  }
  getMyReviews(): Observable<MyReview[]> {
    return this.httpClient.get<MyReview[]>(`${environment.baseUrl}/reviews/me`);
  }

  getAllReviews(): Observable<AdminReview[]> {
    return this.httpClient.get<AdminReview[]>(`${environment.baseUrl}/reviews`);
  }

  getMyReviewForBook(bookId: number): Observable<MyReview | null> {
    return this.httpClient.get<MyReview | null>(
      `${environment.baseUrl}/books/${bookId}/reviews/me`,
    );
  }

  updateReview(reviewId: number, review: Review): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.baseUrl}/reviews/${reviewId}`,
      review,
    );
  }

  deleteReveiw(reviewId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.baseUrl}/reviews/${reviewId}`,
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.deleteReveiw(reviewId);
  }
}
