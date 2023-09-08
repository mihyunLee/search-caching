import { ENDPOINT } from "../constants";
import { instance } from "./axiosInstance";

export const getRecommendedWord = async (keyword) => {
  const response = await instance.get(`${ENDPOINT.SICK}?q=${keyword}`);
  return response.data;
};
