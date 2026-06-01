import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminReview } from "../../../models/admin/admin.models";
import { ApiReviewService } from "../../../services/reviews/api-review.service";

@Component({
  selector: "app-admin-reviews-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-reviews-panel.component.html",
  styleUrl: "./admin-reviews-panel.component.scss",
})
export class AdminReviewsPanelComponent implements OnInit {
  reviews: AdminReview[] = [];
  filteredReviews: AdminReview[] = [];
  loading = false;
  error = "";
  search = "";
  selectedReview: AdminReview | null = null;

  constructor(private reviewService: ApiReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = "";
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load reviews.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredReviews = term
      ? this.reviews.filter(
          (review) =>
            review.displayName.toLowerCase().includes(term) ||
            review.reviewText.toLowerCase().includes(term) ||
            String(review.bookId).includes(term),
        )
      : [...this.reviews];
  }

  viewReview(review: AdminReview): void {
    this.selectedReview = review;
  }

  closeView(): void {
    this.selectedReview = null;
  }

  deleteReview(review: AdminReview): void {
    if (!confirm(`Delete review by "${review.displayName}"?`)) return;

    this.loading = true;
    this.reviewService.deleteReview(review.reviewId).subscribe({
      next: () => {
        this.selectedReview = null;
        this.loadReviews();
      },
      error: () => {
        this.error = "Could not delete review.";
        this.loading = false;
      },
    });
  }

  getStarsArray(count: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  initials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }
}
