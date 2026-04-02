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
        book_tasting: {
            name: "Книжное дегустация",
            description:
                'Быстрое знакомство с новыми книгами по принципу "попробуй, прежде чем читать"',
            suitableFor: ["teens", "youth", "adults"],
            preparation: "подобрать 10-15 книг, подготовить короткие аннотации",
            duration: "45-60 минут",
        },
        book_crossing: {
            name: "Буккроссинг",
            description: "Обмен книгами между читателями",
            suitableFor: ["adults", "seniors"],
            preparation: "организовать зону обмена, подготовить правила",
            duration: "можно проводить постоянно",
        },
        poetry_slam: {
            name: "Поэтический слэм",
            description: "Соревновательное чтение стихов",
            suitableFor: ["youth"],
            preparation: "найти ведущего, подготовить сцену",
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

// Ключевые слова для определения типа мероприятия
const eventKeywords = {
    quest: {
        keywords: [
            "квест",
            "поиск",
            "приключение",
            "тайна",
            "загадка",
            "путешествие",
        ],
        structure: [
            "Вступление (5 мин) - легенда квеста",
            "Основная часть (40 мин) - прохождение станций с заданиями",
            "Финал (10 мин) - поиск клада/ответа, награждение",
        ],
        tips: [
            "Подготовьте маршрутные листы",
            "Спрячьте подсказки в книгах",
            "Сделайте финальный приз",
        ],
    },
    lecture: {
        keywords: ["лекция", "рассказ", "презентация", "история", "биография"],
        structure: [
            "Вступление (5 мин) - почему эта тема важна",
            "Основная часть (40 мин) - лекция с презентацией",
            "Вопросы-ответы (10 мин) - обсуждение",
        ],
        tips: [
            "Подготовьте наглядные материалы",
            "Сделайте раздаточные памятки",
            "Запланируйте время для вопросов",
        ],
    },
    masterclass: {
        keywords: [
            "мастер-класс",
            "сделать",
            "творчество",
            "рукоделие",
            "своими руками",
        ],
        structure: [
            "Вступление (5 мин) - показ готового изделия",
            "Инструктаж (5 мин) - техника безопасности, материалы",
            "Практическая часть (60 мин) - создание поделки",
            "Презентация (10 мин) - показ результатов",
        ],
        tips: [
            "Подготовьте все материалы заранее",
            "Сделайте образец для примера",
            "Продумайте помощь отстающим",
        ],
    },
    discussion: {
        keywords: ["дискуссия", "обсуждение", "спор", "дебаты", "круглый стол"],
        structure: [
            "Вступление (5 мин) - тема и правила дискуссии",
            "Основная часть (40 мин) - обмен мнениями",
            "Подведение итогов (10 мин) - резюме модератора",
        ],
        tips: [
            "Назначьте модератора",
            "Подготовьте provocative вопросы",
            "Записывайте основные тезисы",
        ],
    },
    holiday: {
        keywords: [
            "праздник",
            "утренник",
            "новый год",
            "рождество",
            "мероприятие",
        ],
        structure: [
            "Открытие (5 мин) - поздравление",
            "Игровая программа (30 мин) - конкурсы, викторины",
            "Сладкий стол (15 мин) - чаепитие",
            "Закрытие (5 мин) - вручение подарков",
        ],
        tips: [
            "Подготовьте реквизит для игр",
            "Сделайте праздничное оформление",
            "Продумайте музыкальное сопровождение",
        ],
    },
    // В eventKeywords добавить:
    contest: {
        keywords: [
            "конкурс",
            "чтецов",
            "соревнование",
            "турнир",
            "олимпиада",
            "фестиваль",
        ],
        structure: [
            "Открытие (5 мин) - представление жюри и участников",
            "Основная часть (40-60 мин) - выступления участников",
            "Работа жюри (10 мин) - подведение итогов",
            "Награждение (10 мин) - вручение дипломов и призов",
            "Фотосессия (5 мин) - памятные фотографии",
        ],
        tips: [
            "Подготовьте дипломы и призы для участников",
            "Пригласите компетентное жюри (учителя, писатели, библиотекари)",
            "Сделайте программу выступлений для зрителей",
            "Организуйте фото-зону для победителей",
            "Продумайте музыкальное сопровождение",
        ],
    },
};

// Ключевые слова для валидации темы (библиотечные мероприятия)
const validThemeKeywords = [
    // Мероприятия
    "квест",
    "викторина",
    "квиз",
    "лекция",
    "мастер-класс",
    "конкурс",
    "выставка",
    "праздник",
    "утренник",
    "фестиваль",
    "концерт",
    "спектакль",
    "игра",
    "библиотечный урок",
    "урок",
    "экскурсия",
    "путешествие",
    "встреча",

    // Книжные термины
    "книга",
    "сказка",
    "рассказ",
    "поэзия",
    "стихи",
    "литература",
    "писатель",
    "поэт",
    "чтение",
    "читатель",
    "библиотека",
    "книжный",
    "журнал",

    // Популярные темы
    "пушкин",
    "лермонтов",
    "чехов",
    "толстой",
    "достоевский",
    "гоголь",
    "приключения",
    "детектив",
    "фантастика",
    "сказки",
    "басни",
    "былины",

    // Праздники и события
    "новый год",
    "рождество",
    "масленица",
    "8 марта",
    "23 февраля",
    "день победы",
    "день защиты детей",
    "день знаний",
    "день библиотек",
];

function isValidTheme(theme) {
    const lowerTheme = theme.toLowerCase();

    // Список стоп-слов, которые точно не являются библиотечной темой
    const stopWords = [
        "привет",
        "здравствуйте",
        "тест",
        "test",
        "sdfsdf",
        "asdasd",
    ];

    for (const word of stopWords) {
        if (lowerTheme.includes(word)) {
            return false;
        }
    }

    // Проверяем длину
    if (theme.trim().length < 3) {
        return false;
    }

    // Проверяем по ключевым словам
    for (const keyword of validThemeKeywords) {
        if (lowerTheme.includes(keyword.toLowerCase())) {
            return true;
        }
    }

    return false;
}

// Функция для получения подсказок на основе ввода
function getSuggestions(input) {
    const lowerInput = input.toLowerCase();
    const suggestions = [];

    // Ищем похожие темы
    for (const keyword of validThemeKeywords) {
        if (
            keyword.toLowerCase().includes(lowerInput) ||
            lowerInput.includes(keyword.toLowerCase())
        ) {
            suggestions.push(keyword);
        }
    }

    if (suggestions.length > 0) {
        return `\n\n**Возможно, вы имели в виду:** ${suggestions.slice(0, 3).join(", ")}?`;
    }

    return "";
}

function getThemeErrorMessage(theme) {
    const suggestions = getSuggestions(theme);

    return `
❌ **Тема не распознана**

Мы не смогли определить тему мероприятия "${theme}".

Пожалуйста, уточните тему. Ваш запрос должен содержать ключевые слова, связанные с библиотечными мероприятиями.

**Примеры тем:**
- Библиотечный квест
- Литературная викторина
- Пушкинский день
- Мастер-класс по каллиграфии
- Новогодний утренник

**Совет:** Используйте слова: квест, викторина, лекция, конкурс, праздник, книга, чтение, писатель.
${suggestions}

---
*Нажмите кнопку "Начать заново", чтобы попробовать снова.*
    `;
}

// Функция определения типа мероприятия по теме
function detectEventType(theme) {
    const lowerTheme = theme.toLowerCase();

    for (const [type, data] of Object.entries(eventKeywords)) {
        for (const keyword of data.keywords) {
            if (lowerTheme.includes(keyword)) {
                return type;
            }
        }
    }
    return "lecture"; // тип по умолчанию
}

// Оценщик качества
const evaluatorQuestions = [
    {
        id: "plan",
        text: "Введите описание вашего мероприятия:",
        type: "text",
        next: "audience",
    },
    {
        id: "audience",
        text: "Для какой аудитории?",
        type: "options",
        options: [
            { value: "kids", label: "Дети" },
            { value: "teens", label: "Подростки" },
            { value: "adults", label: "Взрослые" },
        ],
        next: "format",
    },
    {
        id: "format",
        text: "Какой формат мероприятия?",
        type: "options",
        options: [
            { value: "lecture", label: "Лекция" },
            { value: "quest", label: "Квест" },
            { value: "quiz", label: "Квиз" },
        ],
        next: null,
    },
];

// Конструктор форматов
const constructorQuestions = [
    {
        id: "audience",
        text: "Для какой аудитории?",
        type: "options",
        options: [
            { value: "kids", label: "Дети" },
            { value: "teens", label: "Подростки" },
            { value: "adults", label: "Взрослые" },
        ],
        next: "goal",
    },
    {
        id: "goal",
        text: "Какая цель?",
        type: "options",
        options: [
            { value: "education", label: "Обучение" },
            { value: "entertainment", label: "Развлечение" },
        ],
        next: "duration",
    },
    {
        id: "duration",
        text: "Сколько времени?",
        type: "options",
        options: [
            { value: "30min", label: "30 минут" },
            { value: "1hour", label: "1 час" },
        ],
        next: null,
    },
];

// Функция для определения текущего сезона
function getCurrentSeason() {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) return "spring"; // март-май
    if (month >= 5 && month <= 7) return "summer"; // июнь-август
    if (month >= 8 && month <= 10) return "autumn"; // сентябрь-ноябрь
    return "winter"; // декабрь-февраль
}

