// components/Chat/ResultCard.jsx
import React from "react";
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
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const ResultCard = ({ result }) => {
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plan.json";
        a.click();
    };

    const renderFormats = (formats, title) => {
        if (!formats || formats.length === 0) return null;

        return (
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {formats.map((format, index) => (
                        <Card
                            key={index}
                            variant="outlined"
                            sx={{ mb: 2, p: 2 }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>{format.name}</strong>
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {format.description}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                    mb: 1,
                                }}
                            >
                                {format.tags?.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Пример:</strong> {format.example}
                            </Typography>
                        </Card>
                    ))}
                </AccordionDetails>
            </Accordion>
        );
    };

    if (result.all) {
        // Режим конструктора
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Подходящие форматы мероприятий
                    </Typography>

                    {renderFormats(result.easy, "🌟 Простые в реализации")}
                    {renderFormats(result.medium, "📚 Средней сложности")}
                    {renderFormats(result.complex, "🎯 Требуют подготовки")}

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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

    if (result.plan) {
        // Режим планировщика
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        План мероприятия
                    </Typography>
                    <ReactMarkdown>{result.plan}</ReactMarkdown>
                </CardContent>
            </Card>
        );
    }

    return null;
};

export default ResultCard;
