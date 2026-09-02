import { apiRequest } from "./api";

export const problemService = {
  /** Fetch all problems from backend database */
  async getProblems() {
    return apiRequest("/api/problems");
  },

  /** Fetch single problem details with matches and tasks */
  async getProblemById(id) {
    return apiRequest(`/api/problems/${id}`);
  },

  /** Create a new problem statement in database */
  async createProblem(problemData) {
    return apiRequest("/api/problems", {
      method: "POST",
      body: JSON.stringify(problemData),
    });
  },

  /** Trigger AI Tag analysis on a problem */
  async analyzeProblem(id) {
    return apiRequest(`/api/problems/${id}/analyze`, {
      method: "POST",
    });
  },

  /** Calculate university matches for a problem */
  async matchProblem(id) {
    return apiRequest(`/api/problems/${id}/match`, {
      method: "POST",
    });
  },

  /** Route problem to selected target university */
  async routeProblem(id, universityId) {
    return apiRequest(`/api/problems/${id}/route`, {
      method: "POST",
      body: JSON.stringify({ universityId }),
    });
  },
};
