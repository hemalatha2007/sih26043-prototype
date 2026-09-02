import { apiRequest } from "./api";

export const notificationService = {
  /** Fetch notifications for authenticated user */
  async getNotifications() {
    return apiRequest("/api/notifications");
  },

  /** Get unread notification count for header bell badge */
  async getUnreadCount() {
    return apiRequest("/api/notifications/unread-count");
  },

  /** Mark single notification as read */
  async markAsRead(id) {
    return apiRequest(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  /** Mark all notifications as read */
  async markAllAsRead() {
    return apiRequest("/api/notifications/read-all", {
      method: "PATCH",
    });
  },
};
