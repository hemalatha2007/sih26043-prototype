import { apiRequest } from "./api";

export const taskService = {
  /** Fetch all Kanban tasks for a specific problem */
  async getTasks(problemId) {
    const problem = await apiRequest(`/api/problems/${problemId}`);
    return problem.tasks || [];
  },

  /** Create a new Kanban task for a problem */
  async createTask(problemId, title) {
    return apiRequest(`/api/problems/${problemId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  /** Update task status column (TODO / DOING / DONE) */
  async updateTaskStatus(taskId, column) {
    return apiRequest(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ column }),
    });
  },
};
