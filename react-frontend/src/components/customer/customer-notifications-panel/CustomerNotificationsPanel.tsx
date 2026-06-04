import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as notificationsService from "../../../services/notificationsService";
import { showToast } from "../../../utils/toast";
import type { INotification } from "../../../types/notification.types";

interface CustomerNotificationsPanelProps {
  onUnreadCountChange?: (count: number) => void;
}

const getIcon = (type: string): string => {
  const icons: Record<string, string> = {
    OrderConfirmed: "bi-bag-check",
    OrderStatusChanged: "bi-truck",
    OrderCancelled: "bi-x-circle",
  };
  return icons[type] ?? "bi-bell";
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function CustomerNotificationsPanel({
  onUnreadCountChange,
}: CustomerNotificationsPanelProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const emitUnreadCount = useCallback(
    (items: INotification[]) => {
      onUnreadCountChange?.(items.filter((n) => !n.isRead).length);
    },
    [onUnreadCountChange],
  );

  const load = useCallback(() => {
    setIsLoading(true);
    notificationsService
      .getMine()
      .then((res) => {
        const items = res.data ?? [];
        setNotifications(items);
        emitUnreadCount(items);
      })
      .catch(() => showToast("Failed to load notifications", "error"))
      .finally(() => setIsLoading(false));
  }, [emitUnreadCount]);

  useEffect(() => {
    load();
  }, [load]);

  const markAllAsRead = () => {
    notificationsService
      .markAllAsRead()
      .then(() => {
        setNotifications((prev) => {
          const updated = prev.map((n) => ({ ...n, isRead: true }));
          emitUnreadCount(updated);
          return updated;
        });
      })
      .catch(() => showToast("Failed to mark all as read", "error"));
  };

  const openNotification = (notif: INotification) => {
    const openLink = () => {
      if (notif.linkUrl) navigate(notif.linkUrl);
    };

    if (notif.isRead) {
      openLink();
      return;
    }

    notificationsService
      .markAsRead(notif.notificationId)
      .then(() => {
        setNotifications((prev) => {
          const updated = prev.map((n) =>
            n.notificationId === notif.notificationId
              ? { ...n, isRead: true }
              : n,
          );
          emitUnreadCount(updated);
          return updated;
        });
        openLink();
      })
      .catch(() => showToast("Failed to update notification", "error"));
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="section-heading mb-0">Notifications</div>
        <button
          className="btn btn-link p-0"
          style={{
            fontSize: "0.8rem",
            color: "var(--gold)",
            textDecoration: "none",
          }}
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card-box text-center py-4">
          <div className="spinner-border text-gold" role="status" />
          <div className="text-muted mt-3">Loading notifications...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && notifications.length === 0 && (
        <div className="card-box text-center py-4">
          <div style={{ fontWeight: 800 }}>No notifications yet</div>
          <div className="text-muted mt-1">
            Order updates and alerts will show up here.
          </div>
        </div>
      )}

      {/* Notification List */}
      {!isLoading && notifications.length > 0 && (
        <div className="card-box" style={{ padding: 0 }}>
          {notifications.map((notif, index) => {
            const isLast = index === notifications.length - 1;
            return (
              <div
                key={notif.notificationId}
                className="d-flex gap-3"
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  borderBottom: isLast
                    ? "none"
                    : "1px solid var(--brand-border)",
                  background: !notif.isRead
                    ? "rgba(225,169,43,.03)"
                    : "transparent",
                }}
                onClick={() => openNotification(notif)}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--gold)",
                  }}
                >
                  <i className={`bi ${getIcon(notif.type)}`} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: !notif.isRead
                          ? "var(--brand-dark)"
                          : "var(--brand-gray)",
                      }}
                    >
                      {notif.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--brand-gray)",
                      }}
                    >
                      {formatDate(notif.createdAt)}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--brand-gray)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {notif.message}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      marginTop: 6,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
