import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllReviews, deleteReview } from "../../../services/reviewService";
import type { AdminReview } from "../../../types/admin.types";

const getStarsArray = (count: number) =>
  Array.from({ length: 5 }, (_, i) => i < count);

const initials = (name: string) => name.slice(0, 2).toUpperCase();

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null,
  );

  const filteredReviews = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? reviews.filter(
          (r) =>
            r.displayName.toLowerCase().includes(term) ||
            r.reviewText.toLowerCase().includes(term) ||
            String(r.bookId).includes(term),
        )
      : [...reviews];
  }, [reviews, search]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllReviews();
      setReviews(res.data);
    } catch {
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleDelete = async (review: AdminReview) => {
    if (!confirm(`Delete review by "${review.displayName}"?`)) return;
    setLoading(true);
    try {
      await deleteReview(review.reviewId);
      setSelectedReview(null);
      await loadReviews();
    } catch {
      setError("Could not delete review.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Reviews Management</div>
        <div className="search-wrap">
          <i className="bi bi-search" />
          <input
            className="search-input"
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="data-card">
        {/* States */}
        {loading && <div className="admin-state">Loading reviews...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredReviews.length === 0 && (
          <div className="admin-state">No reviews found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredReviews.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Book</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => (
                <tr key={rev.reviewId}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-sm" style={{ fontSize: ".7rem" }}>
                        {initials(rev.displayName)}
                      </div>
                      {rev.displayName}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: ".87rem" }}>
                    #BOOK-{rev.bookId}
                  </td>
                  <td>
                    <div className="stars">
                      {getStarsArray(rev.rating).map((filled, idx) => (
                        <i
                          key={idx}
                          className={`bi ${filled ? "bi-star-fill" : "bi-star"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td
                    style={{
                      color: "var(--brand-gray)",
                      fontSize: ".83rem",
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rev.reviewText}
                  </td>
                  <td style={{ color: "var(--brand-gray)" }}>
                    {formatDate(rev.reviewDate)}
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="View review"
                      onClick={() => setSelectedReview(rev)}
                    >
                      <i className="bi bi-eye" />
                    </button>
                    <button
                      className="action-btn del"
                      type="button"
                      title="Delete review"
                      onClick={() => void handleDelete(rev)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <>
          <div
            className="admin-modal-backdrop"
            onClick={() => setSelectedReview(null)}
          />
          <div className="admin-modal">
            <div className="drawer-header">
              <div className="dash-section-title">
                Review #{selectedReview.reviewId}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={() => setSelectedReview(null)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="drawer-body">
              <div className="detail-row">
                <span>Customer</span>
                <strong>{selectedReview.displayName}</strong>
              </div>
              <div className="detail-row">
                <span>Book</span>
                <strong>#BOOK-{selectedReview.bookId}</strong>
              </div>
              <div className="detail-row">
                <span>Rating</span>
                <strong>{selectedReview.rating}/5</strong>
              </div>
              <p className="mt-3">{selectedReview.reviewText}</p>
              <button
                className="btn-outline-cust mt-3"
                type="button"
                onClick={() => void handleDelete(selectedReview)}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
