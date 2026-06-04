interface AdminTopbarProps {
  topbarTitle: string;
  topbarSub: string;
}

export default function AdminTopbar({
  topbarTitle,
  topbarSub,
}: AdminTopbarProps) {
  return (
    <div className="admin-topbar">
      <div>
        <div className="topbar-title">{topbarTitle}</div>
        <div className="topbar-subtitle">{topbarSub}</div>
      </div>
      <div className="topbar-actions">
        <div className="search-wrap">
          <i className="bi bi-search" />
          <input className="search-input" type="text" placeholder="Search..." />
        </div>
        <div className="icon-btn-admin">
          <i className="bi bi-bell" />
          <div className="notif-dot" />
        </div>
        <div className="icon-btn-admin">
          <i className="bi bi-question-circle" />
        </div>
      </div>
    </div>
  );
}
