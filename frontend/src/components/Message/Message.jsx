import React from 'react';

const Message = ({ message }) => {
  const { text, sender, timestamp } = message;
  const isUser = sender === 'user';

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const styles = {
    message: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      maxWidth: '80%',
      flexDirection: isUser ? 'row-reverse' : 'row',
      marginLeft: isUser ? 'auto' : '0',
      marginRight: isUser ? '0' : 'auto',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: isUser ? '#b0b0b0' : '#4a4a4a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      alignItems: isUser ? 'flex-end' : 'flex-start',
    },
    bubble: {
      padding: '12px 16px',
      borderRadius: '18px',
      backgroundColor: isUser ? '#4a4a4a' : '#f0f2f5',
      color: isUser ? 'white' : 'inherit',
      boxShadow: '0 1px 2px rgba(236, 232, 232, 0.1)',
      wordWrap: 'break-word',
      borderBottomRightRadius: isUser ? '4px' : '18px',
      borderBottomLeftRadius: isUser ? '18px' : '4px',
    },
    text: {
      margin: 0,
      lineHeight: 1.5,
      fontSize: '14px',
    },
    timestamp: {
      fontSize: '11px',
      color: '#8e8e93',
      padding: '0 4px',
    },
  };

  return (
    <div style={styles.message}>
      <div style={styles.avatar}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div style={styles.content}>
        <div style={styles.bubble}>
          <p style={styles.text}>{text}</p>
        </div>
        <span style={styles.timestamp}>{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

export default Message;
