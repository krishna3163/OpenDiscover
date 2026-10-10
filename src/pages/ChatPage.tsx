import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { useAuth } from '../context/auth';
import { useToast } from '../context/toast';
import { DEMO_STAFF_NAMES, STAFF_ROSTER, isDemoStaff } from '../config/demo';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import { askAssistant, assistantMode, describeAssistantMode, type ChatTurn } from '../services/ai';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
  /** Assistant replies render markdown; simulated staff replies do not. */
  rich?: boolean;
}

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const GUEST_SIMULATION = {
  names: ['Guest_102', 'Dev_User', 'Newbie_Coder', 'ReactFan', 'PrivacyOwl'],
  lines: [
    'Hi, how do I submit a project?',
    'Is the API documentation updated?',
    'I found a bug on the login page.',
    'Can my project get verified?',
    'Love the new Trust Score badges!',
    'Which privacy browser do you recommend?',
  ],
};

function loadHistory(username: string): Message[] {
  const stored = readStorage<Message[]>(STORAGE_KEYS.chat(username), []);
  return Array.isArray(stored) ? stored.filter((m) => m && typeof m.text === 'string') : [];
}

/**
 * Chat with the AI assistant or with a member of the demo staff roster.
 *
 * Conversations are stored locally, assistant calls carry the recent history,
 * and nothing here talks to a backend we control.
 */
