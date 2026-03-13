// src/components/Chat/ModeSelector.tsx
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    Container,
    Paper
} from '@mui/material';
import {
    Edit as EditIcon,
    Assessment as AssessmentIcon,
    Build as BuildIcon
} from '@mui/icons-material';
import type { BotMode } from '../../types';

interface ModeSelectorProps {
    onSelect: (mode: BotMode) => void;
}

interface ModeOption {
    id: BotMode;
    title: string;
    description: string;
    icon: React.ReactElement;
}

const modes: ModeOption[] = [
    {
        id: 'planner',
        title: 'Помощник в планировании',
        description: 'Поможет спланировать мероприятие шаг за шагом, задавая наводящие вопросы',
        icon: <EditIcon sx={{ fontSize: 48 }} />
    },
    {
        id: 'evaluator',
        title: 'Оценщик качества',
        description: 'Проанализирует готовый план и укажет на возможные проблемы',
        icon: <AssessmentIcon sx={{ fontSize: 48 }} />
    },
    {
        id: 'constructor',
        title: 'Конструктор форматов',
        description: 'Подберет подходящие форматы мероприятий под ваши задачи',
        icon: <BuildIcon sx={{ fontSize: 48 }} />
    }
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Библиотечный помощник
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" paragraph>
                    Я помогу вам создать качественное библиотечное мероприятие
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {modes.map((mode) => (
                        <Grid key={mode.id} size={{ xs: 12, md: 4 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => onSelect(mode.id)}
                            >
                                <CardContent sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3
                                }}>
                                    <Box sx={{
                                        fontSize: '3rem',
                                        color: 'primary.main',
                                        mb: 2,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {mode.icon}
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {mode.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {mode.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(mode.id);
                                        }}
                                        sx={{ mt: 'auto' }}
                                    >
                                        Выбрать
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default ModeSelector;