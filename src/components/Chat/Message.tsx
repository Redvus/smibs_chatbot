// src/components/Chat/Message.tsx
import React from 'react';
import styled from 'styled-components';
import { Box, Avatar, Paper, Typography } from '@mui/material';
import { SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import type { Message as MessageType } from '../../types';

const MessageWrapper = styled(Box) <{ $isUser: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
`;

const MessageBubble = styled(Paper) <{ $isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  background: ${props => props.$isUser ? '#007bff' : 'white'};
  color: ${props => props.$isUser ? 'white' : '#2c3e50'};
  border-radius: 18px;
  ${props => props.$isUser
        ? 'border-bottom-right-radius: 4px;'
        : 'border-bottom-left-radius: 4px;'
    }
  word-wrap: break-word;

  p {
    margin: 0;
    line-height: 1.5;
  }
`;

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <MessageWrapper $isUser={isUser}>
            <Avatar sx={{
                bgcolor: isUser ? '#007bff' : '#2c3e50',
                width: 32,
                height: 32
            }}>
                {isUser ? <PersonIcon /> : <BotIcon />}
            </Avatar>

            <MessageBubble $isUser={isUser} elevation={1}>
                {message.type === 'result' ? (
                    <ReactMarkdown>{String(message.text)}</ReactMarkdown>
                ) : (
                    <Typography variant="body1">{String(message.text)}</Typography>
                )}
            </MessageBubble>
        </MessageWrapper>
    );
};

export default Message;