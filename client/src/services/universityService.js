import { apiRequest } from "./api";

export const universityService = {
  /** Fetch all universities with faculty and student counts */
  async getUniversities() {
    return apiRequest("/api/universities");
  },

  /** Fetch detailed profile for a specific university */
  async getUniversityById(id) {
    return apiRequest(`/api/universities/${id}`);
  },
};
