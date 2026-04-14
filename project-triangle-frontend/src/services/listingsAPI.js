// src/services/listingsAPI.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ POST /api/listings/upload (multipart/form-data)
export const uploadProject = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/listings/upload`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error uploading project" };
  }
};

// ✅ GET /api/listings/explore
export const fetchExploreProjects = async () => {
  try {
    const res = await axios.get(`${API_URL}/listings/explore`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error fetching projects" };
  }
};

// ✅ GET /api/listings/my-projects
export const fetchMyProjects = async () => {
  try {
    const res = await axios.get(`${API_URL}/listings/my-projects`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error fetching my projects" };
  }
};
