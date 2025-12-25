import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial mock messages
    useEffect(() => {
        setMessages([
            { id: 1, sender: username || 'Staff', text: `Hello! How can I help you today?`, time: '10:00 AM', isUser: false }
        ]);
    }, [username]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
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

        // Simulated reply
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
                            maxWidth: '70%',
                            background: msg.isUser ? 'var(--accent-base)' : 'var(--bg-dark)',
                            color: msg.isUser ? '#fff' : 'var(--text-primary)',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            borderBottomRightRadius: msg.isUser ? '0' : '1rem',
                            borderBottomLeftRadius: msg.isUser ? '1rem' : '0',
                            position: 'relative',
                            border: msg.isUser ? 'none' : '1px solid var(--border-color)'
                        }}>
                            <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>{msg.time}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', color: '#fff' }}
                    />
                    <button className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};
