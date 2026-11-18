'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  FiSend,
  FiCpu,
  FiUser,
  FiAlertCircle,
  FiRefreshCw,
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';
import { aiService, type ChatResponse } from '@/services/ai.service';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/services/api';
import AIInsightCard from './AIInsightCard';
import AIFinancialCard from './AIFinancialCard';
import './AIChat.css';

const AIChart = dynamic(() => import('./AIChart'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: Date;
  mode?: 'ai' | 'demo';
  data?: ChatResponse;
}

const SUGGESTED = [
  'I have ₹2 lakh. Which business could suit me?',
  'How can I finance my business?',
  'Help me create a business plan',
  'What government support may be relevant to me?',
];

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

let idCounter = 0;
const nextId = () => `m${Date.now()}-${idCounter++}`;

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    setError('');
    const userMsg: ChatMessage = { id: nextId(), role: 'user', text, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(text);
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: 'ai',
        text: res.message,
        time: new Date(),
        mode: res.mode,
        data: res,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Unable to reach the AI advisor. Please try again.',
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const retryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) send(lastUser.text);
  };

  return (
    <div className="aichat">
      <div className="aichat__header">
        <div className="aichat__brand">
          <span className="aichat__brand-icon">
            <FiCpu />
          </span>
          <div>
            <span className="aichat__brand-title">RuralMate AI Advisor</span>
            <span className="aichat__brand-sub">
              {user ? `Guidance for ${user.name}` : 'Your rural business advisor'}
            </span>
          </div>
        </div>
        <span className="aichat__status">
          <span className="aichat__status-dot" /> Online
        </span>
      </div>

      <div className="aichat__body" ref={scrollRef} role="log" aria-live="polite" aria-label="Conversation">
        {!hasMessages && !loading && (
          <div className="aichat__intro">
            <span className="aichat__intro-icon">
              <FiCpu />
            </span>
            <h3 className="aichat__intro-title">Ask RuralMate AI</h3>
            <p className="aichat__intro-sub">Get practical guidance for your rural business.</p>
            <div className="aichat__suggestions">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  className="aichat__suggestion"
                  onClick={() => send(s)}
                  type="button"
                >
                  <FiZap className="aichat__suggestion-icon" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`aichat__msg aichat__msg--${m.role}`}>
            <span className={`aichat__avatar aichat__avatar--${m.role}`}>
              {m.role === 'ai' ? <FiCpu /> : <FiUser />}
            </span>
            <div className="aichat__bubble-wrap">
              <div className={`aichat__bubble aichat__bubble--${m.role}`}>
                {m.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}

                {m.role === 'ai' && m.data && (
                  <>
                    {m.data.insights && m.data.insights.length > 0 && (
                      <AIInsightCard insights={m.data.insights} />
                    )}
                    {m.data.financial && m.data.financial.length > 0 && (
                      <AIFinancialCard items={m.data.financial} />
                    )}
                    {m.data.chart && m.data.chart.data.length > 0 && (
                      <AIChart chart={m.data.chart} />
                    )}
                    {m.data.actions && m.data.actions.length > 0 && (
                      <div className="aichat__actions">
                        {m.data.actions.map((a) => (
                          <Link key={a.href + a.label} href={a.href} className="aichat__action">
                            {a.label} <FiArrowRight />
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              <span className="aichat__meta">
                {m.role === 'ai' ? 'RuralMate AI' : 'You'} · {formatTime(m.time)}
                {m.role === 'ai' && m.mode === 'demo' && (
                  <span className="aichat__mode"> · demo mode</span>
                )}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="aichat__msg aichat__msg--ai">
            <span className="aichat__avatar aichat__avatar--ai">
              <FiCpu />
            </span>
            <div className="aichat__bubble aichat__bubble--ai aichat__typing" aria-label="AI is typing">
              <span className="aichat__dot" />
              <span className="aichat__dot" />
              <span className="aichat__dot" />
            </div>
          </div>
        )}

        {error && (
          <div className="aichat__error" role="alert">
            <FiAlertCircle />
            <span>{error}</span>
            <button className="aichat__retry" onClick={retryLast} type="button">
              <FiRefreshCw /> Retry
            </button>
          </div>
        )}
      </div>

      <form
        className="aichat__composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          ref={textareaRef}
          className="aichat__input"
          placeholder="Ask about business ideas, finance, schemes…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          aria-label="Message RuralMate AI"
          disabled={loading}
        />
        <button
          className="aichat__send"
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <FiSend />
        </button>
      </form>
      <p className="aichat__hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line. Financial
        figures are calculated precisely in the Finance section.
      </p>
    </div>
  );
}
