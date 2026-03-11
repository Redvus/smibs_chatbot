// src/data/formats.ts
import type { Format, Audience, Duration, Resource } from '../types';

// Локальный интерфейс для результата фильтрации
interface FilteredFormats {
    easy: Format[];
    medium: Format[];
    hard: Format[];
    all: Format[];
}

export const formats: Record<string, Format[]> = {
    interactive: [
        {
            id: 'quest',
            name: 'Библиотечный квест',
            description: 'Командная игра-путешествие по библиотеке с поиском книг и решением головоломок',
            suitableFor: ['teens', 'youth'],
            duration: ['1hour', '2hours'],
            resources: ['space', 'print'],
            complexity: 'medium',
            tags: ['игра', 'командная', 'активная'],
            example: 'Квест "В поисках потерянной книги" - участники ищут книгу по подсказкам'
        },
        {
            id: 'quiz',
            name: 'Литературный квиз',
            description: 'Интеллектуальная викторина о книгах и писателях',
            suitableFor: ['teens', 'youth', 'adults'],
            duration: ['1hour'],
            resources: ['projector', 'computers'],
            complexity: 'low',
            tags: ['викторина', 'командная'],
            example: 'Квиз "Классики в деталях"'
        }
    ],

    traditional: [
        {
            id: 'lecture',
            name: 'Лекция-презентация',
            description: 'Познавательная лекция с визуальным рядом',
            suitableFor: ['adults', 'seniors', 'professionals'],
            duration: ['1hour', '2hours'],
            resources: ['projector'],
            complexity: 'low',
            tags: ['обучение'],
            example: 'Лекция "История библиотек"'
        }
    ],

    creative: [
        {
            id: 'masterclass',
            name: 'Творческий мастер-класс',
            description: 'Практическое занятие по созданию поделок',
            suitableFor: ['kids', 'teens', 'adults'],
            duration: ['2hours', 'more'],
            resources: ['craft'],
            complexity: 'high',
            tags: ['творчество'],
            example: 'Мастер-класс по каллиграфии'
        }
    ]
};

export const filterFormats = (criteria: {
    audience?: Audience;
    duration?: Duration;
    resources?: Resource[];
    goal?: string;
}): FilteredFormats => {
    const result: FilteredFormats = {
        easy: [],
        medium: [],
        hard: [],
        all: []
    };

    Object.values(formats).forEach(category => {
        category.forEach(format => {
            // Проверка аудитории
            if (criteria.audience &&
                !format.suitableFor.includes(criteria.audience) &&
                !format.suitableFor.includes('all')) {
                return;
            }

            // Проверка длительности
            if (criteria.duration && !format.duration.includes(criteria.duration)) {
                return;
            }

            // Проверка ресурсов
            if (criteria.resources && criteria.resources.length > 0) {
                const hasRequiredResources = criteria.resources.some(r => format.resources.includes(r));
                if (!hasRequiredResources) return;
            }

            // Добавление в группы по сложности
            switch (format.complexity) {
                case 'low':
                    result.easy.push(format);
                    break;
                case 'medium':
                    result.medium.push(format);
                    break;
                case 'high':
                    result.hard.push(format);
                    break;
            }
            result.all.push(format);
        });
    });

    return result;
};

export type { FilteredFormats };