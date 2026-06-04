import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router";
import { useLocation } from "react-router-dom";
import { CheckAdminGuard, CheckLoginGuard } from "./guards/AuthGuards";
import { useCartStore } from "./store/useCartStore";
import "./App.css";

const AboutPage = lazy(() => import("./pages/about/AboutPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin-dashboard/AdminDashboardPage"),
);
const AllBooksPage = lazy(() => import("./pages/all-books/AllBooksPage"));
const AuthorDetailsPage = lazy(
  () => import("./pages/author-details/AuthorDetailsPage"),
);
const BookDetailsPage = lazy(
  () => import("./pages/book-details/BookDetailsPage"),
);
const CartPage = lazy(() => import("./pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));
const CustomerDashboardPage = lazy(
  () => import("./pages/customer-dashboard/CustomerDashboardPage"),
);
const EditorsPickPage = lazy(
  () => import("./pages/editors-pick/EditorsPickPage"),
);
const FeaturedPage = lazy(() => import("./pages/featured/FeaturedPage"));
const GenreDetailsPage = lazy(
  () => import("./pages/genre-details/GenreDetailsPage"),
);
const GenresPage = lazy(() => import("./pages/genres/GenresPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NewArrivalPage = lazy(
  () => import("./pages/new-arrival/NewArrivalPage"),
);
const NotFoundPage = lazy(() => import("./pages/not-found/NotFoundPage"));
const OrderTrackingPage = lazy(
  () => import("./pages/order-tracking/OrderTrackingPage"),
);
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SearchResultsPage = lazy(
  () => import("./pages/search-results/SearchResultsPage"),
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
function App() {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="genres/:id/:slug" element={<GenreDetailsPage />} />
          <Route path="search-results" element={<SearchResultsPage />} />
          <Route path="all-books" element={<AllBooksPage />} />
          <Route path="new-arrival" element={<NewArrivalPage />} />
          <Route path="featured-books" element={<FeaturedPage />} />
          <Route path="editors-pick" element={<EditorsPickPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="orders/:id" element={<OrderTrackingPage />} />
          <Route path="author/:id/:slug" element={<AuthorDetailsPage />} />
          <Route path="author/:id" element={<AuthorDetailsPage />} />
          <Route path="book/:id/:slug" element={<BookDetailsPage />} />
          <Route path="book/:id" element={<BookDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="checkout"
            element={
              <CheckLoginGuard>
                <CheckoutPage />
              </CheckLoginGuard>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <CheckLoginGuard>
                <CheckAdminGuard>
                  <AdminDashboardPage />
                </CheckAdminGuard>
              </CheckLoginGuard>
            }
          />
          <Route
            path="my-account"
            element={
              <CheckLoginGuard>
                <CustomerDashboardPage />
              </CheckLoginGuard>
            }
          />
          <Route
            path="profile"
            element={
              <CheckLoginGuard>
                <ProfilePage />
              </CheckLoginGuard>
            }
          />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
