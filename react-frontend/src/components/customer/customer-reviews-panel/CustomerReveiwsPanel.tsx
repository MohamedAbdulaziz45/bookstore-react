import { useState, useEffect, useCallback } from "react";
import * as reviewService from "../../../services/reviewService";
import { showToast } from "../../../utils/toast";
import type { MyReview } from "../../../types/review.types";

interface CustomerReviewsPanelProps {
  onReviewCountChange?: (count: number) => void;
}

const getStarsArray = (count: number): boolean[] =>
  Array.from({ length: 5 }, (_, i) => i < count);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function CustomerReviewsPanel({
  onReviewCountChange,
}: CustomerReviewsPanelProps) {
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    reviewService
      .getMyReviews()
      .then((res) => {
        const reviews = res.data ?? [];
        setMyReviews(reviews);
        onReviewCountChange?.(reviews.length);
      })
      .catch(() => showToast("Failed to load your reviews", "error"))
      .finally(() => setIsLoading(false));
  }, [onReviewCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const editReview = (review: MyReview) => {
    const nextText = prompt("Edit your review text", review.reviewText);
    if (nextText === null) return;

    const ratingStr = prompt("Rating (1-5)", String(review.rating));
    if (ratingStr === null) return;

    const nextRating = Number(ratingStr);
    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      showToast("Rating must be an integer from 1 to 5", "error");
      return;
    }

    reviewService
      .updateReview(review.reviewId, {
        reviewText: nextText.trim(),
        rating: nextRating,
        bookId: review.bookId,
      })
      .then(() => {
        showToast("Review updated", "success");
        load();
      })
      .catch(() => showToast("Failed to update review", "error"));
  };

  const deleteReview = (reviewId: number) => {
    if (!confirm("Delete this review?")) return;

    reviewService
      .deleteReview(reviewId)
      .then(() => {
        showToast("Review deleted", "success");
        load();
      })
      .catch(() => showToast("Failed to delete review", "error"));
  };

  return (
    <>
      <div className="section-heading">My Reviews</div>

      {/* Loading */}
      {isLoading && (
        <div className="card-box text-center py-4">
          <div className="spinner-border text-gold" role="status" />
          <div className="text-muted mt-3">Loading your reviews...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myReviews.length === 0 && (
        <div className="card-box text-center py-4">
          <div style={{ fontWeight: 800 }}>No reviews yet</div>
          <div className="text-muted mt-1">
            Your submitted reviews will appear here.
          </div>
        </div>
      )}

      {/* Review Cards */}
      {myReviews.map((rev) => (
        <div className="review-card" key={rev.reviewId}>
          <div className="d-flex align-items-start justify-content-between">
            <div className="d-flex gap-3">
              <div
                className="book-cover-sm"
                style={{ flexShrink: 0, background: "var(--brand-warm)" }}
              >
                <i className="bi bi-book" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                  {rev.bookTitle || `Book #${rev.bookId}`}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--brand-gray)",
                    marginBottom: 5,
                  }}
                >
                  Your review
                </div>
                <div className="stars">
                  {getStarsArray(rev.rating).map((filled, i) => (
                    <i
                      key={i}
                      className={`bi ${filled ? "bi-star-fill" : "bi-star"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--brand-gray)" }}>
              {formatDate(rev.reviewDate)}
            </div>
          </div>

          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--brand-gray)",
              margin: "12px 0 0",
              lineHeight: 1.6,
            }}
          >
            {rev.reviewText}
          </p>

          <div className="d-flex gap-2 mt-3">
            <button
              className="track-btn"
              style={{ fontSize: "0.78rem" }}
              onClick={() => editReview(rev)}
            >
              <i className="bi bi-pencil" /> Edit
            </button>
            <button
              className="track-btn"
              style={{
                borderColor: "#dc3545",
                color: "#dc3545",
                fontSize: "0.78rem",
              }}
              onClick={() => deleteReview(rev.reviewId)}
            >
              <i className="bi bi-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
