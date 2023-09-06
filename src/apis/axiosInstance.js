import axios from "axios";
import { BASE_URL } from "../constants";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

instance.interceptors.request.use((config) => {
  console.info("calling api");

  return config;
});
