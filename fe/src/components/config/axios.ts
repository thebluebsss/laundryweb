import axios, { AxiosError } from 'axios';
import { StorageServices } from 'services/storage';
const storage = new StorageServices();

/**
 * Custom Config Axios
 * Custom BaseURL
 * Custom interceptors request
 * */
const API_URL = import.meta.env.VITE_API_URL;
export function configureAxios() {
  axios.defaults.baseURL = API_URL;
  // Add a request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = storage.getRefreshToken();
          if (!refreshToken) return Promise.reject(error);
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          };
          const response = await fetch(`${API_URL}/auth/refresh-token`, options).then((res) =>
            res.json()
          );
          if (!response?.accessToken) throw new Error('refresh token failed');
          storage.setAccessToken(response.accessToken);
          storage.setRefreshToken(response.refreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return axios(originalRequest);
        } catch (error) {
          storage.removeAccessToken();
          storage.removeRefreshToken();
          window.location.replace('/login');
        }
      }

      return Promise.reject(error);
    }
  );
}
