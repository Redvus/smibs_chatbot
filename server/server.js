// server/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// База знаний библиотекаря
const knowledgeBase = {
    audiences: {
        kids: {
            name: "дети (7-10 лет)",
            characteristics: [
                "любят игры",
                "короткая концентрация внимания",
                "нуждаются в наглядности",
            ],
            tips: [
                "используйте яркие картинки",
                "чередуйте активность каждые 10-15 минут",
                "добавьте элементы сказки",
            ],
        },
        teens: {
            name: "подростки (11-15 лет)",
            characteristics: [
                "стремятся к самостоятельности",
                "интересуются современными темами",
                "любят соревнования",
            ],
            tips: [
                "используйте современные форматы (квизы, квесты)",
                "дайте возможность высказаться",
                "добавьте элементы геймификации",
            ],
        },
        youth: {
            name: "молодежь (16-25 лет)",
            characteristics: [
                "активные пользователи соцсетей",
                "ценят визуальный контент",
                "интересуются саморазвитием",
            ],
            tips: [
                "сделайте фото-зону",
                "предложите контент для сторис",
                "обсуждайте актуальные темы",
            ],
        },
        adults: {
            name: "взрослые",
            characteristics: [
                "ценят практическую пользу",
                "ограничены во времени",
                "имеют жизненный опыт",
            ],
            tips: [
                "фокусируйтесь на практических навыках",
                "укладывайтесь в 1-1.5 часа",
                "давайте материалы для самостоятельного изучения",
            ],
        },
        seniors: {
            name: "пенсионеры",
            characteristics: [
                "располагают временем",
                "ценят общение",
                "могут иметь особенности здоровья",
            ],
            tips: [
                "проводите в первой половине дня",
                "обеспечьте комфортные условия (стулья, освещение)",
                "давайте время на вопросы",
            ],
        },
    },

    // 👇 СЕЗОННЫЕ РЕКОМЕНДАЦИИ - добавляем сюда
    seasonal: {
        winter: {
            name: "зима",
            months: ["декабрь", "январь", "февраль"],
            tips: [
                "создайте уютную атмосферу с теплым освещением",
                "предложите горячий чай и угощения",
                "используйте новогоднюю/зимнюю тематику в оформлении",
                "проводите мероприятия в теплом помещении",
                'сделайте акцент на "зимних" книгах и сказках',
            ],
            formats: [
                "мастер-классы по созданию новогодних открыток",
                "зимние квесты",
                "рождественские чтения",
            ],
        },
        spring: {
            name: "весна",
            months: ["март", "апрель", "май"],
            tips: [
                "используйте весенние праздники (8 марта, Масленица)",
                "проводите мероприятия на свежем воздухе (если погода позволяет)",
                "сделайте акцент на обновлении, цветах, природе",
                "организуйте субботники или экологические акции",
            ],
            formats: [
                "поделки к праздникам",
                "экологические квесты",
                "поэтические вечера о весне",
            ],
        },
        summer: {
            name: "лето",
            months: ["июнь", "июль", "август"],
            tips: [
                "максимально используйте уличные площадки",
                "проводите мероприятия в утренние или вечерние часы (не в жару)",
                "организуйте летние читальные залы под открытым небом",
                "делайте акцент на легких, развлекательных форматах",
                "привлекайте детей на каникулах",
            ],
            formats: [
                "летние читальни",
                "квесты на улице",
                "пикники с книгами",
                "кинопоказы под открытым небом",
            ],
        },
        autumn: {
            name: "осень",
            months: ["сентябрь", "октябрь", "ноябрь"],
            tips: [
                'создайте уютную атмосферу "золотой осени"',
                "используйте осенние праздники (День знаний, День учителя)",
                "проводите мероприятия в помещении с хорошим освещением",
                "сделайте акцент на новых знаниях и учебном годе",
            ],
            formats: [
                "праздники первого звонка",
                "осенние балы",
                "литературные гостиные",
                "выставки урожая",
            ],
        },
    },

    formats: {
        quest: {
            name: "Библиотечный квест",
            description: "Командная игра с поиском книг и решением головоломок",
            suitableFor: ["kids", "teens", "youth"],
            preparation:
                "нужно подготовить маршрутные листы, задания, спрятать подсказки",
            duration: "1-1.5 часа",
        },
        quiz: {
            name: "Литературный квиз",
            description: "Интеллектуальная викторина с вопросами о книгах",
            suitableFor: ["teens", "youth", "adults"],
            preparation:
                "подготовить вопросы, презентацию, разделить на команды",
            duration: "45-60 минут",
        },
        lecture: {
            name: "Лекция с презентацией",
            description: "Познавательное выступление с визуальным рядом",
            suitableFor: ["adults", "seniors", "professionals"],
            preparation: "подготовить презентацию, раздаточные материалы",
            duration: "1-1.5 часа",
        },
        masterclass: {
            name: "Творческий мастер-класс",
            description: "Практическое занятие по созданию чего-либо",
            suitableFor: ["kids", "teens", "adults"],
            preparation:
                "закупить материалы, подготовить образцы, продумать каждый шаг",
            duration: "1.5-2 часа",
        },
        discussion: {
            name: "Дискуссионный клуб",
            description: "Обсуждение актуальной темы или книги",
            suitableFor: ["youth", "adults", "seniors"],
            preparation:
                "подобрать материалы для обсуждения, подготовить вопросы модератора",
            duration: "1.5-2 часа",
        },
    },

    goals: {
        education: "обучение и просвещение",
        entertainment: "развлечение и досуг",
        attraction: "привлечение новых читателей",
        discussion: "обмен мнениями и диалог",
    },
};

