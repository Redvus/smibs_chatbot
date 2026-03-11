// server/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Хранилище сессий
const sessions = new Map();

// Начало диалога
app.post("/api/start", (req, res) => {
    const { mode } = req.body;
    const sessionId = Date.now().toString();

    // Вопросы для разных режимов
    const questions = {
        planner: {
            id: "theme",
            text: "Какая тема мероприятия?",
            type: "text",
        },
        evaluator: {
            id: "plan",
            text: "Опишите кратко план мероприятия:",
            type: "text",
        },
        constructor: {
            id: "audience",
            text: "Для какой аудитории планируется мероприятие?",
            type: "options",
            options: [
                { value: "kids", label: "Дети (7-10 лет)" },
                { value: "teens", label: "Подростки (11-15 лет)" },
                { value: "adults", label: "Взрослые" },
                { value: "seniors", label: "Пенсионеры" },
            ],
        },
    };

    sessions.set(sessionId, {
        mode,
        answers: {},
        currentQuestion: questions[mode],
    });

    res.json({
        sessionId,
        firstQuestion: questions[mode],
    });
});

// Ответ на вопрос
app.post("/api/answer", (req, res) => {
    const { sessionId, questionId, answer } = req.body;
    const session = sessions.get(sessionId);

    if (!session) {
        return res.status(404).json({ error: "Сессия не найдена" });
    }

    // Сохраняем ответ
    session.answers[questionId] = answer;

    // Для демо — завершаем после первого вопроса
    res.json({
        completed: true,
        result: {
            message: "Спасибо за ответы!",
            answers: session.answers,
        },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
