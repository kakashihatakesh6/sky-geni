import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

export const getSummary = async () => (await api.get('/summary')).data;
export const getDrivers = async () => (await api.get('/drivers')).data;
export const getRiskFactors = async () => (await api.get('/risk-factors')).data;
export const getRecommendations = async () => (await api.get('/recommendations')).data;
export const getTrend = async () => (await api.get('/trend')).data;