// Функция для определения текущего сезона
function getCurrentSeason() {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) return "spring"; // март-май
    if (month >= 5 && month <= 7) return "summer"; // июнь-август
    if (month >= 8 && month <= 10) return "autumn"; // сентябрь-ноябрь
    return "winter"; // декабрь-февраль
}

// Функция для генерации плана мероприятия (обновленная с учетом сезона)
function generatePlan(answers) {
    const { theme, audience, goal, duration, resources } = answers;

    // Получаем информацию об аудитории
    const audienceInfo = knowledgeBase.audiences[audience] || {
        name: "выбранная аудитория",
        characteristics: [],
        tips: ["учтите возрастные особенности"],
    };

    // 👇 ПОЛУЧАЕМ СЕЗОННЫЕ РЕКОМЕНДАЦИИ
    const currentSeason = getCurrentSeason();
    const seasonInfo =
        knowledgeBase.seasonal[currentSeason] || knowledgeBase.seasonal.winter;

    // Подбираем подходящие форматы
    const suitableFormats = Object.values(knowledgeBase.formats)
        .filter((format) => format.suitableFor.includes(audience))
        .map((f) => f.name)
        .join(", ");

    // Определяем длительность
    const durationMap = {
        "30min": "30 минут",
        "1hour": "1 час",
        "2hours": "1.5-2 часа",
        more: "более 2 часов",
    };

    const durationText = durationMap[duration] || duration;

    // Формируем рекомендации по ресурсам
    let resourcesList = [];
    if (resources && Array.isArray(resources)) {
        const resourceMap = {
            projector: "проектор для презентаций",
            computers: "компьютеры/ноутбуки",
            craft: "материалы для творчества",
            books: "книжный фонд библиотеки",
            space: "просторное помещение",
        };
        resourcesList = resources.map((r) => resourceMap[r] || r);
    }

    // Генерируем структуру мероприятия
    let structure = [];
    switch (duration) {
        case "30min":
            structure = [
                "Вступление (5 мин) - представление темы",
                "Основная часть (20 мин) - ключевой материал",
                "Заключение (5 мин) - вопросы и обратная связь",
            ];
            break;
        case "1hour":
            structure = [
                "Вступление (5-7 мин) - знакомство с темой",
                "Основная часть (40 мин) - интерактивная работа",
                "Заключение (10-15 мин) - обсуждение, вопросы",
            ];
            break;
        default:
            structure = [
                "Вступление (10 мин) - создание настроения",
                "Основная часть (60-80 мин) - с перерывом на активности",
                "Заключение (15-20 мин) - подведение итогов, планы на будущее",
            ];
    }

    // 👇 ДОБАВЛЯЕМ СЕЗОННЫЕ РЕКОМЕНДАЦИИ В ОБЩИЙ СПИСОК
    const allRecommendations = [
        `Для ${audienceInfo.name}: ${audienceInfo.tips.join("; ")}`,
        `Рекомендуемые форматы: ${suitableFormats || "зависит от ваших целей"}`,
        resourcesList.length > 0
            ? `Используйте доступные ресурсы: ${resourcesList.join(", ")}`
            : "Определите доступные ресурсы",
        `Запланируйте мероприятие на удобное для ${audienceInfo.name} время`,
        `🌤 Сезонные рекомендации (${seasonInfo.name}): ${seasonInfo.tips.join("; ")}`,
        seasonInfo.formats.length > 0
            ? `Актуальные форматы для сезона: ${seasonInfo.formats.join(", ")}`
            : "",
    ].filter((r) => r); // убираем пустые строки

    // Собираем итоговый план
    const plan = {
        title: theme,
        audience: audienceInfo.name,
        goal: knowledgeBase.goals[goal] || goal,
        duration: durationText,
        suitableFormats: suitableFormats || "различные форматы",
        recommendations: allRecommendations,
        structure: structure,
        checklist: [
            "✓ Подготовить сценарий",
            "✓ Подобрать материалы и реквизит",
            "✓ Протестировать оборудование",
            "✓ Подготовить раздаточные материалы",
            "✓ Сделать анонс в соцсетях",
            "✓ Продумать фотоотчет",
            `✓ Учесть сезонные особенности (${seasonInfo.name})`,
        ],
    };

    return plan;
}

