type TabCounts = Partial<
  Record<"orders" | "reviews" | "addresses" | "notifications", number | null>
>;

interface CustomerSidebarProps {
  activePanel?: string;
  tabCounts?: TabCounts;
  onPanelChange?: (panel: string) => void;
  onSignOut?: () => void;
}

const navItems = [
  {
    section: "Account",
    links: [
      {
        id: "orders",
        icon: "bi-bag-check",
        label: "My Orders",
        badge: "orders" as const,
      },
      {
        id: "reviews",
        icon: "bi-chat-square-text",
        label: "My Reviews",
        badge: "reviews" as const,
      },
    ],
  },
  {
    section: "Settings",
    links: [
      { id: "profile", icon: "bi-person", label: "Profile Info", badge: null },
      {
        id: "addresses",
        icon: "bi-geo-alt",
        label: "Saved Addresses",
        badge: "addresses" as const,
      },
      {
        id: "notifications",
        icon: "bi-bell",
        label: "Notifications",
        badge: "notifications" as const,
      },
      { id: "password", icon: "bi-lock", label: "Password", badge: null },
    ],
  },
];

export default function CustomerSidebar({
  activePanel = "orders",
  tabCounts = {},
  onPanelChange,
  onSignOut,
}: CustomerSidebarProps) {
  return (
    <div className="account-sidebar">
      {navItems.map((group, groupIndex) => (
        <div key={group.section}>
          {groupIndex > 0 && <div className="side-divider" />}
          <div className="side-section-label">{group.section}</div>
          {group.links.map((link) => {
            const count = link.badge ? tabCounts[link.badge] : null;
            return (
              <a
                key={link.id}
                className={`side-nav-link${activePanel === link.id ? " active" : ""}`}
                onClick={() => onPanelChange?.(link.id)}
                style={{ cursor: "pointer" }}
              >
                <i className={`bi ${link.icon}`} /> {link.label}
                {count !== null && count !== undefined && (
                  <span className="side-badge">{count}</span>
                )}
              </a>
            );
          })}
        </div>
      ))}

      <div className="side-divider" />
      <a
        className="side-nav-link"
        style={{ color: "#dc3545", cursor: "pointer" }}
        onClick={onSignOut}
      >
        <i className="bi bi-box-arrow-right" /> Sign Out
      </a>
    </div>
  );
}
