'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

interface Message {
    id: string;
    sender: 'me' | 'other';
    text: string;
    time: string;
}

interface ChatPanelProps {
    role: 'buyer' | 'seller';
    onClose?: () => void;
}

export const ChatPanel = ({ role, onClose }: ChatPanelProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'other', text: 'Congratulations on winning the lot!', time: '10:30 AM' },
        { id: '2', sender: 'me', text: 'Thank you! I will make the payment shortly.', time: '10:35 AM' },
        { id: '3', sender: 'other', text: 'Great! Let me know once payment is complete.', time: '10:36 AM' },
        { id: '4', sender: 'me', text: 'Will do. What are the pickup hours?', time: '10:38 AM' },
        { id: '5', sender: 'other', text: 'We are open Monday-Friday, 9 AM to 5 PM.', time: '10:40 AM' },
        { id: '6', sender: 'me', text: 'Perfect, I will schedule for tomorrow.', time: '10:42 AM' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, {
            id: Date.now().toString(),
            sender: 'me',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setInput('');
    };

    const quickTemplates = role === 'buyer'
        ? ['I have completed payment.', 'I will arrive for pickup at...']
        : ['Payment received.', 'Pickup is ready.'];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#ffffff',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                <div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        marginBottom: '4px',
                    }}>
                        Messages
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0,
                    }}>
                        Chat with {role === 'buyer' ? 'Seller' : 'Buyer'}
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: '#f3f4f6',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        aria-label="Close chat"
                    >
                        <X size={20} color="#4b5563" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                {messages.map((msg, index) => {
                    const showTime = index === 0 || messages[index - 1].sender !== msg.sender;

                    return (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: msg.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    backgroundColor: msg.sender === 'me' ? '#dcfce7' : '#f3f4f6',
                                    border: msg.sender === 'me' ? 'none' : '1px solid #e5e7eb',
                                }}
                            >
                                <p style={{
                                    fontSize: '15px',
                                    lineHeight: '1.5',
                                    color: '#111827',
                                    margin: 0,
                                }}>
                                    {msg.text}
                                </p>
                            </div>
                            {showTime && (
                                <span style={{
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    marginTop: '6px',
                                    paddingLeft: '4px',
                                    paddingRight: '4px',
                                }}>
                                    {msg.time}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Replies */}
            <div style={{
                padding: '12px 24px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #f3f4f6',
                flexShrink: 0,
            }}>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    {quickTemplates.map((temp, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(temp)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#f3f4f6',
                                border: 'none',
                                borderRadius: '999px',
                                fontSize: '13px',
                                color: '#4b5563',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        >
                            {temp}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Bar */}
            <div style={{
                padding: '16px 24px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e5e7eb',
                flexShrink: 0,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            height: '48px',
                            padding: '0 20px',
                            border: '1px solid #d1d5db',
                            borderRadius: '24px',
                            fontSize: '15px',
                            color: '#111827',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#16a34a';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: input.trim() ? '#16a34a' : '#d1d5db',
                            border: 'none',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            if (input.trim()) e.currentTarget.style.backgroundColor = '#15803d';
                        }}
                        onMouseLeave={(e) => {
                            if (input.trim()) e.currentTarget.style.backgroundColor = '#16a34a';
                        }}
                        aria-label="Send message"
                    >
                        <Send size={20} color="#ffffff" />
                    </button>
                </div>
            </div>
        </div>
    );
};
