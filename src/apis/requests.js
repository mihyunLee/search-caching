import { instance } from "./axiosInstance";

export const getRecommendedWord = async (keyword) => {
  const response = await instance.get(`?q=${keyword}`);
  return response.data;
};
