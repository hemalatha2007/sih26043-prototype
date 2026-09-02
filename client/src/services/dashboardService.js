import { apiRequest } from "./api";

export const dashboardService = {
  /** Fetch dynamic database statistics for dashboard metrics */
  async getStats() {
    return apiRequest("/api/dashboard/stats");
  },

  /** Fetch problem distribution by domain category */
  async getAnalyticsDomain() {
    return apiRequest("/api/analytics/problems-by-domain");
  },

  /** Fetch problem distribution by pipeline status */
  async getAnalyticsStatus() {
    return apiRequest("/api/analytics/problems-by-status");
  },

  /** Fetch university participation metrics */
  async getUniversityParticipation() {
    return apiRequest("/api/analytics/university-participation");
  },
};
