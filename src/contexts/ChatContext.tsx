// src/contexts/ChatContext.tsx
import { createContext, useReducer, useContext, ReactNode } from 'react';
import { getQuestion, saveAnswer } from '../services/api';
import type {
    BotMode,
    Question,
    Message,
    // Session - убираем, так как не используется
    StartSessionResponse,
    SaveAnswerResponse,
    SaveAnswerRequest  // Добавляем импорт типа
} from '../types';

interface ChatState {
    sessionId: string | null;
    mode: BotMode | null;
    messages: Message[];
    currentQuestion: Question | null;
    loading: boolean;
    error: string | null;
    completed: boolean;
    result: any;
    answers: Record<string, any>;
}

type ChatAction =
    | { type: 'START_SESSION'; payload: StartSessionResponse & { mode: BotMode } }
    | { type: 'SEND_MESSAGE'; payload: { text: string } }
    | { type: 'RECEIVE_RESPONSE'; payload: SaveAnswerResponse }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'ADD_ANSWER'; payload: { questionId: string; answer: any } };

const initialState: ChatState = {
    sessionId: null,
    mode: null,
    messages: [],
    currentQuestion: null,
    loading: false,
    error: null,
    completed: false,
    result: null,
    answers: {}
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'START_SESSION':
            return {
                ...state,
                sessionId: action.payload.sessionId,
                mode: action.payload.mode,
                messages: [{
                    id: Date.now(),
                    text: action.payload.firstQuestion.text,
                    sender: 'bot',
                    type: 'question',
                    question: action.payload.firstQuestion
                }],
                currentQuestion: action.payload.firstQuestion,
                loading: false,
                error: null
            };

        case 'SEND_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, {
                    id: Date.now(),
                    text: action.payload.text,
                    sender: 'user',
                    type: 'answer'
                }],
                loading: true
            };

        case 'RECEIVE_RESPONSE':
            if (action.payload.completed) {
                // НЕ добавляем сообщение в messages, только сохраняем result
                return {
                    ...state,
                    loading: false,
                    completed: true,
                    result: action.payload.result,
                    currentQuestion: null
                    // messages НЕ меняем
                };
            } else if (action.payload.question) {
                return {
                    ...state,
                    messages: [...state.messages, {
                        id: Date.now(),
                        text: action.payload.question.text,
                        sender: 'bot',
                        type: 'question',
                        question: action.payload.question
                    }],
                    currentQuestion: action.payload.question,
                    loading: false
                };
            }
            return state;

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case 'ADD_ANSWER':
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionId]: action.payload.answer
                }
            };

        default:
            return state;
    }
};

interface ChatContextType extends ChatState {
    startSession: (mode: BotMode) => Promise<void>;
    sendAnswer: (answer: any) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const startSession = async (mode: BotMode) => {
        try {
            const response = await getQuestion(mode);
            dispatch({ type: 'START_SESSION', payload: { ...response, mode } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Неизвестная ошибка' });
        }
    };

    const sendAnswer = async (answer: any) => {
        if (!state.currentQuestion || !state.sessionId) return;

        const questionId = state.currentQuestion.id;

        // Форматируем ответ для отображения
        let displayAnswer = String(answer);
        if (state.currentQuestion.type === 'options' && state.currentQuestion.options) {
            const option = state.currentQuestion.options.find(opt => opt.value === answer);
            displayAnswer = option?.label || String(answer);
        }

        dispatch({
            type: 'SEND_MESSAGE',
            payload: { text: displayAnswer }
        });

        dispatch({
            type: 'ADD_ANSWER',
            payload: { questionId, answer }
        });

        try {
            // Исправление: создаем объект типа SaveAnswerRequest
            const answerRequest: SaveAnswerRequest = {
                sessionId: state.sessionId,  // sessionId теперь здесь
                questionId,
                answer
            };

            const response = await saveAnswer(state.sessionId, answerRequest);
            dispatch({ type: 'RECEIVE_RESPONSE', payload: response });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Неизвестная ошибка' });
        }
    };

    const value = {
        ...state,
        startSession,
        sendAnswer
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};