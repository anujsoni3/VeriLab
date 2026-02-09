import axios from 'axios';
import { Subject, Chapter, Stage } from '../types/learning';

// Assuming API URL is configured in axios instance or we use relative path with proxy
const API_URL = 'http://localhost:5000/api/learning';

// Add token to requests if needed, usually handled by interceptors in a real app
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const learningService = {
    getSubjects: async (): Promise<Subject[]> => {
        const response = await axios.get(`${API_URL}/subjects`);
        return response.data;
    },

    getSubject: async (id: string): Promise<{ subject: Subject; chapters: Chapter[] }> => {
        const response = await axios.get(`${API_URL}/subjects/${id}`);
        return response.data;
    },

    getChapter: async (id: string): Promise<{ chapter: Chapter; stages: Stage[] }> => {
        const response = await axios.get(`${API_URL}/chapters/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    getStage: async (id: string): Promise<Stage> => {
        const response = await axios.get(`${API_URL}/stages/${id}`, { headers: getAuthHeader() });
        return response.data;
    }
};
