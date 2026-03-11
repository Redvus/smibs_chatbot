// src/components/Chat/Question.tsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button
} from '@mui/material';
import type { Question as QuestionType } from '../../types';

interface QuestionProps {
    question: QuestionType;
    onOptionSelect: (value: any) => void;
    disabled?: boolean;
}

const Question: React.FC<QuestionProps> = ({ question, onOptionSelect, disabled }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedRadio, setSelectedRadio] = useState<string>('');

    const handleChipClick = (value: string) => {
        if (question.type === 'multiple') {
            if (selectedOptions.includes(value)) {
                setSelectedOptions(selectedOptions.filter(v => v !== value));
            } else {
                setSelectedOptions([...selectedOptions, value]);
            }
        } else {
            onOptionSelect(value);
        }
    };

    const handleMultipleSubmit = () => {
        if (selectedOptions.length > 0) {
            onOptionSelect(selectedOptions);
        }
    };

    const renderOptions = () => {
        if (!question.options) return null;

        switch (question.type) {
            case 'options':
                return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {question.options.map((option) => (
                            <Chip
                                key={option.value}
                                label={option.label}
                                onClick={() => handleChipClick(option.value)}
                                color={selectedOptions.includes(option.value) ? 'primary' : 'default'}
                                disabled={disabled}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            />
                        ))}
                    </Box>
                );

            case 'radio':
                return (
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <RadioGroup
                            value={selectedRadio}
                            onChange={(e) => setSelectedRadio(e.target.value)}
                        >
                            {question.options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                    disabled={disabled}
                                />
                            ))}
                        </RadioGroup>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => onOptionSelect(selectedRadio)}
                            disabled={!selectedRadio || disabled}
                        >
                            Далее
                        </Button>
                    </FormControl>
                );

            case 'multiple':
                return (
                    <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {question.options.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={option.label}
                                    onClick={() => handleChipClick(option.value)}
                                    color={selectedOptions.includes(option.value) ? 'primary' : 'default'}
                                    disabled={disabled}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleMultipleSubmit}
                            disabled={selectedOptions.length === 0 || disabled}
                        >
                            Выбрать ({selectedOptions.length})
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Card variant="outlined" sx={{ bgcolor: '#f8f9fa' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {question.text}
                </Typography>
                {question.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {question.description}
                    </Typography>
                )}
                {renderOptions()}
            </CardContent>
        </Card>
    );
};

export default Question;