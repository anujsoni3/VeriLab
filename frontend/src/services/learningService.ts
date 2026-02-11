import api from './api';
import { Subject, Chapter, Stage } from '../types/learning';

export const learningService = {
    getSubjects: async (): Promise<Subject[]> => {
        const response = await api.get('/learning/subjects');
        return response.data;
    },

    getSubject: async (id: string): Promise<{ subject: Subject; chapters: Chapter[] }> => {
        const response = await api.get(`/learning/subjects/${id}`);
        return response.data;
    },

    getChapter: async (id: string): Promise<{ chapter: Chapter; stages: Stage[] }> => {
        const response = await api.get(`/learning/chapters/${id}`);
        return response.data;
    },

    getStage: async (id: string): Promise<Stage> => {
        const response = await api.get(`/learning/stages/${id}`);
        return response.data;
    },

    simulateCode: async (code: string, problemId?: string, stageId?: string): Promise<{ status: string; output: string; vcd?: string }> => {
        const payload: any = { code };
        if (problemId) payload.problemId = problemId;
        if (stageId) payload.stageId = stageId;

        const response = await api.post('/simulation/run', payload);
        // The backend returns { success: true, data: { ... } }
        // api.ts interceptor returns response, which is the axios response.
        return response.data.data;
    }
};
