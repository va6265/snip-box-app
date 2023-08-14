import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Your API base URL
  withCredentials: true, // Important: Include this to send cookies with requests
});

const getJwtTokenFromCookie = () => {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");

  for (const cookie of cookieArray) {
    const [name, value] = cookie.split("=");
    if (name === "jwt") {
      return value;
    }
  }

  return null;
};

// Add an interceptor to include the user's cookie
axiosInstance.interceptors.request.use(
  (config) => {
    const userCookie = getJwtTokenFromCookie();
    config.headers.Authorization = `Bearer ${userCookie}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
