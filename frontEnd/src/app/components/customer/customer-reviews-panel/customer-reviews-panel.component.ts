import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiReviewService } from "../../../services/reviews/api-review.service";
import { ToastService } from "../../../services/toast.service";
import { MyReview } from "../../../models/Review/my-review";

@Component({
  selector: "app-customer-reviews-panel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./customer-reviews-panel.component.html",
})
export class CustomerReviewsPanelComponent implements OnInit {
  @Output() reviewCountChange = new EventEmitter<number>();

  private reviewsService = inject(ApiReviewService);
  private toastService = inject(ToastService);

  myReviews: MyReview[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.reviewsService.getMyReviews().subscribe({
      next: (reviews) => {
        this.myReviews = reviews ?? [];
        this.reviewCountChange.emit(this.myReviews.length);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show("Failed to load your reviews", "error");
      },
    });
  }

  editReview(review: MyReview): void {
    const nextText = prompt("Edit your review text", review.reviewText);
    if (nextText === null) return;

    const ratingStr = prompt("Rating (1-5)", String(review.rating));
    if (ratingStr === null) return;

    const nextRating = Number(ratingStr);
    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      this.toastService.show("Rating must be an integer from 1 to 5", "error");
      return;
    }

    this.reviewsService
      .updateReview(review.reviewId, {
        reviewText: nextText.trim(),
        rating: nextRating,
        bookId: review.bookId,
      })
      .subscribe({
        next: () => {
          this.toastService.show("Review updated", "success");
          this.load();
        },
        error: () => this.toastService.show("Failed to update review", "error"),
      });
  }

  deleteReview(reviewId: number): void {
    if (!confirm("Delete this review?")) return;

    this.reviewsService.deleteReveiw(reviewId).subscribe({
      next: () => {
        this.toastService.show("Review deleted", "success");
        this.load();
      },
      error: () => this.toastService.show("Failed to delete review", "error"),
    });
  }

  getStarsArray(count: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }
}
