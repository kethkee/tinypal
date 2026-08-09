import api from "./api";

export const createProfile = async (profileData) => {
  const response = await api.post("profile/", profileData);
  return response.data;
};

export const getProfile = async () => (await api.get("profile/")).data;
export const getTasks = async () => (await api.get("profile/tasks/")).data;
export const addTask = async (task) => (await api.post("profile/tasks/", task)).data;
export const updateTask = async (id, task) => (await api.patch(`profile/tasks/${id}/`, task)).data;
export const deleteTask = async (id) => api.delete(`profile/tasks/${id}/`);
export const getPlan = async () => (await api.get("planner/")).data;
