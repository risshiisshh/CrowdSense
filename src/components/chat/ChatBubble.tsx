import React from 'react'
import { ChatMessage } from '../../types'

interface ChatBubbleProps {
  message: ChatMessage
}

// Ultra-minimal markdown renderer: **bold**, newlines → <br>
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
    }
    // Handle line breaks
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[82%]">
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tr-sm font-body text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              color: '#08090D',
              boxShadow: '0 2px 12px rgba(245,158,11,0.25)',
            }}
          >
            {message.content}
          </div>
          <p className="text-[10px] text-text-muted mt-1 text-right">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 mb-3">
      {/* AI avatar */}
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          boxShadow: '0 0 10px rgba(139,92,246,0.4)',
        }}
      >
        <span className="text-[11px]">🤖</span>
      </div>

      <div className="max-w-[82%]">
        <div
          className="px-4 py-2.5 rounded-2xl rounded-tl-sm font-body text-sm leading-relaxed"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {renderContent(message.content)}
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          CrowdSense AI · {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
