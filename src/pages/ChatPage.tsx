import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBotResponse } from '../services/gemini';

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    isUser: boolean;
}

export const ChatPage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isBot = username === 'Bot';

    // Initial mock messages
    useEffect(() => {
        setMessages([
            {
                id: 1,
                sender: username || 'Staff',
                text: isBot
                    ? `Hello! I'm the OpenDiscover AI. Ask me about apps, privacy tools, or recommendations!`
                    : `Hello! How can I help you today?`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: false
            }
        ]);
    }, [username, isBot]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            sender: user?.name || 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: true
        };

        setMessages(prev => [...prev, userMsg]);
        setNewMessage('');

        if (isBot) {
            setIsTyping(true);
            try {
                const responseText = await getBotResponse(userMsg.text);

                const botMsg: Message = {
                    id: Date.now() + 1,
                    sender: 'Bot',
                    text: responseText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isUser: false
                };
                setMessages(prev => [...prev, botMsg]);
            } catch (error) {
                console.error("Bot Error", error);
            } finally {
                setIsTyping(false);
            }
        } else {
            // Simulated reply for human staff
            setTimeout(() => {
                const replyMsg: Message = {
                    id: Date.now() + 1,
                    sender: username || 'Staff',
                    text: "Thanks for reaching out! I'll get back to you shortly.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isUser: false
                };
                setMessages(prev => [...prev, replyMsg]);
            }, 1500);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                <h2>Please Log In</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You need to be logged in to chat with staff.</p>
                <Link to="/login" className="btn btn-primary">Log In</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/community" style={{ color: 'var(--text-secondary)' }}>← Back</Link>
                <h2 style={{ fontSize: '1.5rem' }}>Chat with <span style={{ color: 'var(--accent-base)' }}>{username}</span></h2>
            </div>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                            maxWidth: '85%', // Slightly wider for AI responses
                            background: msg.isUser
                                ? 'linear-gradient(135deg, var(--accent-base), #9333ea)' // User: Gradient
                                : (isBot && !msg.isUser ? 'var(--bg-card)' : 'var(--bg-dark)'), // Bot: Dark Card
                            color: msg.isUser ? '#fff' : 'var(--text-primary)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            borderBottomRightRadius: msg.isUser ? '0' : '1rem',
                            borderBottomLeftRadius: msg.isUser ? '1rem' : '0',
                            position: 'relative',
                            border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                            boxShadow: msg.isUser ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                            whiteSpace: 'pre-wrap' // Preserve line breaks from AI
                        }}>
                            {/* Bot Icon for AI messages */}
                            {!msg.isUser && isBot && (
                                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🤖</div>
                            )}
                            <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {/* Basic Markdown Support (Bold only for simplicity, can expand) */}
                                {msg.text.split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                )}
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem', textAlign: 'right' }}>{msg.time}</div>
                        </div>
                    ))}

                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-dark)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Thinking...
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={isBot ? "Ask the AI..." : "Type a message..."}
                        disabled={isTyping}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', color: '#fff' }}
                    />
                    <button className="btn btn-primary" disabled={isTyping}>Send</button>
                </form>
            </div>
        </div>
    );
};
