import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";

export default function NotFoundPage() {
  return (
    <>
      <CartSidebar />
      <Header />
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center section-py px-3"
        style={{ minHeight: "70vh" }}
      >
        <div className="not-found-num mb-3">404</div>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p
          className="text-brand-gray mb-5 mx-auto"
          style={{ maxWidth: "380px" }}
        >
          Oops! This page seems to have wandered off. Let's get you back to the
          bookstore.
        </p>
        <Link
          to="/"
          className="btn btn-gold btn-lg px-5 fw-bold text-uppercase"
        >
          <i className="bi bi-arrow-left me-2" />
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
}
