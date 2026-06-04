import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import OrderTimeline from "./components/OrderTimeline";
import OrderItems from "./components/OrderItems";
import * as orderService from "../../services/orderService";
import type { Order } from "../../types/orders.types";
import type { IBookSummary } from "../../types/book.types";

const STEPS = [
  {
    label: "Order confirmed",
    detail: "Payment accepted and picking list generated for the warehouse.",
    active: true,
  },
  {
    label: "Packed for dispatch",
    detail:
      "Books were packed with protective wrap and labeled for courier pickup.",
    active: true,
  },
  {
    label: "In transit",
    detail:
      "Package is moving between sorting hubs and is expected within 2 business days.",
    active: true,
  },
  {
    label: "Delivered",
    detail:
      "Final doorstep confirmation will appear here once the courier completes the route.",
    active: false,
  },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ?? "BW-10248";

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    orderService
      .getById(Number(id))
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  // Map order items to IBookSummary shape for OrderItems component
  const orderedBooks: IBookSummary[] = (order?.orderItems ?? []).map(
    (item) => ({
      id: item.bookId,
      title: `Book #${item.bookId}`,
      price: item.price,
      image: null,
      author: "",
      authorId: 0,
      rating: 0,
      reviewCount: 0,
    }),
  );

  // Derive active steps from order status
  const statusSteps = order
    ? STEPS.map((step) => ({
        ...step,
        active:
          step.label === "Delivered"
            ? order.status === "Delivered"
            : ["Order confirmed", "Packed for dispatch", "In transit"].includes(
                  step.label,
                )
              ? ["Processing", "Shipped", "Delivered"].includes(order.status) ||
                step.label === "Order confirmed"
              : step.active,
      }))
    : STEPS;

  const displayStatus = order?.status ?? "In transit";

  return (
    <>
      <Header />
      <PageBanner
        title="Order Details & Tracking"
        subtitle="A full order page with shipment status, purchased items, and next-step reassurance."
      />

      <section className="section-py bg-brand">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status" />
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-7">
                <OrderItems
                  orderId={orderId}
                  status={displayStatus}
                  books={orderedBooks}
                />
              </div>
              <div className="col-lg-5">
                <OrderTimeline steps={statusSteps} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