// Функция для форматирования плана в читаемый текст
function formatPlanAsText(plan) {
    return `
## 📋 План мероприятия: "${plan.title}"

### 👥 Аудитория
**${plan.audience}**

### 🎯 Цель
${plan.goal}

### ⏱ Длительность
${plan.duration}

### 📊 Подходящие форматы
${plan.suitableFormats}

### 💡 Рекомендации
${plan.recommendations.map((r) => `- ${r}`).join("\n")}

### 📝 Примерная структура
${plan.structure.map((s) => `- ${s}`).join("\n")}

### ✅ Чек-лист подготовки
${plan.checklist.map((c) => `- ${c}`).join("\n")}

---
*План сгенерирован автоматически с учетом текущего сезона (${new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}). Адаптируйте под свои условия!*
  `;
}

// Вопросы для режима планирования
const plannerQuestions = [
    {
        id: "theme",
        text: "Какая тема мероприятия?",
        type: "text",
        next: "audience",
    },
    {
        id: "audience",
        text: "Для какой аудитории?",
        type: "options",
        options: [
            { value: "kids", label: "Дети (7-10 лет)" },
            { value: "teens", label: "Подростки (11-15 лет)" },
            { value: "youth", label: "Молодежь (16-25 лет)" },
            { value: "adults", label: "Взрослые" },
            { value: "seniors", label: "Пенсионеры" },
        ],
        next: "goal",
    },
    {
        id: "goal",
        text: "Какая цель мероприятия?",
        type: "options",
        options: [
            { value: "education", label: "Образовательная" },
            { value: "entertainment", label: "Развлекательная" },
            { value: "attraction", label: "Привлечение читателей" },
            { value: "discussion", label: "Дискуссионная" },
        ],
        next: "duration",
    },
    {
        id: "duration",
        text: "Сколько времени есть на проведение?",
        type: "options",
        options: [
            { value: "30min", label: "30 минут" },
            { value: "1hour", label: "1 час" },
            { value: "2hours", label: "1.5-2 часа" },
            { value: "more", label: "Больше 2 часов" },
        ],
        next: "resources",
    },
    {
        id: "resources",
        text: "Какие ресурсы доступны? (можно выбрать несколько)",
        type: "multiple",
        options: [
            { value: "projector", label: "Проектор" },
            { value: "computers", label: "Компьютеры" },
            { value: "craft", label: "Материалы для творчества" },
            { value: "books", label: "Книжный фонд" },
            { value: "space", label: "Большое помещение" },
        ],
        next: null,
    },
];

// Хранилище сессий
const sessions = new Map();

// Начало диалога
app.post("/api/start", (req, res) => {
    const { mode } = req.body;
    const sessionId = Date.now().toString();

    let questions;
    if (mode === "planner") {
        questions = plannerQuestions;
    } else {
        // Заглушки для других режимов
        questions = [
            {
                id: "temp",
                text: 'Этот режим пока в разработке. Выберите "Помощник в планировании"',
                type: "text",
                next: null,
            },
        ];
    }

    const firstQuestion = questions[0];

    sessions.set(sessionId, {
        mode,
        answers: {},
        currentQuestionIndex: 0,
        questions,
    });

    res.json({ sessionId, firstQuestion });
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

    // Переходим к следующему вопросу
    const currentIndex = session.currentQuestionIndex;
    const nextIndex = currentIndex + 1;

    if (nextIndex < session.questions.length) {
        // Есть еще вопросы
        const nextQuestion = session.questions[nextIndex];
        session.currentQuestionIndex = nextIndex;

        res.json({
            completed: false,
            question: nextQuestion,
        });
    } else {
        // Вопросы закончились - генерируем результат
        let result;

        if (session.mode === "planner") {
            const plan = generatePlan(session.answers);
            result = formatPlanAsText(plan);
        } else {
            result = {
                message: "Спасибо за ответы!",
                answers: session.answers,
            };
        }

        res.json({
            completed: true,
            result,
        });
    }
});

export default app;

// А для локальной разработки порт можно слушать условно:
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
}

// app.listen(PORT, () => {
//     console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
// });
