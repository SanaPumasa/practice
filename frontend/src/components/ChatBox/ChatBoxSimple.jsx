import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addMessage,
  setTyping,
  resetMessages,
} from '../../store';
import Message from '../Message/Message';
import './ChatBox.css';

const colors = {
  dark: '#1e1e2e',
  light: '#fafafa',
  white: '#ffffff',
  border: '#e5e7eb',
  text: '#9ca3af',
  success: '#00ad40',
};

const ChatBoxSimple = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, isTyping } = useSelector((state) => state.chat);
  
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const currentMessages = [...messages];
    dispatch(addMessage({ chatId: activeChatId, message: userMessage }));
    setInputValue('');
    dispatch(setTyping(true));

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          history: currentMessages.slice(-10),
        }),
      });

      const data = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        text: data.success ? data.message : (data.message || 'Sorry, I encountered an error. Please try again.'),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage({ chatId: activeChatId, message: aiResponse }));
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Unable to connect to the server. Please make sure the backend is running.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage({ chatId: activeChatId, message: errorResponse }));
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    dispatch(resetMessages());
    setInputValue('');
  };

  const styles = {
    container: {
      display: 'flex',
      width: '100%',
      maxWidth: '900px',
      height: 'calc(95vh - 100px)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    },
    chatbox: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: '#b0b0b0',
      color: '#1e1e2e',
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#4a4a4a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 600,
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      opacity: 0.9,
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: colors.success,
    },
    headerBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '20px',
      backgroundColor: '#4a4a4a',
      color: 'white',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: colors.light,
    },
    typing: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    typingAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#4a4a4a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '12px 16px',
      backgroundColor: '#f0f2f5',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px',
    },
    inputArea: {
      padding: '16px 20px',
      backgroundColor: colors.white,
      borderTop: `1px solid ${colors.border}`,
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
      backgroundColor: '#f3f4f6',
      borderRadius: '24px',
      padding: '8px 8px 8px 20px',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '14px',
      lineHeight: 1.5,
      resize: 'none',
      maxHeight: '120px',
      fontFamily: 'inherit',
      padding: '6px 0',
    },
    sendBtn: (disabled) => ({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#4a4a4a',
      color: 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      flexShrink: 0,
    }),
    disclaimer: {
      margin: '8px 0 0',
      fontSize: '11px',
      color: colors.text,
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatbox}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.avatar}>🤖</div>
            <div style={styles.headerText}>
              <h2 style={styles.title}>Tabalu lowku</h2>
              <span style={styles.status}>
                <span style={styles.statusDot}></span>
                Online
              </span>
            </div>
          </div>
          <button style={styles.headerBtn} onClick={handleNewChat} aria-label="New chat">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Messages Container */}
        <div style={styles.messages}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div style={styles.typing}>
              <div style={styles.typingAvatar}>🤖</div>
              <div style={styles.typingIndicator} className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form style={styles.inputArea} onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <textarea
              ref={inputRef}
              style={styles.input}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              aria-label="Message input"
            />
            <button 
              type="submit" 
              style={styles.sendBtn(!inputValue.trim())}
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p style={styles.disclaimer}>
            Powered by Google Gemini AI
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatBoxSimple;
