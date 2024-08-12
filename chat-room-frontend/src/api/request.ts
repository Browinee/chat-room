import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3009/",
  timeout: 3000,
});

http.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("token");

  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const newToken = response.headers["token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data } = error.response;
    if (data.statusCode === 401) {
      message.error(data.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      return Promise.reject(error);
    }
  }
);
export default http;
