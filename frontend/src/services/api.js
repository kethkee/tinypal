import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Attach JWT access token to every API request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/*
 * If the access token expires,
 * automatically try to refresh it.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    /*
     * Don't try to refresh the token for
     * the token endpoints themselves.
     */
    const isAuthRequest =
      originalRequest?.url?.includes(
        "/token/"
      );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {
      const refreshToken =
        localStorage.getItem("refresh");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse =
          await axios.post(
            "http://localhost:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            }
          );

        const newAccessToken =
          refreshResponse.data.access;

        localStorage.setItem(
          "access",
          newAccessToken
        );

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError.response?.data ||
            refreshError
        );

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_email");

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);


export default api;