import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/header/Header";
import * as orderService from "../../services/orderService";
import type { Order } from "../../types/orders.types";
import Footer from "../../components/footer/Footer";

// ── component ──────────────────────────────────────────────────────────────
export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const sessionId =
      searchParams.get("session_id") || searchParams.get("sessionId") || "";

    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage("Missing Stripe session id in the URL.");
      return;
    }

    const pollOrder = (retriesLeft: number, delayMs: number) => {
      orderService
        .getBySessionId(sessionId)
        .then((res) => {
          setOrder(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          if (retriesLeft > 0) {
            setTimeout(() => pollOrder(retriesLeft - 1, delayMs), delayMs);
          } else {
            setIsLoading(false);
            setErrorMessage(
              "We couldn't load your order details yet. Please check My Orders in a moment.",
            );
            toast.error("Failed to load order by session id");
          }
        });
    };

    pollOrder(3, 2000);
  }, [searchParams]);

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <>
      <Header />

      <section className="section-py bg-brand">
        <div className="container">
          <div className="card p-4 border-0 shadow-sm">
            {/* Success header */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 44,
                  height: 44,
                  background: "#e9f7ef",
                  color: "#198754",
                  fontWeight: 800,
                }}
              >
                ✓
              </div>
              <div>
                <h2 className="mb-1" style={{ fontSize: "1.25rem" }}>
                  Payment successful
                </h2>
                <div className="text-muted" style={{ fontSize: ".9rem" }}>
                  We're confirming your order details.
                </div>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="py-4 text-center">
                <div className="spinner-border text-gold" role="status" />
                <div className="text-muted mt-3">Loading your order...</div>
              </div>
            )}

            {/* Error */}
            {!isLoading && errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}

            {/* Order details */}
            {!isLoading && order && (
              <div className="mt-3">
                <div className="row g-3">
                  {/* ── Left: order info ──────────────────────────────── */}
                  <div className="col-lg-7">
                    <div
                      className="p-3 rounded"
                      style={{ background: "#fff7ec" }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div
                            className="text-muted"
                            style={{ fontSize: ".85rem" }}
                          >
                            Order
                          </div>
                          <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                            #{order.orderId}
                          </div>
                        </div>
                        <span className="badge text-bg-light border">
                          {order.status}
                        </span>
                      </div>

                      <hr />

                      <div className="row g-2">
                        <div className="col-md-6">
                          <div
                            className="text-muted"
                            style={{ fontSize: ".85rem" }}
                          >
                            Total
                          </div>
                          <div style={{ fontWeight: 800 }}>
                            {order.totalAmount.toFixed(2)} EGP
                          </div>
                        </div>
                        {order.payment && (
                          <div className="col-md-6">
                            <div
                              className="text-muted"
                              style={{ fontSize: ".85rem" }}
                            >
                              Payment
                            </div>
                            <div style={{ fontWeight: 800 }}>
                              {order.payment.paymentMethod} ·{" "}
                              {order.payment.amount.toFixed(2)}{" "}
                              {order.payment.currency?.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>

                      {order.shippingAddress?.addressLine1 && (
                        <div className="mt-3">
                          <div
                            className="text-muted"
                            style={{ fontSize: ".85rem" }}
                          >
                            Shipping
                          </div>
                          <div style={{ fontWeight: 700 }}>
                            {order.shippingAddress.recipientName}
                          </div>
                          <div className="text-muted">
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 &&
                              `, ${order.shippingAddress.addressLine2}`}
                            <br />
                            {order.shippingAddress.city}
                            {order.shippingAddress.state &&
                              `, ${order.shippingAddress.state}`}{" "}
                            {order.shippingAddress.postalCode}
                            <br />
                            {order.shippingAddress.country}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0" style={{ fontSize: "1rem" }}>
                          Items
                        </h3>
                        <div
                          className="text-muted"
                          style={{ fontSize: ".85rem" }}
                        >
                          {order.orderItems.length} item(s)
                        </div>
                      </div>
                      <div className="mt-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.orderItemId}
                            className="d-flex justify-content-between align-items-center py-2 border-bottom"
                          >
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                Book #{item.bookId}
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: ".85rem" }}
                              >
                                Qty {item.quantity} · {item.price.toFixed(2)}{" "}
                                EGP
                              </div>
                            </div>
                            <div style={{ fontWeight: 800 }}>
                              {item.totalItemsPrice.toFixed(2)} EGP
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Right: next steps ─────────────────────────────── */}
                  <div className="col-lg-5">
                    <div className="p-3 rounded border">
                      <div style={{ fontWeight: 800 }} className="mb-2">
                        Next steps
                      </div>
                      <ul className="mb-3" style={{ paddingLeft: "1.1rem" }}>
                        <li>
                          We'll email your receipt and order confirmation.
                        </li>
                        <li>You can track the order status in your account.</li>
                      </ul>

                      <div className="d-flex flex-column gap-2">
                        <Link
                          className="btn btn-dark"
                          to="/my-account"
                          state={{ tab: "orders" }}
                        >
                          Go to My Orders
                        </Link>
                        <Link
                          className="btn btn-outline-dark"
                          to={`/orders/${order.orderId}`}
                        >
                          View order details
                        </Link>
                        <Link className="btn btn-outline-secondary" to="/">
                          Continue shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
