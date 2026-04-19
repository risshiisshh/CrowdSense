import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Trash2, Bot, Sparkles } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useChatBot } from '../../hooks/useChatBot'
import ChatBubble from './ChatBubble'

export default function ChatBot() {
  const { chatOpen, setChatOpen } = useAppStore()
  const { messages, isTyping, suggestions, sendMessage, clearChat } = useChatBot()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  function handleSend() {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSuggestion(s: string) {
    if (isTyping) return
    sendMessage(s)
  }

  if (!chatOpen) return null

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className="fixed inset-0 z-50 md:hidden"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setChatOpen(false)}
      />

      {/* Chat Panel */}
      <div
        className="chat-panel fixed z-50 flex flex-col"
        style={{
          // Mobile: full screen bottom sheet style
          // Desktop: right-side panel
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: 'rgba(8,9,13,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            {/* AI avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                boxShadow: '0 0 16px rgba(139,92,246,0.4)',
              }}
            >
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-display text-base tracking-wide" style={{ color: '#8B5CF6' }}>
                  CROWDSENSE AI
                </p>
                <Sparkles size={12} style={{ color: '#F59E0B' }} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-text-muted font-body">
                  {isTyping ? 'Typing...' : 'Online · venue intelligence'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg transition-colors hover:text-coral"
              style={{ color: 'var(--text-muted)' }}
              title="Clear chat"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-lg transition-colors hover:text-text-primary"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)' }}
              >
                <span className="text-[11px]">🤖</span>
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#8B5CF6',
                      animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggestions (shown when last message is from assistant) ── */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-4 pb-2 flex-shrink-0">
            <p className="text-[10px] text-text-muted font-body mb-2 uppercase tracking-wider">Quick questions</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-3 py-1.5 rounded-pill text-[11px] font-body font-medium transition-all hover:opacity-80 active:scale-95"
                  style={{
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#A78BFA',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ── */}
        <div
          className="px-4 py-3 flex-shrink-0 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crowds, food, gates..."
            className="flex-1 bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted outline-none"
            style={{
              padding: '10px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)' }}
          />
          <button
            id="chatbot-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: input.trim() && !isTyping
                ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                : 'var(--surface-3)',
              boxShadow: input.trim() && !isTyping ? '0 0 16px rgba(139,92,246,0.4)' : 'none',
            }}
          >
            <Send size={16} color="#fff" />
          </button>
        </div>

        {/* Powered by line */}
        <p className="text-center text-[10px] text-text-muted pb-3 font-body">
          Powered by CrowdSense AI · Mock mode
        </p>
      </div>
    </>
  )
}
