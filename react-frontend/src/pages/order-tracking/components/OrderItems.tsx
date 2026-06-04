import type { IBookSummary } from "../../../types/book.types";

interface OrderItemsProps {
  orderId?: string | number;
  status?: string;
  books?: IBookSummary[];
}

export default function OrderItems({
  orderId = "",
  status = "",
  books = [],
}: OrderItemsProps) {
  return (
    <>
      <style>{`
        .order-items-card {
          background: linear-gradient(135deg, #fff8ef 0%, #f4e6d4 100%);
          border-radius: 22px;
          padding: 1.5rem;
          border: 1px solid rgba(199, 139, 81, 0.14);
        }
        .order-items-head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: start;
          margin-bottom: 1rem;
        }
        .order-items-eyebrow {
          margin: 0 0 0.35rem;
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.14em;
          color: #8f623a;
        }
        .order-items-title {
          margin: 0;
          color: var(--brand-dark);
          font-family: "Lato", sans-serif;
        }
        .order-items-status {
          background: #fff;
          border-radius: 999px;
          padding: 0.45rem 0.8rem;
          color: #8f623a;
          font-weight: 700;
          white-space: nowrap;
        }
        .order-item-row {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          align-items: center;
          gap: 0.9rem;
          padding: 0.8rem 0;
          border-top: 1px solid rgba(199, 139, 81, 0.12);
        }
        .order-item-img {
          width: 72px;
          height: 88px;
          object-fit: cover;
          border-radius: 12px;
        }
        .order-item-title {
          margin: 0 0 0.25rem;
          color: var(--brand-dark);
        }
        .order-item-author {
          margin: 0;
          color: var(--brand-gray);
        }
        .order-item-price {
          color: #c78b51;
        }
      `}</style>

      <div className="order-items-card">
        <div className="order-items-head">
          <div>
            <p className="order-items-eyebrow">Order Items</p>
            <h3 className="order-items-title">{orderId}</h3>
          </div>
          {status && <span className="order-items-status">{status}</span>}
        </div>

        {books.map((book) => (
          <div className="order-item-row" key={book.id}>
            <img
              className="order-item-img"
              src={book.image ?? ""}
              alt={book.title}
              loading="lazy"
            />
            <div>
              <h4 className="order-item-title">{book.title}</h4>
              <p className="order-item-author">{book.author}</p>
            </div>
            <strong className="order-item-price">
              ${book.price.toFixed(2)}
            </strong>
          </div>
        ))}
      </div>
    </>
  );
}