export const ChatPage: React.FC = () => {
  const { username = 'Bot' } = useParams<{ username: string }>();
  const { user, isAuthenticated, isStaff } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<Message[]>(() => loadHistory(username));
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [simulate, setSimulate] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isBot = username.toLowerCase() === 'bot';
  const peer = useMemo(
    () => STAFF_ROSTER.find((member) => member.name.toLowerCase() === username.toLowerCase()),
    [username],
  );

  /** First message of a fresh conversation. */
  const createGreeting = useCallback(
    (): Message => ({
      id: Date.now(),
      sender: isBot ? 'Bot' : peer?.name ?? username,
      text: isBot
        ? 'Hello! I am the OpenDiscover assistant. Ask me for a private browser, an open Notion alternative, or what a Trust Score actually measures.'
        : `Hi${user?.name ? ` ${user.name}` : ''}! Thanks for reaching out — ask me anything about listings, verification or contributing.`,
      time: clock(),
      isUser: false,
      rich: isBot,
    }),
    [isBot, peer, user, username],
  );

  // Seed the conversation the first time it is opened.
  useEffect(() => {
    if (messages.length > 0) return;
    setMessages([createGreeting()]);
    // Only runs for an empty conversation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist locally.
  useEffect(() => {
    writeStorage(STORAGE_KEYS.chat(username), messages.slice(-120));
  }, [messages, username]);

  // Abort an in-flight assistant call when leaving the page.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Auto-scroll, but only when the visitor is already near the bottom.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    if (distance < 240) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  // Staff demo: simulate incoming visitor questions.
  useEffect(() => {
    if (!simulate || isBot) return;

    const timer = window.setInterval(() => {
      const incoming: Message = {
        id: Date.now(),
        sender: GUEST_SIMULATION.names[Math.floor(Math.random() * GUEST_SIMULATION.names.length)],
        text: GUEST_SIMULATION.lines[Math.floor(Math.random() * GUEST_SIMULATION.lines.length)],
        time: clock(),
        isUser: false,
      };
      setMessages((prev) => [...prev, incoming]);

      if (notificationsOn && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`New message from ${incoming.sender}`, { body: incoming.text });
      }
    }, 20_000);

    return () => window.clearInterval(timer);
  }, [simulate, isBot, notificationsOn]);

  const enableNotifications = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      toast.error('Notifications are not supported in this browser');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsOn(permission === 'granted');
    if (permission === 'granted') toast.success('Notifications enabled', 'You will be alerted about new messages.');
    else toast.info('Notifications blocked', 'Your browser denied the permission request.');
  }, [toast]);

  const handleSend = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
      const text = draft.trim();
      if (!text || isTyping) return;

      const outgoing: Message = {
        id: Date.now(),
        sender: user?.name ?? 'You',
        text,
        time: clock(),
        isUser: true,
      };

      const history: ChatTurn[] = [...messages, outgoing].map((m) => ({
        role: m.isUser ? 'user' : 'model',
        text: m.text,
      }));

      setMessages((prev) => [...prev, outgoing]);
      setDraft('');

      if (!isBot) {
        if (!isStaff) {
          // Demo staff reply so the flow is not a dead end.
          window.setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: peer?.name ?? username,
                text: "Thanks for reaching out! I'll get back to you shortly. For anything urgent, open an issue on GitHub.",
                time: clock(),
                isUser: false,
              },
            ]);
          }, 1400);
        }
        return;
      }

      setIsTyping(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await askAssistant(text, history, controller.signal);
        if (controller.signal.aborted) return;
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'Bot', text: reply.text, time: clock(), isUser: false, rich: true },
        ]);
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'Bot',
            text: 'Sorry — something went wrong while generating that reply. Please try again.',
            time: clock(),
            isUser: false,
          },
        ]);
      } finally {
        abortRef.current = null;
        setIsTyping(false);
      }
    },
    [draft, isTyping, isBot, isStaff, messages, peer, user, username],
  );

  const clearConversation = () => {
    abortRef.current?.abort();
    removeStorage(STORAGE_KEYS.chat(username));
    setMessages([createGreeting()]);
    toast.info('Conversation cleared');
  };

  if (!isAuthenticated) {
    return (
      <div className="container page-narrow">
        <div className="card empty-state">
          <div aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            🔒
          </div>
          <h2>Log in to start chatting</h2>
          <p>Chat is part of the demo community area. Sign in (no real account needed) to continue.</p>
          <Link to="/login" className="btn btn-primary">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container chat-layout">
      <header className="chat-header">
        <Link to="/community" className="back-link">
          ← Community
        </Link>
        <h1>
          Chat with <span className="accent">{peer?.name ?? username}</span>
        </h1>
        <p className="chat-status">
          <span className="status-dot" aria-hidden="true" />
          {isBot ? describeAssistantMode() : peer?.role ?? 'Staff member'}
        </p>

        <div className="chat-actions">
          <button type="button" className="btn btn-ghost" onClick={clearConversation}>
            Clear
          </button>
          {!isBot && isStaff && (
            <button
              type="button"
              className={`btn ${simulate ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSimulate((v) => !v)}
              aria-pressed={simulate}
            >
              {simulate ? 'Stop incoming demo' : 'Simulate incoming'}
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={enableNotifications}>
            {notificationsOn ? '🔔 Notifications on' : '🔕 Enable notifications'}
          </button>
        </div>
      </header>

      <div className="card chat-card">
        <div className="chat-messages" ref={scrollerRef} role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <div key={message.id} className={`bubble ${message.isUser ? 'bubble-me' : 'bubble-them'}`}>
              {!message.isUser && <div className="bubble-sender">{message.sender}</div>}
              {message.rich ? <Markdown text={message.text} /> : <div className="bubble-text">{message.text}</div>}
              <div className="bubble-time">{message.time}</div>
            </div>
          ))}

          {isTyping && (
            <div className="bubble bubble-them typing" aria-label="Assistant is typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form className="chat-form" onSubmit={handleSend}>
          <label className="sr-only" htmlFor="chat-input">
            Message {peer?.name ?? username}
          </label>
          <textarea
            id="chat-input"
            className="chat-input"
            value={draft}
            rows={1}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSend(event);
              }
            }}
            placeholder={isBot ? 'Ask the assistant… (Enter to send, Shift+Enter for a new line)' : 'Type a message…'}
            disabled={isTyping}
          />
          <button type="submit" className="btn btn-primary" disabled={isTyping || !draft.trim()}>
            Send
          </button>
        </form>
      </div>

      {!isBot && isStaff && (
        <p className="chat-note">
          Demo staff view · names from <code>VITE_DEMO_ADMINS</code> ({DEMO_STAFF_NAMES.join(', ')}). Nothing is sent to a
          server; see <code>SECURITY.md</code>. Current mode: <code>{assistantMode}</code>.
        </p>
      )}
      {!isStaff && isDemoStaff(username) && (
        <p className="chat-note">
          You are chatting with a demo staff account. Replies are simulated locally — there is no real-time messaging
          backend yet.
        </p>
      )}
    </div>
  );
};

export default ChatPage;
