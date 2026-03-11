// src/types/index.ts

// Типы для вопросов
export type QuestionType = 'text' | 'options' | 'multiple' | 'radio';

export interface Option {
    value: string;
    label: string;
    description?: string;
    icon?: string;
}

export interface Question {
    id: string;
    text: string;
    description?: string;
    type: QuestionType;
    required?: boolean;
    next?: string | null;
    options?: Option[];
}

// Типы для режимов бота
export type BotMode = 'planner' | 'evaluator' | 'constructor';

// Типы для форматов мероприятий
export type Audience = 'kids' | 'teens' | 'youth' | 'adults' | 'seniors' | 'professionals' | 'all';
export type Duration = '30min' | '1hour' | '2hours' | 'more';
export type Resource = 'projector' | 'computers' | 'craft' | 'books' | 'space' | 'print';
export type Complexity = 'low' | 'medium' | 'high';

export interface Format {
    id: string;
    name: string;
    description: string;
    suitableFor: Audience[];
    duration: Duration[];
    resources: Resource[];
    complexity: Complexity;
    tags?: string[];
    example: string;
}

export interface FormatsByComplexity {
    easy: Format[];
    medium: Format[];
    complex: Format[];
    all: Format[];
}

// Типы для сообщений чата
export type MessageSender = 'user' | 'bot';
export type MessageType = 'text' | 'question' | 'answer' | 'result';

export interface Message {
    id: number;
    text: string;
    sender: MessageSender;
    type: MessageType;
    question?: Question;
}

// Типы для сессии
export interface Session {
    sessionId: string;
    mode: BotMode;
    answers: Record<string, any>;
    currentQuestion: Question | null;
    history: Message[];
}

// Типы для API
export interface StartSessionRequest {
    mode: BotMode;
}

export interface StartSessionResponse {
    sessionId: string;
    firstQuestion: Question;
}

export interface SaveAnswerRequest {
    sessionId: string;
    questionId: string;
    answer: any;
}

export interface SaveAnswerResponse {
    completed: boolean;
    question?: Question;
    result?: any;
}

export interface SaveAnswerRequest {
    sessionId: string;
    questionId: string;
    answer: any;
}