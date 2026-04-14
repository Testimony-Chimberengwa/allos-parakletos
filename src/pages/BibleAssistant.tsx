import { useRef, useEffect, useState } from 'react'
import { Card, Button } from '../components'
import { MessageSquare, Send } from 'lucide-react'

interface AssistantMatch {
  id: string
  reference: string
  text: string
  score: number
}

interface AssistantWebSource {
  title: string
  url: string
  publisher?: string
  reason?: string
}

interface AssistantMessage {
  id: string
  user: 'assistant' | 'user'
  content: string
  timestamp: Date
  matches?: AssistantMatch[]
  webSources?: AssistantWebSource[]
  source?: string
}

const ASSISTANT_API_URL = import.meta.env.VITE_ASSISTANT_API_URL || 'http://localhost:8787'

function BibleAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: '1',
      user: 'assistant' as const,
      content:
        'Hello. Ask anything about Scripture and I will return semantically matched verses from your configured Bible APIs.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<'NLT' | 'KJV' | 'AMP'>('KJV')
  const sessionIdRef = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    const question = input.trim()
    if (!question || isLoading) {
      return
    }

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      user: 'user',
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const conversation = [
      ...messages.slice(-8).map((message) => ({
        role: message.user,
        content: message.content,
      })),
      {
        role: 'user',
        content: question,
      },
    ]

    try {
      const response = await fetch(`${ASSISTANT_API_URL}/api/assistant/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          versionAbbreviation: selectedVersion,
          sessionId: sessionIdRef.current,
          conversation,
        }),
      })

      if (!response.ok) {
        throw new Error(`Assistant backend returned ${response.status}`)
      }

      const payload = await response.json()

      if (payload.sessionId) {
        sessionIdRef.current = payload.sessionId
      }

      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        user: 'assistant',
        content: payload.answer || 'I could not form an answer right now.',
        timestamp: new Date(),
        matches: Array.isArray(payload.matches) ? payload.matches : [],
        webSources: Array.isArray(payload.webSources) ? payload.webSources : [],
        source: payload.source,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Assistant request failed:', error)
      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        user: 'assistant',
        content:
          'I could not reach the assistant backend. Start it with "npm run dev:assistant" and try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pb-24 h-screen flex flex-col">
      <div className="space-y-2 mb-6">
        <h1 className="display font-display mb-2 flex items-center gap-2">
          <MessageSquare className="w-8 h-8" /> Bible Assistant
        </h1>
        <p className="text-lg text-on-surface/70">Ask anything about the Bible and Scripture</p>
        <div className="flex gap-2 pt-2">
          {(['NLT', 'KJV', 'AMP'] as const).map((version) => (
            <button
              key={version}
              type="button"
              onClick={() => setSelectedVersion(version)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedVersion === version
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface/70'
              }`}
            >
              {version}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-xs lg:max-w-md ${
                message.user === 'user'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              <p className="body-md whitespace-pre-line">{message.content}</p>
              {message.user === 'assistant' && message.matches && message.matches.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.matches.slice(0, 3).map((match) => (
                    <div key={match.id} className="rounded-lg bg-surface-container-low/70 p-2">
                      <p className="text-xs font-semibold text-primary">{match.reference}</p>
                      <p className="text-xs text-on-surface/80 line-clamp-3">{match.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {message.user === 'assistant' && message.webSources && message.webSources.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wide text-on-surface/60">Trusted sources</p>
                  {message.webSources.slice(0, 4).map((sourceLink, index) => (
                    <a
                      key={`${sourceLink.url}-${index}`}
                      href={sourceLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg bg-white/70 px-2 py-2 text-xs text-primary font-semibold hover:bg-white transition-colors"
                    >
                      {sourceLink.title}
                      {sourceLink.publisher ? ` (${sourceLink.publisher})` : ''}
                    </a>
                  ))}
                </div>
              )}
              {message.user === 'assistant' && message.source && (
                <p className="text-[10px] mt-2 uppercase tracking-wide text-on-surface/50">
                  source: {message.source}
                </p>
              )}
              <p className={`text-xs mt-1 ${message.user === 'user' ? 'text-on-primary/70' : 'text-on-surface/60'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your question here..."
          className="input-field flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              void handleSendMessage()
            }
          }}
        />
        <Button
          onClick={() => void handleSendMessage()}
          size="md"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Send className="w-4 h-4" />
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}

export default BibleAssistant
