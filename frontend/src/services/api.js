import axios from "axios";


const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("access");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      localStorage.getItem("refresh")
    ) {

      originalRequest._retry = true;

      try {

        const refreshResponse =
          await axios.post(
            `${
              import.meta.env.VITE_API_URL ||
              "http://localhost:8000/api/"
            }token/refresh/`,
            {
              refresh:
                localStorage.getItem(
                  "refresh"
                ),
            }
          );


        const newAccessToken =
          refreshResponse.data.access;


        localStorage.setItem(
          "access",
          newAccessToken
        );


        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        return api(
          originalRequest
        );

      } catch (refreshError) {

        localStorage.removeItem(
          "access"
        );

        localStorage.removeItem(
          "refresh"
        );

        localStorage.removeItem(
          "user_email"
        );

        return Promise.reject(
          refreshError
        );
      }
    }


    return Promise.reject(error);
  }
);


export default api;