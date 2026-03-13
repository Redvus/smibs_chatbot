// src/components/Chat/ChatBot.tsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Send as SendIcon,
    SmartToy as BotIcon
} from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';
import Message from './Message';
import ModeSelector from './ModeSelector';
import Question from './Question';
import ResultCard from './ResultCard';
import type { BotMode } from '../../types';

// Стилизованные компоненты
const ChatContainer = styled(Paper)`
  max-width: 800px;
  margin: 20px auto;
  height: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
`;

const ChatHeader = styled(Box)`
  background: #2c3e50;
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #34495e;
`;

const MessagesContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputContainer = styled(Box)`
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
`;

const TypingIndicator = styled(Box)`
  display: flex;
  gap: 4px;
  padding: 12px;
  background: #e9ecef;
  border-radius: 18px;
  width: fit-content;

  span {
    width: 8px;
    height: 8px;
    background: #6c757d;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const ChatBot: React.FC = () => {
    const {
        messages,
        loading,
        error,
        sessionId,
        currentQuestion,
        completed,
        result,
        startSession,
        sendAnswer
    } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState<string>('');

    // Прокрутка вниз при новых сообщениях
    const scrollToBottom = (): void => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Обработчик выбора режима
    const handleModeSelect = (mode: BotMode): void => {
        startSession(mode);
    };

    // Обработчик отправки текстового сообщения
    const handleSendMessage = (): void => {
        if (inputText.trim() && currentQuestion?.type === 'text') {
            sendAnswer(inputText.trim());
            setInputText('');
        }
    };

    // Обработчик нажатия клавиш
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Обработчик выбора варианта
    const handleOptionSelect = (optionValue: string | string[]): void => {
        sendAnswer(optionValue);
    };

    // Если сессия не начата, показываем выбор режима
    if (!sessionId) {
        return <ModeSelector onSelect={handleModeSelect} />;
    }

    return (
        <ChatContainer elevation={3}>
            <ChatHeader>
                <BotIcon />
                <Typography variant="h6" sx={{ flex: 1 }}>
                    Библиотечный помощник
                </Typography>
                {loading && <CircularProgress size={24} color="inherit" />}
            </ChatHeader>

            <MessagesContainer>
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}

                {loading && (
                    <TypingIndicator>
                        <span></span>
                        <span></span>
                        <span></span>
                    </TypingIndicator>
                )}

                {error && (
                    <Typography color="error" align="center">
                        Ошибка: {error}
                    </Typography>
                )}

                {completed && result && (
                    <ResultCard result={result} />
                )}

                <div ref={messagesEndRef} />
            </MessagesContainer>

            {currentQuestion && !completed && (
                <Box sx={{ p: 2, background: '#f8f9fa' }}>
                    <Question
                        question={currentQuestion}
                        onOptionSelect={handleOptionSelect}
                        disabled={loading}
                    />
                </Box>
            )}

            {currentQuestion?.type === 'text' && !completed && (
                <InputContainer>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Введите ответ..."
                        value={inputText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        multiline
                        maxRows={3}
                        size="small"
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={loading || !inputText.trim()}
                        sx={{ alignSelf: 'flex-end' }}
                    >
                        <SendIcon />
                    </IconButton>
                </InputContainer>
            )}
        </ChatContainer>
    );
};

export default ChatBot;