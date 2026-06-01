import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiReviewService } from "../../services/reviews/api-review.service";
import { ApiUserService } from "../../services/users/api-user.service";
import { ReviewResponse } from "../../models/Review/review-response";
@Component({
  selector: "app-book-reviews",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./book-reviews.component.html",
  styleUrl: "./book-reviews.component.scss",
})
export class BookReviewsComponent implements OnInit {
  bookId = input.required<number>();
  reviewAdded = output<void>();
  private reviewService = inject(ApiReviewService);
  private authService = inject(ApiUserService);

  reviews = signal<ReviewResponse[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  isLoggedIn = this.authService.isLoggedIn;
  currentUserId = this.authService.currentUserId;
  // form fields
  newRating = signal(0);
  newReviewText = signal("");
  hoveredStar = signal(0);

  ngOnInit() {
    this.loadReviews();
  }

  deleteReview(reviewId: number) {
    this.reviewService.deleteReveiw(reviewId).subscribe({
      next: () => {
        this.loadReviews();
        this.reviewAdded.emit(); // reload book stats too
      },
    });
  }
  loadReviews() {
    this.isLoading.set(true);
    this.reviewService.getAllReviewByBookId(this.bookId()).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  submitReview() {
    if (!this.newRating() || !this.newReviewText().trim()) return;

    this.isSubmitting.set(true);
    this.reviewService
      .addReview(this.bookId(), {
        bookId: this.bookId(),
        rating: this.newRating(),
        reviewText: this.newReviewText(),
      })
      .subscribe({
        next: () => {
          this.newRating.set(0);
          this.newReviewText.set("");
          this.isSubmitting.set(false);
          this.loadReviews();
          this.reviewAdded.emit(); // ← notify parent
        },
        error: () => this.isSubmitting.set(false),
      });
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ["#e1a92b", "#cb9725", "#a67c1e", "#8a6618", "#6e5213"];
    return colors[name.charCodeAt(0) % colors.length];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  averageRating(): number {
    if (!this.reviews().length) return 0;
    return (
      this.reviews().reduce((sum, r) => sum + r.rating, 0) /
      this.reviews().length
    );
  }
}
