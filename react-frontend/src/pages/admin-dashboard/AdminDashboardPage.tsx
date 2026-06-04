import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import AdminSidebar from "../../components/admin/admin-sidebar/AdminSidebar";
import AdminTopbar from "../../components/admin/admin-topbar/AdminTopbar";
import AdminOverviewPanel from "../../components/admin/admin-overview-panel/AdminOverviewPanel";
import AdminBooksPanel from "../../components/admin/admin-books-panel/AdminBooksPanel";
import AdminGenresPanel from "../../components/admin/admin-genres-panel/AdminGenresPanel";
import AdminAuthorsPanel from "../../components/admin/admin-authors-panel/AdminAuthorsPanel";
import AdminOrdersPanel from "../../components/admin/admin-orders-panel/AdminOrdersPanel";
import AdminPaymentsPanel from "../../components/admin/admin-payments-panel/AdminPaymentsPanel";
import AdminShippingsPanel from "../../components/admin/admin-shippings-panel/AdminShippingsPanel";
import AdminCustomersPanel from "../../components/admin/admin-customers-panel/AdminCustomersPanel";
import AdminReviewsPanel from "../../components/admin/admin-reviews-panel/AdminReviewsPanel";
import AdminSettingsPanel from "../../components/admin/admin-settings-panel/AdminSettingsPanel";

type AdminDashboardTab =
  | "overview"
  | "books"
  | "genres"
  | "authors"
  | "orders"
  | "payments"
  | "shippings"
  | "customers"
  | "reviews"
  | "settings";

const VALID_TABS: AdminDashboardTab[] = [
  "overview",
  "books",
  "genres",
  "authors",
  "orders",
  "payments",
  "shippings",
  "customers",
  "reviews",
  "settings",
];

const PANEL_TITLES: Record<AdminDashboardTab, [string, string]> = {
  overview: [
    "Dashboard Overview",
    new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  ],
  books: ["Books Management", "Catalogue"],
  genres: ["Genres Management", "Catalogue"],
  authors: ["Authors Management", "Catalogue"],
  orders: ["Orders Management", "Sales"],
  payments: ["Payments", "Sales"],
  shippings: ["Shippings", "Sales"],
  customers: ["Customers", "Community"],
  reviews: ["Reviews", "Community"],
  settings: ["Settings", "System"],
};

const isValidTab = (tab: string | null): tab is AdminDashboardTab =>
  !!tab && VALID_TABS.includes(tab as AdminDashboardTab);

export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: AdminDashboardTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return isValidTab(tab) ? tab : "overview";
  }, [searchParams]);

  // Normalise invalid/missing tab in the URL on first render
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!isValidTab(tab)) {
      setSearchParams({ tab: "overview" }, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showTab = (tab: string) => {
    if (!isValidTab(tab)) return;
    setSearchParams({ tab });
  };

  const [topbarTitle, topbarSub] = PANEL_TITLES[activeTab];

  return (
    <>
      <AdminSidebar activeTab={activeTab} onTabChange={showTab} />

      <div className="admin-main-content">
        <AdminTopbar topbarTitle={topbarTitle} topbarSub={topbarSub} />

        <div className="page-body">
          {activeTab === "overview" && <AdminOverviewPanel />}
          {activeTab === "books" && <AdminBooksPanel />}
          {activeTab === "genres" && <AdminGenresPanel />}
          {activeTab === "authors" && <AdminAuthorsPanel />}
          {activeTab === "orders" && <AdminOrdersPanel />}
          {activeTab === "payments" && <AdminPaymentsPanel />}
          {activeTab === "shippings" && <AdminShippingsPanel />}
          {activeTab === "customers" && <AdminCustomersPanel />}
          {activeTab === "reviews" && <AdminReviewsPanel />}
          {activeTab === "settings" && <AdminSettingsPanel />}
        </div>
      </div>
    </>
  );
}
