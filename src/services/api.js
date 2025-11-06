import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getProjects: async () => {
    const response = await apiClient.get('/api/projects');
    return response.data;
  },

  getAbout: async () => {
    const response = await apiClient.get('/api/about');
    return response.data;
  },

  getSkills: async () => {
    const response = await apiClient.get('/api/skills');
    return response.data;
  },

  getExperiences: async () => {
    const response = await apiClient.get('/api/experiences');
    return response.data;
  },

  getCertifications: async () => {
    const response = await apiClient.get('/api/certifications');
    return response.data;
  },
};

export default api;