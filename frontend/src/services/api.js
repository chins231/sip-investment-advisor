import axios from 'axios';

const API_BASE_URL = 'https://sip-advisor-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateRecommendations = async (userData) => {
  try {
    const response = await api.post('/generate-recommendations', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to generate recommendations';
  }
};

export const getUserRecommendations = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/recommendations`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch recommendations';
  }
};

export const compareScenarios = async (scenarios) => {
  try {
    const response = await api.post('/compare-scenarios', { scenarios });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to compare scenarios';
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'API health check failed';
  }
};

export default api;

