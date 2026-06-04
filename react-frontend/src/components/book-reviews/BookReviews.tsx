import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllReviewsByBookId,
  addReview,
  deleteReview,
} from "../../services/reviewService";
import { useAuthStore } from "../../services/auth/useAuthStore";
import type { ReviewResponse } from "../../types/review.types";

interface BookReviewsProps {
  bookId: number;
  onReviewAdded?: () => void;
}

const AVATAR_COLORS = ["#e1a92b", "#cb9725", "#a67c1e", "#8a6618", "#6e5213"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function BookReviews({
  bookId,
  onReviewAdded,
}: BookReviewsProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currentUserId = useAuthStore((s) => s.currentUserId);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllReviewsByBookId(bookId);
      setReviews(res.data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      void loadReviews();
      onReviewAdded?.();
    } catch {
      // silently fail
    }
  };

  const submitReview = async () => {
    if (!newRating || !newReviewText.trim()) return;
    setIsSubmitting(true);
    try {
      await addReview(bookId, {
        bookId,
        rating: newRating,
        reviewText: newReviewText,
      });
      setNewRating(0);
      setNewReviewText("");
      void loadReviews();
      onReviewAdded?.();
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold" role="status" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-5">
          <i
            className="bi bi-chat-square-text fs-1 text-brand-gray mb-3 d-block"
            style={{ opacity: 0.3 }}
          />
          <h5 className="fw-bold mb-2">No reviews yet</h5>
          <p className="text-brand-gray">Be the first to leave a review</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 bg-warm border border-brand">
            <div className="text-center">
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                {averageRating.toFixed(1)}
              </div>
              <div className="d-flex gap-1 justify-content-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${star <= averageRating ? "bi-star-fill" : "bi-star"}`}
                    style={{ color: "var(--gold)", fontSize: "0.8rem" }}
                  />
                ))}
              </div>
              <div className="text-brand-gray" style={{ fontSize: "0.78rem" }}>
                {reviews.length} reviews
              </div>
            </div>
          </div>

          {/* Review Cards */}
          {reviews.map((review) => (
            <div
              key={String(review.reviewDate)}
              className="review-card mb-3"
              style={{ position: "relative" }}
            >
              <div className="d-flex align-items-start gap-3">
                {/* Avatar */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 42,
                    height: 42,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    background: getAvatarColor(review.displayName),
                  }}
                >
                  {getInitials(review.displayName)}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <span className="fw-bold" style={{ fontSize: "0.95rem" }}>
                        {review.displayName}
                      </span>
                      <div className="d-flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bi ${star <= review.rating ? "bi-star-fill" : "bi-star"}`}
                            style={{
                              color: "var(--gold)",
                              fontSize: "0.78rem",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="text-brand-gray"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {formatDate(review.reviewDate)}
                      </span>
                      {isLoggedIn && review.userId === currentUserId && (
                        <button
                          onClick={() =>
                            void handleDeleteReview(review.reviewId)
                          }
                          title="Delete review"
                          style={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            background: "none",
                            border: "1px solid #dc3545",
                            color: "#dc3545",
                            borderRadius: 6,
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dc3545";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#dc3545";
                          }}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    className="mt-2 mb-0 text-brand-gray lh-lg"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {review.reviewText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Add Review Form */}
      <div className="mt-4 pt-4 border-top border-brand">
        {!isLoggedIn ? (
          <div className="text-center py-4 rounded-3 bg-warm border border-brand">
            <i className="bi bi-lock fs-4 text-gold d-block mb-2" />
            <p className="mb-0 text-brand-gray">
              Please <strong>log in</strong> to leave a review
            </p>
          </div>
        ) : (
          <>
            <h6
              className="fw-bold mb-3"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Write a Review
            </h6>

            {/* Star Rating Picker */}
            <div className="mb-3">
              <label className="form-label-sm d-block mb-2">Your Rating</label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${star <= (hoveredStar || newRating) ? "bi-star-fill" : "bi-star"}`}
                    style={{
                      fontSize: "1.6rem",
                      cursor: "pointer",
                      transition: "color 0.15s",
                      color:
                        star <= (hoveredStar || newRating)
                          ? "var(--gold)"
                          : "var(--brand-muted)",
                    }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setNewRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-3">
              <label className="form-label-sm d-block mb-2">Your Review</label>
              <textarea
                className="form-control-custom w-100"
                rows={4}
                placeholder="Share your thoughts about this book..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
              />
            </div>

            <button
              className="btn-gold-cust"
              disabled={isSubmitting || !newRating || !newReviewText.trim()}
              onClick={() => void submitReview()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2" /> Submit Review
                </>
              )}
            </button>
          </>
        )}
      </div>
    </>
  );
}
