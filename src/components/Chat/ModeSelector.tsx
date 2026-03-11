// components/Chat/ModeSelector.jsx
import React from "react";
import styled from "styled-components";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Container,
} from "@mui/material";
import {
    Edit as EditIcon,
    Assessment as AssessmentIcon,
    Build as BuildIcon,
} from "@mui/icons-material";

const ModeCard = styled(Card)`
    height: 100%;
    display: flex;
    flex-direction: column;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
`;

const IconWrapper = styled.div`
    font-size: 3rem;
    color: #2c3e50;
    margin-bottom: 16px;
`;

const modes = [
    {
        id: "planner",
        title: "Помощник в планировании",
        description:
            "Поможет спланировать мероприятие шаг за шагом, задавая наводящие вопросы",
        icon: <EditIcon sx={{ fontSize: 48 }} />,
    },
    {
        id: "evaluator",
        title: "Оценщик качества",
        description:
            "Проанализирует готовый план и укажет на возможные проблемы",
        icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
    },
    {
        id: "constructor",
        title: "Конструктор форматов",
        description: "Подберет подходящие форматы мероприятий под ваши задачи",
        icon: <BuildIcon sx={{ fontSize: 48 }} />,
    },
];

const ModeSelector = ({ onSelect }) => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Выберите режим работы
            </Typography>
            <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                paragraph
            >
                Я помогу вам создать качественное библиотечное мероприятие
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {modes.map((mode) => (
                    <Grid item xs={12} md={4} key={mode.id}>
                        <ModeCard onClick={() => onSelect(mode.id)}>
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    p: 3,
                                }}
                            >
                                <IconWrapper>{mode.icon}</IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    {mode.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {mode.description}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(mode.id);
                                    }}
                                >
                                    Выбрать
                                </Button>
                            </CardContent>
                        </ModeCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ModeSelector;