function generatePlan(answers) {
    const { eventType, theme, audience, goal, duration, resources } = answers;

    // Используем выбранный тип мероприятия
    const typeData = eventKeywords[eventType] || eventKeywords.lecture;

    // Формируем название темы (если пользователь ввёл)
    const themeTitle =
        theme && theme.trim() !== ""
            ? `"${theme}"`
            : `мероприятие типа ${typeData.name || eventType}`;

    // Получаем информацию об аудитории
    const audienceInfo = knowledgeBase.audiences[audience] || {
        name: "выбранная аудитория",
        characteristics: [],
        tips: ["учтите возрастные особенности"],
    };

    // Получаем сезонные рекомендации
    const currentSeason = getCurrentSeason();
    const seasonInfo = knowledgeBase.seasonal[currentSeason];

    // Формируем список ресурсов
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

    // Определяем длительность текстом
    const durationMap = {
        "30min": "30 минут",
        "1hour": "1 час",
        "2hours": "1.5-2 часа",
        more: "более 2 часов",
    };
    const durationText = durationMap[duration] || duration;

    // Структура из выбранного типа
    let structure = typeData
        ? [...typeData.structure]
        : [
              "Вступление (5-7 мин) - знакомство с темой",
              "Основная часть (40 мин) - интерактивная работа",
              "Заключение (10-15 мин) - обсуждение, вопросы",
          ];

    // Адаптируем структуру под длительность
    if (duration === "30min") {
        structure = structure.map((s) =>
            s.replace("40 мин", "20 мин").replace("60 мин", "20 мин"),
        );
    } else if (duration === "2hours") {
        structure = structure.map((s) =>
            s.replace("40 мин", "60 мин").replace("20 мин", "30 мин"),
        );
    }

    // Подходящие форматы
    const suitableFormats =
        Object.values(knowledgeBase.formats)
            .filter((format) => format.suitableFor.includes(audience))
            .map((f) => f.name)
            .join(", ") || "различные форматы";

    // Собираем рекомендации
    const allRecommendations = [
        `Для ${audienceInfo.name}: ${audienceInfo.tips.join("; ")}`,
        typeData
            ? `Советы для этого формата: ${typeData.tips.join("; ")}`
            : null,
        resourcesList.length > 0
            ? `Используйте доступные ресурсы: ${resourcesList.join(", ")}`
            : "Определите доступные ресурсы",
        `Запланируйте мероприятие на удобное для ${audienceInfo.name} время`,
        `🌤 Сезонные рекомендации (${seasonInfo.name}): ${seasonInfo.tips.join("; ")}`,
    ].filter((r) => r);

    // Формируем итоговый план
    const plan = {
        title: themeTitle,
        type: eventType,
        audience: audienceInfo.name,
        goal: knowledgeBase.goals[goal] || goal,
        duration: durationText,
        suitableFormats: suitableFormats,
        structure: structure,
        recommendations: allRecommendations,
        checklist: [
            "✓ Подготовить сценарий",
            typeData
                ? `✓ ${typeData.tips[0] || "Подготовить материалы"}`
                : "✓ Подобрать материалы",
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
## 📋 План мероприятия: ${plan.title}

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

// Функция для оценки качества
function formatEvaluation(answers) {
    const { plan, audience, format } = answers;

    return `
## 📋 Оценка мероприятия

### 📝 Описание
${plan}

### ✅ Анализ
- **Аудитория**: ${audience === "kids" ? "Дети" : audience === "teens" ? "Подростки" : "Взрослые"}
- **Формат**: ${format === "lecture" ? "Лекция" : format === "quest" ? "Квест" : "Квиз"}

### 💡 Рекомендации
- Убедитесь, что формат соответствует возрасту аудитории
- Добавьте интерактивные элементы
- Подготовьте раздаточные материалы

---
*Оценка сгенерирована автоматически*
    `;
}

// Функция для конструктора форматов
function formatFormats(answers) {
    const { audience, goal, duration } = answers;

    const audienceName =
        audience === "kids"
            ? "Детей"
            : audience === "teens"
              ? "Подростков"
              : "Взрослых";
    const goalName = goal === "education" ? "обучения" : "развлечения";

    return `
## 🎯 Конструктор форматов

### Параметры:
- **Аудитория**: ${audienceName}
- **Цель**: ${goalName}
- **Длительность**: ${duration === "30min" ? "30 минут" : "1 час"}

### 📊 Рекомендуемые форматы:
${getRecommendedFormats(audience, goal, duration)}

---
*Подберите подходящий формат под ваши задачи*
    `;
}

function getRecommendedFormats(audience, goal, duration) {
    const formats = [];

    if (audience === "kids") {
        formats.push("- 🎮 **Игровая программа** - подходит для детей");
        if (goal === "education")
            formats.push(
                "- 📚 **Литературный час** - развитие интереса к чтению",
            );
    } else if (audience === "teens") {
        formats.push("- 🧠 **Квиз** - проверка знаний в игровой форме");
        formats.push("- 🔍 **Квест** - командное приключение");
    } else {
        formats.push("- 🎤 **Лекция** - глубокое погружение в тему");
        formats.push("- 💬 **Дискуссионный клуб** - обмен мнениями");
    }

    if (duration === "30min") {
        formats.push("  *Компактная версия, подходит для быстрого формата*");
    }

    return formats.join("\n");
}

// Вопросы для режима планирования
const plannerQuestions = [
    {
        id: "eventType",
        text: "Какой тип мероприятия вы планируете?",
        type: "options",
        options: [
            { value: "quest", label: "🎯 Квест / игра-путешествие" },
            { value: "quiz", label: "🧠 Квиз / викторина" },
            { value: "lecture", label: "📚 Лекция / презентация" },
            { value: "masterclass", label: "🎨 Мастер-класс / творчество" },
            { value: "discussion", label: "💬 Дискуссия / круглый стол" },
            { value: "holiday", label: "🎉 Праздник / утренник" },
            { value: "contest", label: "🏆 Конкурс / соревнование" },
        ],
        next: "theme",
    },
    {
        id: "theme",
        text: "Уточните тему мероприятия (например, 'Пушкин', 'космос', 'экология'):",
        type: "text",
        next: "audience",
        description: "Это поможет сделать план более персонализированным",
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
    } else if (mode === "evaluator") {
        questions = evaluatorQuestions;
    } else if (mode === "constructor") {
        questions = constructorQuestions;
    } else {
        questions = [
            {
                id: "temp",
                text: 'Неизвестный режим. Выберите "Помощник в планировании"',
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
// Ответ на вопрос
app.post("/api/answer", (req, res) => {
    const { sessionId, questionId, answer } = req.body;
    const session = sessions.get(sessionId);

    if (!session) {
        return res.status(404).json({ error: "Сессия не найдена" });
    }

    // Сохраняем ответ
    session.answers[questionId] = answer;

    // Проверяем тему, если это первый вопрос
    // if (questionId === "theme") {
    //     if (!isValidTheme(answer)) {
    //         // Тема не подходит — возвращаем ошибку
    //         console.log(`❌ Тема не прошла валидацию: "${answer}"`);
    //         res.json({
    //             completed: true,
    //             result: getThemeErrorMessage(answer), // ← передаём answer
    //         });
    //         return;
    //     }
    //     console.log(`✅ Тема прошла валидацию: "${answer}"`);
    // }

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
        } else if (session.mode === "evaluator") {
            result = formatEvaluation(session.answers);
        } else if (session.mode === "constructor") {
            result = formatFormats(session.answers);
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
