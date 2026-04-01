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
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Save as SaveIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import type { Format, FormatsByComplexity } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { exportPlanToPDF } from '../../utils/pdfExport';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface ResultCardProps {
    result: FormatsByComplexity | Record<string, any> | string | null;
    onReset?: () => void;  // ← добавить для кнопки "Начать заново"
}

interface ExtendedFormat extends Format {
    tags?: string[];
}

interface SavedPlan {
    id: number;
    title: string;
    date: string;
    content: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Хук для сохранения планов
    const [savedPlans, setSavedPlans] = useLocalStorage<SavedPlan[]>('savedPlans', []);

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

    const showMessage = (message: string) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
        setTimeout(() => setOpenSnackbar(false), 3000);
    };

    const safeString = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    // Проверяем, является ли результат сообщением об ошибке
    const isErrorResult = (res: any): boolean => {
        if (typeof res === 'string') {
            // Проверяем наличие ключевых фраз в сообщении об ошибке
            return res.includes('Тема не распознана') ||
                res.includes('❌ **Тема не распознана**') ||
                res.includes('не удалось определить тему');
        }
        return false;
    };

    const getResultTitle = (res: any): string => {
        if (typeof res === 'string') {
            const titleMatch = res.match(/## 📋 План мероприятия: "(.+?)"/);
            return titleMatch ? titleMatch[1] : 'План мероприятия';
        }
        if (res && typeof res === 'object') {
            return res.title || 'План мероприятия';
        }
        return 'План мероприятия';
    };

    const isFormatsResult = (res: any): res is FormatsByComplexity => {
        return res && typeof res === 'object' && ('easy' in res || 'medium' in res || 'hard' in res || 'all' in res);
    };

    // ========== ОБРАБОТЧИКИ ==========

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plan.json';
        a.click();
        URL.revokeObjectURL(url);
        showMessage('JSON экспортирован');
    };

    const handleExportPDF = async () => {
        if (typeof result === 'string') {
            const title = getResultTitle(result);
            // Ждём, пока элемент отрендерится
            await new Promise(resolve => setTimeout(resolve, 100));
            await exportPlanToPDF('pdf-content', title);
            showMessage('PDF создаётся...');
        } else {
            showMessage('PDF доступен только для текстовых планов');
        }
    };

    const handleSave = () => {
        try {
            const newPlan: SavedPlan = {
                id: Date.now(),
                title: getResultTitle(result),
                date: new Date().toLocaleString('ru-RU'),
                content: result
            };
            setSavedPlans([...savedPlans, newPlan]);
            showMessage('План сохранён!');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            showMessage('Ошибка сохранения');
        }
    };

    // ========== РЕНДЕР ФОРМАТОВ ==========
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

    // ========== ОБЩИЙ БЛОК КНОПОК ==========
    const ActionButtons = () => (
        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} size="small">
                Экспорт JSON
            </Button>
            <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF} size="small">
                Экспорт PDF
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} color="success" size="small">
                Сохранить план
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()} size="small">
                Печать
            </Button>
        </Box>
    );

    // В рендере, перед основным return, добавим проверку на ошибку:
    if (isErrorResult(result)) {
        console.log('🔴 Показываем ошибку валидации');
        return (
            <Card sx={{ mt: 2, border: '1px solid #f44336', backgroundColor: '#ffebee' }}>
                <CardContent>
                    <ReactMarkdown>
                        {safeString(result)}
                    </ReactMarkdown>
                    {onReset && (
                        <Button
                            variant="contained"
                            startIcon={<RestartAltIcon />}
                            onClick={onReset}
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Начать заново
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    // ========== РЕНДЕРИНГ ==========

    if (!result) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="body1">Нет данных для отображения</Typography>
                </CardContent>
            </Card>
        );
    }

    // Режим форматов
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

                    <ActionButtons />

                    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </CardContent>
            </Card>
        );
    }

    // Режим текстового плана (основной)
    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                {/* <Typography variant="h5" gutterBottom>
                    Результат
                </Typography> */}

                <div id="pdf-content" style={{ padding: '4rem', background: 'white' }}>
                    <ReactMarkdown>
                        {safeString(result)}
                    </ReactMarkdown>
                </div>

                <ActionButtons />

                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default ResultCard;