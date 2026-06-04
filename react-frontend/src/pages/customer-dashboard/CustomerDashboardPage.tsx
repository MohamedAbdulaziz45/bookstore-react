import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CustomerSidebar from "../../components/customer/customer-sidebar/CustomerSidebar";
import CustomerOrdersPanel from "../../components/customer/customer-orders-panel/CustomerOrdersPanel";
import CustomerReviewsPanel from "../../components/customer/customer-reviews-panel/CustomerReveiwsPanel";
import CustomerProfilePanel from "../../components/customer/customer-profile-panel/CustomerProfilePanel";
import CustomerAddressesPanel from "../../components/customer/customer-addresses-panel/CustomerAddressesPanel";
import CustomerNotificationsPanel from "../../components/customer/customer-notifications-panel/CustomerNotificationsPanel";
import CustomerPasswordPanel from "../../components/customer/customer-password-panel/CustomerPasswordPanel";
import * as authService from "../../services/auth/authService";
import * as orderService from "../../services/orderService";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuthStore } from "../../services/auth/useAuthStore";
import type { IUserDetails } from "../../types/auth.types";

type TabCounts = Partial<
  Record<"orders" | "reviews" | "addresses" | "notifications", number | null>
>;

type Panel =
  | "orders"
  | "reviews"
  | "profile"
  | "addresses"
  | "notifications"
  | "password";

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [activePanel, setActivePanel] = useState<Panel>("orders");
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [tabCounts, setTabCounts] = useState<TabCounts>({});

  // ── derived display values ─────────────────────────────────────────────
  const userDisplayName =
    userDetails?.displayName ||
    [userDetails?.firstName, userDetails?.lastName].filter(Boolean).join(" ") ||
    "My Account";

  const userInitials = userDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userAvatarUrl = userDetails?.imagePath
    ? getImageUrl(userDetails.imagePath, "avatar")
    : null;

  const heroStats = [
    { label: "Orders", value: totalOrders },
    { label: "Addresses", value: tabCounts.addresses ?? 0 },
    { label: "Reviews", value: tabCounts.reviews ?? 0 },
  ];

  // ── load ──────────────────────────────────────────────────────────────
  const loadUserDetails = useCallback(() => {
    authService
      .getUserDetails()
      .then((res) => setUserDetails(res.data))
      .catch(() => {});
  }, []);

  const loadOrderSummary = useCallback(() => {
    orderService
      .getMySummary()
      .then((res) => setTotalOrders(res.data.totalOrders))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadUserDetails();
    loadOrderSummary();
  }, [loadUserDetails, loadOrderSummary]);

  // ── panel & tab count handlers ─────────────────────────────────────────
  const showPanel = (panel: string) => setActivePanel(panel as Panel);

  const onSignOut = () => {
    logout();
    navigate("/");
  };

  const onProfileUpdated = (user: IUserDetails) => {
    setUserDetails(user);
  };

  const onReviewCountChanged = (count: number) =>
    setTabCounts((prev) => ({ ...prev, reviews: count }));

  const onAddressCountChanged = (count: number) =>
    setTabCounts((prev) => ({ ...prev, addresses: count }));

  const onUnreadNotificationsChanged = (count: number) =>
    setTabCounts((prev) => ({ ...prev, notifications: count }));

  return (
    <>
      <CartSidebar />
      <Header />

      {/* Hero Banner */}
      <div className="account-hero">
        <div className="d-flex align-items-center gap-4 mb-4">
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="Profile image"
              style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(225,169,43,0.28)",
              }}
            />
          ) : (
            <div className="customer-avatar-lg">{userInitials}</div>
          )}
          <div>
            <div className="customer-name">{userDisplayName}</div>
            <div className="customer-since">
              <i className="bi bi-envelope" />{" "}
              {userDetails?.email ?? "No email"}
            </div>
            <div style={{ marginTop: 6 }}>
              <span className="member-badge">Customer</span>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="col-4">
              <div className="hero-stat">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Layout */}
      <div className="account-layout">
        {/* Sidebar */}
        <CustomerSidebar
          activePanel={activePanel}
          tabCounts={tabCounts}
          onPanelChange={showPanel}
          onSignOut={onSignOut}
        />

        {/* Main Content */}
        <div className="account-main">
          {activePanel === "orders" && <CustomerOrdersPanel />}

          {activePanel === "reviews" && (
            <CustomerReviewsPanel onReviewCountChange={onReviewCountChanged} />
          )}

          {activePanel === "profile" && (
            <CustomerProfilePanel onProfileUpdated={onProfileUpdated} />
          )}

          {activePanel === "addresses" && (
            <CustomerAddressesPanel
              onAddressCountChange={onAddressCountChanged}
            />
          )}

          {activePanel === "notifications" && (
            <CustomerNotificationsPanel
              onUnreadCountChange={onUnreadNotificationsChanged}
            />
          )}

          {activePanel === "password" && <CustomerPasswordPanel />}
        </div>
      </div>

      <Footer />
    </>
  );
}
