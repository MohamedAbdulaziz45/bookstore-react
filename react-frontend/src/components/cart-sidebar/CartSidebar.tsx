import { Link } from "react-router";
import { useCartStore, selectTotalItems, selectTotalPrice } from "../../store/useCartStore";
import { toSlug } from "../../utils/stringUtils";

export default function CartSidebar() {
  const cartItems = useCartStore((state) => state.cart.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  return (
    <>
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeCart}
        />
      )}

      <div
        className={`offcanvas offcanvas-end cart-offcanvas${isOpen ? " show" : ""}`}
        style={{
          transition: "transform 0.3s ease",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        <div className="offcanvas-header border-bottom border-brand py-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bag fs-5 text-gold" />
            <h5
              className="mb-0 fw-bold"
              style={{ fontFamily: '"Lato", sans-serif' }}
            >
              Shopping Cart
            </h5>
            {totalItems > 0 && (
              <span className="badge rounded-pill bg-gold ms-1">
                {totalItems}
              </span>
            )}
          </div>
          <button
            className="btn-close"
            onClick={closeCart}
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body d-flex flex-column p-0">
          {cartItems.length === 0 ? (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-4 py-5">
              <div style={{ fontSize: "3.5rem", opacity: 0.4 }} className="mb-3">
                📚
              </div>
              <h5 className="fw-bold mb-2">Your cart is empty</h5>
              <p className="text-brand-gray small mb-4">
                Add some books to get started!
              </p>
              <button className="btn btn-gold px-4" onClick={closeCart}>
                Browse Books
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto p-3">
                {cartItems.map((item) => (
                  <div
                    className="d-flex gap-3 py-3 border-bottom border-brand"
                    key={item.bookId}
                  >
                    <Link
                      to={`/book/${item.bookId}/${toSlug(item.title)}`}
                      onClick={closeCart}
                    >
                      <img
                        src={item.imageUrl ?? ""}
                        alt={item.title}
                        className="cart-item-img rounded"
                      />
                    </Link>
                    <div className="flex-grow-1 min-width-0">
                      <p
                        className="fw-semibold mb-1 small lh-sm"
                        style={{ color: "var(--brand-dark)" }}
                      >
                        {item.title}
                      </p>
                      <div className="fw-bold text-gold small mt-1">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            void updateQuantity(item.bookId, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span
                          className="fw-bold small"
                          style={{ minWidth: "20px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            void updateQuantity(item.bookId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-link text-brand-gray p-0 align-self-start"
                      onClick={() => void removeItem(item.bookId)}
                      title="Remove"
                    >
                      <i className="bi bi-x-lg small" />
                    </button>
                  </div>
                ))}
              </div>

              <div
                className="p-3 border-top border-brand"
                style={{ background: "var(--brand-warm)" }}
              >
                <div className="d-flex justify-content-between align-items-center fw-bold mb-3">
                  <span style={{ fontSize: "1rem" }}>Subtotal</span>
                  <span className="text-gold fs-5">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Link
                  to="/cart"
                  className="btn btn-gold w-100 fw-bold text-uppercase mb-2"
                  onClick={closeCart}
                >
                  <i className="bi bi-bag-check me-2" />
                  View Cart
                </Link>
                <button
                  className="btn btn-gold-outline w-100 fw-bold text-uppercase"
                  onClick={closeCart}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
