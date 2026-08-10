import api from "./api";


/*
 * Create / save the permanent user profile.
 */
export const createProfile = async (
  profileData
) => {
  const response = await api.post(
    "profile/",
    profileData
  );

  return response.data;
};


/*
 * Get the permanent user profile.
 *
 * This contains things such as:
 * - wake-up time
 * - sleep time
 * - study preferences
 * - break duration
 * - recurring commitments
 */
export const getProfile = async () => {
  const response = await api.get(
    "profile/"
  );

  return response.data;
};


/*
 * Get tasks.
 */
export const getTasks = async () => {
  const response = await api.get(
    "profile/tasks/"
  );

  return response.data;
};


/*
 * Add a task.
 */
export const addTask = async (task) => {
  const response = await api.post(
    "profile/tasks/",
    task
  );

  return response.data;
};


/*
 * Update a task.
 */
export const updateTask = async (
  id,
  task
) => {
  const response = await api.patch(
    `profile/tasks/${id}/`,
    task
  );

  return response.data;
};


/*
 * Delete a task.
 */
export const deleteTask = async (id) => {
  return api.delete(
    `profile/tasks/${id}/`
  );
};


/*
 * Get the generated planner.
 */
export const getPlan = async () => {
  const response = await api.get(
    "planner/"
  );

  return response.data;
};


/*
 * Create today's fresh plan.
 *
 * IMPORTANT:
 * This uses the authenticated `api`
 * instance, so the JWT access token
 * is automatically attached.
 */
export const createTodayPlan = async ({
  tasks = [],
  priorities = [],
} = {}) => {

  const response = await api.post(
    "profile/today/",
    {
      tasks,
      priorities,
    }
  );

  return response.data;
};


/*
 * Get today's plan.
 *
 * A 404 means the user hasn't created
 * today's plan yet.
 */
export const getTodayPlan = async () => {

  const response = await api.get(
    "profile/today/"
  );

  return response.data;
};