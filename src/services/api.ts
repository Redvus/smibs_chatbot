// src/services/api.ts
import axios, { AxiosError } from 'axios';
import type {
    BotMode,
    StartSessionRequest,
    StartSessionResponse,
    SaveAnswerRequest,
    SaveAnswerResponse
} from '../types';

// Исправление 1: Правильный способ получения переменных окружения в Vite
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export interface ApiError {
    message: string;
    status?: number;
}

export const getQuestion = async (mode: BotMode, sessionId?: string): Promise<StartSessionResponse> => {
    try {
        // Исправление 2: Убираем дублирование sessionId
        const response = await api.post<StartSessionResponse>('/start', {
            mode,
            ...(sessionId && { sessionId }) // Отправляем sessionId только если он есть
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.error || 'Ошибка соединения с сервером');
        }
        throw new Error('Неизвестная ошибка');
    }
};

export const saveAnswer = async (sessionId: string, answerData: SaveAnswerRequest): Promise<SaveAnswerResponse> => {
    try {
        // Исправление 3: Правильная структура запроса без дублирования
        const response = await api.post<SaveAnswerResponse>('/answer', {
            sessionId,  // sessionId на верхнем уровне
            questionId: answerData.questionId,
            answer: answerData.answer
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.error || 'Ошибка отправки ответа');
        }
        throw new Error('Неизвестная ошибка');
    }
};

export const generateResult = async (sessionId: string, answers: Record<string, any>): Promise<any> => {
    try {
        const response = await api.post('/generate-result', { sessionId, answers });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.error || 'Ошибка генерации результата');
        }
        throw new Error('Неизвестная ошибка');
    }
};

// Исправление 4: StartSessionRequest используется в типах, но не в коде - это нормально
// Если хотите убрать предупреждение, можно экспортировать тип:
export type { StartSessionRequest };