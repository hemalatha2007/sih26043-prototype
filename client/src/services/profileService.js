import { apiRequest } from "./api";

export const profileService = {
  /** Fetch current authenticated user's complete profile & projects */
  async getProfile() {
    return apiRequest("/api/profile");
  },

  /** Update role-specific basic info, domains, skills, interests */
  async updateProfile(profileData) {
    return apiRequest("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  /** Add a new project */
  async addProject(projectData) {
    return apiRequest("/api/profile/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  /** Delete a project */
  async deleteProject(id) {
    return apiRequest(`/api/profile/projects/${id}`, {
      method: "DELETE",
    });
  },
};
