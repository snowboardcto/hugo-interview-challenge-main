// services/apiService.ts
import axios from 'axios';
import { ApplicationData } from '../models/ApplicationData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a new application
export const createApplication = async (): Promise<ApplicationData> => {
    const response = await axios.post(`${API_BASE_URL}/api/applications`);
    return response.data;
};

// Fetch application data by ID
export const fetchApplicationData = async (id: number): Promise<ApplicationData> => {
    const response = await axios.get(`${API_BASE_URL}/api/applications/${id}`);
    return response.data;
};

// Save application data
export const saveApplicationData = async (id: number, data: ApplicationData): Promise<void> => {
    await axios.put(`${API_BASE_URL}/api/applications/${id}`, data);
};

// Submit application data
export const submitApplication = async (id: number): Promise<{ quotedPrice: number }> => {
    const response = await axios.post(`${API_BASE_URL}/api/applications/${id}/submit`);
    return response.data;
};
