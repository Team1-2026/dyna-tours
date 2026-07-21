'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { chatApi } from '@/lib/api';
import { useGoogleIdentity } from '@/hooks/useGoogleIdentity';
import styles from './ChatWidget.module.css';

type ChatRole = 'user' | 'assistant' | 'staff';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
}

interface LeadProfile {
  name: string;
  email: string;
  phone?: string;
}

const VISITOR_KEY = 'dyna_chat_visitor_id';
const CONVERSATION_KEY = 'dyna_chat_conversation_id';
const MESSAGES_KEY = 'dyna_chat_messages';
const LEAD_KEY = 'dyna_chat_lead';

const WELCOME_MESSAGE =
  'Hello! I am your AI Travel Consultant. Share your destination, travel dates, and preferences — I will suggest curated options for you.';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateVisitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY);

  if (existing && UUID_RE.test(existing)) {
    return existing;
  }

  const visitorId = createId();
  localStorage.setItem(VISITOR_KEY, visitorId);

  return visitorId;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadProfile | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [leadError, setLeadError] = useState('');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isHidden = pathname.startsWith('/admin');
  const needsLead = !lead;
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const applyLead = useCallback((profile: LeadProfile) => {
    setLead(profile);
    setLeadForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
    });
    localStorage.setItem(LEAD_KEY, JSON.stringify(profile));
    setLeadError('');
  }, []);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setIsGoogleSigningIn(true);
    setLeadError('');

    try {
      const profile = await chatApi.verifyGoogleIdentity(credential);
      applyLead({
        name: profile.name,
        email: profile.email,
      });
    } catch {
      setLeadError('Google sign-in failed. Please try again or enter your details manually.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  }, [applyLead]);

  const { buttonRef: googleButtonRef, error: googleIdentityError, isConfigured: googleConfigured } = useGoogleIdentity({
    enabled: isOpen && needsLead && hasHydrated && !isHidden,
    clientId: googleClientId,
    onCredential: handleGoogleCredential,
  });

  useEffect(() => {
    const storedConversationId = localStorage.getItem(CONVERSATION_KEY);
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    const storedLead = localStorage.getItem(LEAD_KEY);

    setVisitorId(getOrCreateVisitorId());

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }

    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages) as ChatMessage[]);
      } catch {
        localStorage.removeItem(MESSAGES_KEY);
      }
    }

    if (storedLead) {
      try {
        const parsed = JSON.parse(storedLead) as LeadProfile;
        if (parsed?.name && parsed?.email) {
          setLead(parsed);
          setLeadForm({
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone || '',
          });
        }
      } catch {
        localStorage.removeItem(LEAD_KEY);
      }
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(MESSAGES_KEY);
    }
  }, [messages, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || !conversationId) {
      return;
    }

    localStorage.setItem(CONVERSATION_KEY, conversationId);
  }, [conversationId, hasHydrated]);

  useEffect(() => {
    if (isOpen && !needsLead) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isSending, needsLead]);

  // Poll for staff replies delivered from Google Chat.
  useEffect(() => {
    if (!isOpen || needsLead || !visitorId || !conversationId) {
      return;
    }

    let cancelled = false;

    const syncStaffReplies = async () => {
      try {
        const response = await chatApi.getMessages(visitorId, conversationId);
        if (cancelled) return;

        const staffMessages = response.messages
          .filter((msg) => msg.role === 'staff')
          .map((msg) => ({
            id: msg.id,
            role: 'staff' as const,
            content: msg.content,
            createdAt: msg.created_at,
          }));

        if (staffMessages.length === 0) {
          return;
        }

        setMessages((prev) => {
          const existingIds = new Set(prev.map((msg) => msg.id));
          const additions = staffMessages.filter((msg) => !existingIds.has(msg.id));
          return additions.length > 0 ? [...prev, ...additions] : prev;
        });
      } catch {
        // Ignore transient poll errors.
      }
    };

    void syncStaffReplies();
    const timer = window.setInterval(() => {
      void syncStaffReplies();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [conversationId, isOpen, needsLead, visitorId]);

  const saveLead = (event: React.FormEvent) => {
    event.preventDefault();
    const name = leadForm.name.trim();
    const email = leadForm.email.trim();
    const phone = leadForm.phone.trim();

    if (!name || !email) {
      setLeadError('Please enter your name and email to start chatting.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLeadError('Please enter a valid email address.');
      return;
    }

    const profile: LeadProfile = { name, email, phone: phone || undefined };
    applyLead(profile);
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();

    if (!trimmed || isSending || !visitorId || !lead) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = conversationId
        ? await chatApi.continueConversation(visitorId, conversationId, trimmed)
        : await chatApi.startConversation(visitorId, trimmed, lead);

      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: response.agent_response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: 'Sorry, I could not reach our travel consultant right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [conversationId, input, isSending, lead, visitorId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    localStorage.removeItem(CONVERSATION_KEY);
    localStorage.removeItem(MESSAGES_KEY);
  };

  if (isHidden || !hasHydrated) {
    return null;
  }

  return (
    <div className={styles.widgetRoot} aria-live="polite">
      {isOpen && (
        <section className={styles.panel} aria-label="Travel consultant chat">
          <header className={styles.header}>
            <div className={styles.headerText}>
              <p className={styles.eyebrow}>Dyna Tours</p>
              <h2 className={styles.title}>AI Travel Consultant</h2>
              <p className={styles.subtitle}>
                {needsLead
                  ? 'Share your details to begin'
                  : `Hi ${lead?.name?.split(' ')[0] || 'there'} — how can we help?`}
              </p>
            </div>
            <div className={styles.headerActions}>
              {!needsLead && (
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={startNewConversation}
                  aria-label="Start new conversation"
                  title="New conversation"
                >
                  ↺
                </button>
              )}
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </header>

          {needsLead ? (
            <form className={styles.leadForm} onSubmit={saveLead}>
              <p className={styles.leadIntro}>
                Please enter your name and email so our travel team can follow up on your requirements.
              </p>

              {googleConfigured && (
                <div className={styles.googleAuth}>
                  <div ref={googleButtonRef} className={styles.googleButton} />
                  {isGoogleSigningIn && (
                    <p className={styles.googleStatus}>Signing in with Google…</p>
                  )}
                  <div className={styles.leadDivider}>
                    <span>or continue manually</span>
                  </div>
                </div>
              )}

              <label className={styles.leadLabel}>
                Full name
                <input
                  className={styles.leadInput}
                  value={leadForm.name}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={120}
                />
              </label>
              <label className={styles.leadLabel}>
                Email
                <input
                  className={styles.leadInput}
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  maxLength={255}
                />
              </label>
              <label className={styles.leadLabel}>
                Phone <span>(optional)</span>
                <input
                  className={styles.leadInput}
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 ..."
                  maxLength={40}
                />
              </label>
              {(leadError || googleIdentityError) && (
                <p className={styles.leadError}>{leadError || googleIdentityError}</p>
              )}
              <button type="submit" className={styles.sendButton} disabled={isGoogleSigningIn}>
                Start chatting
              </button>
            </form>
          ) : (
            <>
              <div className={styles.messages}>
                <div className={`${styles.message} ${styles.assistant}`}>
                  <div className={styles.bubble}>{WELCOME_MESSAGE}</div>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.role === 'user'
                        ? styles.user
                        : message.role === 'staff'
                          ? styles.staff
                          : styles.assistant
                    }`}
                  >
                    <div className={styles.bubble}>
                      {message.role === 'staff' && (
                        <span className={styles.staffLabel}>Travel team</span>
                      )}
                      {message.content}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className={`${styles.message} ${styles.assistant}`}>
                    <div className={`${styles.bubble} ${styles.typing}`}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form className={styles.composer} onSubmit={handleSubmit}>
                <textarea
                  ref={inputRef}
                  className={styles.input}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about destinations, hotels, or itineraries..."
                  rows={1}
                  maxLength={1000}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={isSending || input.trim().length === 0}
                  aria-label="Send message"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        className={`${styles.launcher} ${isOpen ? styles.launcherOpen : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="dyna-chat-panel"
      >
        {isOpen ? 'Close chat' : 'Chat with us'}
      </button>
    </div>
  );
}
