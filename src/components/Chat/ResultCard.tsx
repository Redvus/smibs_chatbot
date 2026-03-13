// src/components/Chat/ResultCard.tsx
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Box,
    Button
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Download as DownloadIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import type { Format, FormatsByComplexity } from '../../types';

interface ResultCardProps {
    result: FormatsByComplexity | Record<string, any> | string | null;
}

// Тип для формата с возможными дополнительными полями
interface ExtendedFormat extends Format {
    tags?: string[];
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plan.json';
        a.click();
    };

    // Функция для безопасного преобразования в строку
    const safeString = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    // Проверка, является ли результат объектом с форматами
    const isFormatsResult = (res: any): res is FormatsByComplexity => {
        return res && typeof res === 'object' && ('easy' in res || 'medium' in res || 'hard' in res || 'all' in res);
    };

    const renderFormats = (formats: ExtendedFormat[] | undefined, title: string): React.ReactNode => {
        if (!formats || formats.length === 0) return null;

        return (
            <Accordion key={title}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {formats.map((format: ExtendedFormat, index: number) => (
                        <Card key={`${format.id}-${index}`} variant="outlined" sx={{ mb: 2, p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>{safeString(format.name)}</strong>
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {safeString(format.description)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                {format.tags?.map((tag: string, tagIndex: number) => (
                                    <Chip
                                        key={`${tag}-${tagIndex}`}
                                        label={safeString(tag)}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Пример:</strong> {safeString(format.example)}
                            </Typography>
                        </Card>
                    ))}
                </AccordionDetails>
            </Accordion>
        );
    };

    // Если результат - null или undefined
    if (!result) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="body1">Нет данных для отображения</Typography>
                </CardContent>
            </Card>
        );
    }

    // Если результат - объект с форматами (режим конструктора)
    if (isFormatsResult(result)) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Подходящие форматы мероприятий
                    </Typography>

                    {renderFormats(result.easy, '🌟 Простые в реализации')}
                    {renderFormats(result.medium, '📚 Средней сложности')}
                    {renderFormats(result.hard, '🎯 Требуют подготовки')}
                    {renderFormats(result.all, '📋 Все форматы')}

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={() => window.print()}
                        >
                            Печать
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Если результат - строка или другой тип
    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Результат
                </Typography>
                <ReactMarkdown>
                    {safeString(result)}
                </ReactMarkdown>
            </CardContent>
        </Card>
    );
};

export default ResultCard;