import { useState } from "react";
import { subscribe, unsubscribe } from "../../services/newsletterService";

export default function NewsletterSection() {
  const [subEmail, setSubEmail] = useState("");
  const [subOk, setSubOk] = useState(false);
  const [subError, setSubError] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const [unsubEmail, setUnsubEmail] = useState("");
  const [unsubOk, setUnsubOk] = useState(false);
  const [unsubError, setUnsubError] = useState("");
  const [unsubLoading, setUnsubLoading] = useState(false);

  const onSubscribe = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!subEmail) return;

    setSubOk(false);
    setSubError("");
    setSubLoading(true);

    try {
      await subscribe(subEmail);
      setSubOk(true);
      setSubEmail("");
      setTimeout(() => setSubOk(false), 4000);
    } catch {
      setSubError("Something went wrong. Please try again.");
      setTimeout(() => setSubError(""), 4000);
    } finally {
      setSubLoading(false);
    }
  };

  const onUnsubscribe = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!unsubEmail) return;

    setUnsubOk(false);
    setUnsubError("");
    setUnsubLoading(true);

    try {
      await unsubscribe(unsubEmail);
      setUnsubOk(true);
      setUnsubEmail("");
      setTimeout(() => setUnsubOk(false), 4000);
    } catch {
      setUnsubError("Something went wrong. Please try again.");
      setTimeout(() => setUnsubError(""), 4000);
    } finally {
      setUnsubLoading(false);
    }
  };

  return (
    <section className="newsletter-section py-5">
      <div className="container py-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h2
              className="fw-bold mb-3"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
            >
              Join Book Lovers Community
              <br />
              and Get Latest Updates
            </h2>
            <p className="mb-4" style={{ color: "rgba(255,255,255,.6)" }}>
              Subscribe to receive news about new arrivals, author spotlights
              and exclusive deals.
            </p>

            {/* Subscribe form */}
            <form
              onSubmit={onSubscribe}
              className="d-flex gap-2 mb-3"
              style={{ maxWidth: 460 }}
            >
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                className="nl-input flex-grow-1"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="btn btn-gold fw-bold text-uppercase px-4"
                disabled={subLoading}
              >
                {subLoading ? "..." : "Subscribe"}
              </button>
            </form>

            {subOk && (
              <p className="text-gold fw-semibold mb-2 small">
                <i className="bi bi-check-circle-fill me-1" />
                Thank you for subscribing!
              </p>
            )}
            {subError && (
              <p className="text-danger fw-semibold mb-2 small">
                <i className="bi bi-x-circle-fill me-1" />
                {subError}
              </p>
            )}

            {/* Unsubscribe form */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,.12)",
                paddingTop: 16,
                marginTop: 8,
              }}
            >
              <p
                className="mb-2"
                style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)" }}
              >
                Want to unsubscribe? Enter your email below.
              </p>
              <form
                onSubmit={onUnsubscribe}
                className="d-flex gap-2"
                style={{ maxWidth: 460 }}
              >
                <input
                  type="email"
                  value={unsubEmail}
                  onChange={(e) => setUnsubEmail(e.target.value)}
                  required
                  className="nl-input flex-grow-1"
                  placeholder="Your email address"
                />
                <button
                  type="submit"
                  className="btn btn-outline-light fw-bold text-uppercase px-4"
                  style={{ borderRadius: 6, fontSize: ".82rem" }}
                  disabled={unsubLoading}
                >
                  {unsubLoading ? "..." : "Unsubscribe"}
                </button>
              </form>

              {unsubOk && (
                <p
                  className="fw-semibold mt-2 mb-0 small"
                  style={{ color: "rgba(255,255,255,.7)" }}
                >
                  <i className="bi bi-check-circle-fill me-1" />
                  You have been unsubscribed.
                </p>
              )}
              {unsubError && (
                <p className="text-danger fw-semibold mt-2 mb-0 small">
                  <i className="bi bi-x-circle-fill me-1" />
                  {unsubError}
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-flex justify-content-end">
            <img
              src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/subscribe-image.png"
              alt="Subscribe"
              style={{ maxHeight: 220 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
