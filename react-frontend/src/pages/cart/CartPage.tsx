import { Link } from "react-router-dom";
import {
  useCartStore,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "../../store/useCartStore";
import { toSlug } from "../../utils/stringUtils";
import { getImageUrl } from "../../utils/imageUtils";
import Header from "../../components/header/Header";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import BookGrid from "../../components/book-grid/BookGrid";

// ── helpers ────────────────────────────────────────────────────────────────
const clamp = (value: number, max: number): number => Math.min(value, max);

const trustBadges = [
  { icon: "bi-shield-fill-check", label: "Secure Checkout" },
  { icon: "bi-truck", label: "Free Shipping" },
  { icon: "bi-arrow-return-left", label: "Easy Returns" },
];

// ── component ──────────────────────────────────────────────────────────────
export default function CartPage() {
  const cartItems = useCartStore(selectCartItems);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const { clearCart, removeItem, updateQuantity } = useCartStore();

  const orderTotal = totalPrice; // extend here if you add discounts

  return (
    <>
      <CartSidebar />
      <Header />

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="page-banner">
        <div className="container text-center">
          <h1 className="section-title mb-2">Shopping Cart</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-gold">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-brand-gray">Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main section ────────────────────────────────────────────────── */}
      <section className="section-py bg-brand">
        <div className="container">
          {cartItems.length === 0 ? (
            /* ── Empty cart ─────────────────────────────────────────────── */
            <div className="text-center py-5">
              <div className="mb-4" style={{ fontSize: "5rem", opacity: 0.35 }}>
                🛒
              </div>
              <h2 className="fw-bold mb-3">Your cart is empty</h2>
              <p
                className="text-brand-gray mb-5 mx-auto"
                style={{ maxWidth: 380 }}
              >
                Looks like you haven't added any books yet. Start browsing to
                find something you'll love!
              </p>
              <Link
                to="/all-books"
                className="btn btn-gold btn-lg px-5 fw-bold text-uppercase"
              >
                <i className="bi bi-arrow-left me-2" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            /* ── Cart layout ─────────────────────────────────────────────── */
            <div className="row g-5 align-items-start">
              {/* ── Left – items ──────────────────────────────────────────── */}
              <div className="col-lg-8">
                {/* Count + clear */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5
                    className="fw-bold mb-0"
                    style={{ fontFamily: '"Lato", sans-serif' }}
                  >
                    {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                  </h5>
                  <button
                    className="btn btn-link text-danger p-0 small fw-semibold text-decoration-none"
                    onClick={() => clearCart()}
                  >
                    <i className="bi bi-trash me-1" />
                    Clear all
                  </button>
                </div>

                {/* Table */}
                <div className="table-responsive rounded-3 border border-brand shadow-sm">
                  <table className="table cart-table mb-0">
                    <thead>
                      <tr>
                        <th className="ps-4" colSpan={2}>
                          Product
                        </th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Qty</th>
                        <th className="text-center">Subtotal</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.bookId}>
                          {/* Thumb */}
                          <td className="ps-4" style={{ width: 80 }}>
                            <Link
                              to={`/book/${item.bookId}/${toSlug(item.title)}`}
                            >
                              <img
                                src={
                                  item.imageUrl
                                    ? getImageUrl(item.imageUrl, "thumb")
                                    : "/images/placeholder.jpg"
                                }
                                alt={item.title}
                                className="cart-book-img"
                              />
                            </Link>
                          </td>

                          {/* Title */}
                          <td>
                            <Link
                              to={`/book/${item.bookId}/${toSlug(item.title)}`}
                              className="text-decoration-none"
                            >
                              <p
                                className="fw-semibold mb-1 small lh-sm"
                                style={{ color: "var(--brand-dark)" }}
                              >
                                {item.title}
                              </p>
                            </Link>
                          </td>

                          {/* Price */}
                          <td className="text-center">
                            <span className="fw-semibold text-gold">
                              ${item.price.toFixed(2)}
                            </span>
                          </td>

                          {/* Qty */}
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{
                                  width: 28,
                                  height: 28,
                                  padding: 0,
                                  fontSize: "0.85rem",
                                }}
                                onClick={() =>
                                  updateQuantity(item.bookId, item.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={item.quantity}
                                min={1}
                                className="qty-input"
                                onChange={(e) =>
                                  updateQuantity(
                                    item.bookId,
                                    clamp(
                                      Number(e.target.value) || 1,
                                      item.quantityInStock,
                                    ),
                                  )
                                }
                              />
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{
                                  width: 28,
                                  height: 28,
                                  padding: 0,
                                  fontSize: "0.85rem",
                                }}
                                onClick={() =>
                                  updateQuantity(item.bookId, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.quantityInStock}
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Subtotal */}
                          <td className="text-center fw-bold">
                            ${item.lineTotal.toFixed(2)}
                          </td>

                          {/* Remove */}
                          <td className="pe-3">
                            <button
                              className="remove-btn"
                              onClick={() => removeItem(item.bookId)}
                              title="Remove item"
                            >
                              <i className="bi bi-x-circle-fill" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Continue shopping */}
                <div className="mt-3">
                  <Link
                    to="/all-books"
                    className="btn btn-gold-outline fw-bold text-uppercase px-4"
                  >
                    <i className="bi bi-arrow-left me-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* ── Right – summary ───────────────────────────────────────── */}
              <div className="col-lg-4">
                <div className="order-summary sticky-top" style={{ top: 100 }}>
                  <h5
                    className="fw-bold mb-4"
                    style={{ fontFamily: '"Lato", sans-serif' }}
                  >
                    Order Summary
                  </h5>

                  <div className="summary-row">
                    <span className="text-brand-gray">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="fw-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="text-brand-gray">Shipping</span>
                    <span className="fw-semibold" style={{ color: "#198754" }}>
                      <i className="bi bi-truck me-1" />
                      Free
                    </span>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span className="text-gold fs-4">
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="btn btn-gold w-100 btn-lg fw-bold text-uppercase mt-4 py-3"
                  >
                    <i className="bi bi-lock-fill me-2" />
                    Proceed to Checkout
                  </Link>

                  {/* Trust badges */}
                  <div className="mt-4 pt-3 border-top border-brand">
                    <div className="row row-cols-3 g-2 text-center">
                      {trustBadges.map((b) => (
                        <div className="col" key={b.icon}>
                          <i
                            className={`bi ${b.icon} trust-icon d-block mb-1`}
                          />
                          <small
                            className="text-brand-gray lh-sm"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {b.label}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="text-center mt-4">
                    <small className="text-brand-gray d-block mb-2">
                      We accept
                    </small>
                    <img
                      src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/payment-image.png"
                      alt="Payment methods"
                      className="img-fluid"
                      style={{ opacity: 0.6, maxHeight: 22 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── You may also like ─────────────────────────────────────────────── */}
      <BookGrid
        title="You May Also Like"
        description="Readers who filled their carts also loved these."
        showViewMore
      />
    </>
  );
}
