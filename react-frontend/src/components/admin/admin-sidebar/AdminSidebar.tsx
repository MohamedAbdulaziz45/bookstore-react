interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: AdminSidebarProps) {
  const navItem = (
    tab: string,
    icon: string,
    label: string,
    badge?: number,
  ) => (
    <a
      className={`nav-item-link${activeTab === tab ? " active" : ""}`}
      onClick={() => onTabChange(tab)}
    >
      <i className={`bi ${icon}`} /> {label}
      {badge !== undefined && <span className="badge-count">{badge}</span>}
    </a>
  );

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="logo-text">📚 BookWorms</div>
        <div className="role-badge">Admin Panel</div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Overview</div>
        {navItem("overview", "bi-grid-1x2", "Dashboard")}

        <div className="nav-section-label">Catalogue</div>
        {navItem("books", "bi-book", "Books")}
        {navItem("genres", "bi-tags", "Genres")}
        {navItem("authors", "bi-pen", "Authors")}

        <div className="nav-section-label">Sales</div>
        {navItem("orders", "bi-bag", "Orders", 12)}
        {navItem("payments", "bi-credit-card", "Payments")}
        {navItem("shippings", "bi-truck", "Shippings")}

        <div className="nav-section-label">Community</div>
        {navItem("customers", "bi-people", "Customers")}
        {navItem("reviews", "bi-chat-square-text", "Reviews", 5)}

        <div className="nav-section-label">System</div>
        {navItem("settings", "bi-gear", "Settings")}
      </div>

      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-2">
          <div className="admin-avatar">AD</div>
          <div>
            <div className="admin-name">Admin User</div>
            <div className="admin-email">admin@bookworms.com</div>
          </div>
          <a
            href="#"
            className="ms-auto"
            style={{ color: "rgba(255,255,255,.4)", fontSize: ".9rem" }}
          >
            <i className="bi bi-box-arrow-right" />
          </a>
        </div>
      </div>
    </div>
  );
}
