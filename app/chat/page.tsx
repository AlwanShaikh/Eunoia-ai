"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SendHorizonal, Sparkles, Clock3, Brain } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { cn } from '@/lib/utils';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiVoiceButton, AiStatusIndicator } from '@/components/ui/ai-voice-button';
import { MemoryPanel } from '@/components/ui/memory-panel';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useAuth } from '@/lib/auth';

type AiState = 'idle' | 'listening' | 'thinking' | 'responding';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export default function ChatPage() {
  const [history, setHistory] = useState<Message[]>([
    { role: 'assistant', content: "I'm here with you. Tell me what feels heavy right now.", timestamp: '9:41 AM' },
    { role: 'user', content: "I've been feeling disconnected lately and I'm not sure what to do.", timestamp: '9:42 AM' },
    { role: 'assistant', content: 'That sounds tender. Sometimes distance from ourselves is the first signal that we need a little gentleness.', timestamp: '9:43 AM' },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiState, setAiState] = useState<AiState>('idle');
  const [showMemory, setShowMemory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice chat hook
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { isListening, error: voiceError, isSupported: voiceSupported, toggleListening, speak } = useVoiceChat({
    onTranscript: async (transcript) => {
      console.log('🎤 Voice transcript received:', transcript);
      // Set the transcript as input and send it
      setInput(transcript);
      // Automatically send the message
      await handleSend(transcript);
    },
    onError: (error) => {
      console.error('🎤 Voice error:', error);
      // Could show a toast notification here
    },
    language: 'en-US',
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  // Redirect to login if not authenticated (token missing) once loading completes
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [isLoading, token, router]);

  const handleSend = async (message?: string) => {
    const trimmed = (message || input).trim();
    if (!trimmed || isTyping) return;

    // Require a valid JWT token; redirect to login if missing instead of
    // sending an unauthenticated request that the backend will reject.
    if (!token) {
      router.push('/login');
      return;
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setHistory((prev) => [
      ...prev,
      { role: 'user', content: trimmed, timestamp },
    ]);
    if (!message) {
      setInput('');
    }
    setIsTyping(true);
    setAiState('listening');
    setShowMemory(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Backend responded with status ${res.status}`);
      }

      const data = await res.json();
      const responseTime = new Date();
      const responseTimestamp = responseTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const responseContent = data.response ?? data.message ?? data.content ?? JSON.stringify(data);
      
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: responseContent,
          timestamp: responseTimestamp,
        },
      ]);

      setAiState('responding');
      
      // Text-to-speech for AI response
      if (isListening) {
        speak(responseContent);
      }
      
      setTimeout(() => setAiState('idle'), 1500);
    } catch {
      const errorTime = new Date();
      const errorTimestamp = errorTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble responding right now.",
          timestamp: errorTimestamp,
        },
      ]);

      setAiState('idle');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleButtonClick = () => {
    handleSend();
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Conversation" />
          <div className="mx-auto flex h-[calc(100vh-73px)] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-premium flex flex-1 flex-col overflow-hidden rounded-[28px]"
            >
              {/* Header with AI status */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-sm text-zinc-400">Today</p>
                  <h3 className="text-lg font-semibold text-white">Reflective session</h3>
                </div>
                <div className="flex items-center gap-4">
                  <AiStatusIndicator isActive={isTyping} className="hidden sm:flex" />
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
                    <Clock3 className="h-4 w-4" />
                    12 min
                  </div>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Main chat area */}
                <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4 sm:px-6 scrollbar-thin">
                  {history.map((message, index) => (
                    <ChatBubble
                      key={`${message.timestamp}-${index}`}
                      role={message.role as 'user' | 'assistant'}
                      content={message.content}
                      timestamp={message.timestamp}
                      index={index}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                {/* Memory panel sidebar */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: showMemory ? 320 : 0,
                    opacity: showMemory ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden border-l border-white/[0.06]"
                >
                  {showMemory && (
                    <div className="h-full w-[320px] overflow-y-auto p-3">
                      <MemoryPanel />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Premium input area with voice button */}
              <div className="border-t border-white/10 bg-[#09090B]/40 px-4 py-4 sm:px-6">
                <div className="flex items-end gap-3 rounded-[22px] border border-white/10 bg-white/5 p-2">
                  <AiVoiceButton 
                    size="sm" 
                    isActive={isListening} 
                    onToggle={toggleListening}
                    className="flex-shrink-0" 
                  />
                  <Input
                    placeholder="Share what&rsquo;s on your mind..."
                    className="h-12 border-0 bg-transparent px-0 text-base focus:bg-transparent"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    className="h-12 rounded-full px-5 crimson-glow-subtle"
                    onClick={handleButtonClick}
                  >
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <button
                    onClick={() => setShowMemory(!showMemory)}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200',
                      showMemory
                        ? 'border-crimson-600/30 bg-crimson-600/10 text-crimson-400'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-300'
                    )}
                    aria-label={showMemory ? 'Hide memory panel' : 'Show memory panel'}
                  >
                    <Brain className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
}