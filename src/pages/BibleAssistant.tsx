import { useRef, useEffect, useState } from 'react'
import { Card, Button } from '../components'
import { MessageSquare, Send } from 'lucide-react'

function BibleAssistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      user: 'assistant' as const,
      content: 'Hello! I\'m your Bible Study Assistant. Ask me anything about Scripture, theology, or Bible history!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        user: 'user' as const,
        content: input,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')

      // Simulate assistant response after a short delay
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          user: 'assistant' as const,
          content: 'Thank you for your question! This is a demo response. In the full version, I\'ll provide detailed answers about Scripture and Bible topics.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }, 500)
    }
  }

  return (
    <div className="pb-24 h-screen flex flex-col">
      <div className="space-y-2 mb-6">
        <h1 className="display font-display mb-2 flex items-center gap-2">
          <MessageSquare className="w-8 h-8" /> Bible Assistant
        </h1>
        <p className="text-lg text-on-surface/70">Ask anything about the Bible and Scripture</p>
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
              <p className="body-md">{message.content}</p>
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
              handleSendMessage()
            }
          }}
        />
        <Button onClick={handleSendMessage} size="md" className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    </div>
  )
}

export default BibleAssistant
