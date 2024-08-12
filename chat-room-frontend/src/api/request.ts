import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3009/",
  timeout: 3000,
});

export default http;
