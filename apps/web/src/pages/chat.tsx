import { useState, useEffect, useRef, useCallback } from 'react';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import { useApi } from '@/hooks/useApi';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface ModelInfo {
  id: string;
  owned_by: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Streaming reader helper
async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {}
      }
    }
  }
}

export default function ChatPage() {
  const { apiCall, loading, token } = useApi();
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-v4-pro');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    apiCall<{ data: ModelInfo[] }>({ url: '/models' })
      .then((res) => {
        setModels(res.data || []);
        if (!selectedModel && res.data?.[0]) {
          setSelectedModel(res.data[0].id);
        }
      })
      .catch(() => {});
  }, [apiCall]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setError('');
    setStreaming(true);

    // Create placeholder assistant message
    const assistantIdx = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          model: selectedModel,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      for await (const chunk of readStream(reader)) {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[assistantIdx]) {
            updated[assistantIdx] = {
              ...updated[assistantIdx],
              content: updated[assistantIdx].content + chunk,
            };
          }
          return updated;
        });
      }
    } catch (err: any) {
      setError(err.message || 'Chat failed');
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[assistantIdx] && !updated[assistantIdx].content) {
          updated[assistantIdx] = {
            ...updated[assistantIdx],
            content: 'Failed to get response. Please try again.',
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chat</h1>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-sunken border border-border rounded-lg px-3 py-2 text-sm text-text-1 focus:ring-2 focus:ring-accent-light"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto bg-sunken rounded-xl p-4 border border-border space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-text-3 gap-3">
              <Bot className="w-10 h-10" />
              <p className="text-sm">Start a conversation with NusaAI</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <Bot className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              )}
              <div
                className={`max-w-xl rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border text-text-1'
                } ${idx === messages.length - 1 && streaming ? 'animate-pulse' : ''}`}
              >
                {msg.content || (streaming ? '...' : '')}
              </div>
              {msg.role === 'user' && (
                <User className="w-5 h-5 text-text-3 mt-0.5 shrink-0" />
              )}
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <Bot className="w-5 h-5 text-accent mt-0.5" />
              <div className="bg-surface border border-border rounded-lg px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-xs text-red-400 p-2">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-3">
          <input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={streaming}
            className="flex-1 bg-sunken border border-border rounded-lg px-4 py-2 text-sm text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent-light disabled:opacity-50"
          />
          <Button onClick={handleSend} isLoading={streaming} disabled={!input.trim() || streaming} leftIcon={<Send className="w-4 h-4" />}>
            Send
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
