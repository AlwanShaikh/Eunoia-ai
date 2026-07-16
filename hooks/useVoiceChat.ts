"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'responding' | 'error';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

export function useVoiceChat({
  onTranscript,
  onError,
  language = 'en-US',
}: UseVoiceChatOptions = {}) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const isListeningRef = useRef(false);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Speech recognition is not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setVoiceState('listening');
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('✅ Speech recognition result received');
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log(`📝 Transcript: "${transcript}" (confidence: ${confidence})`);
      
      if (transcript && transcript.trim()) {
        onTranscript?.(transcript.trim());
      } else {
        const errorMsg = 'Empty speech input detected';
        console.warn('⚠️', errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Speech recognition error:', event.error);
      let errorMsg = `Speech recognition error: ${event.error}`;
      
      switch (event.error) {
        case 'no-speech':
          errorMsg = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMsg = 'No microphone found. Please connect a microphone.';
          break;
        case 'not-allowed':
          errorMsg = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMsg = 'Network error occurred during speech recognition.';
          break;
      }
      
      setError(errorMsg);
      setVoiceState('error');
      setIsListening(false);
      isListeningRef.current = false;
      onError?.(errorMsg);
    };

    recognition.onend = () => {
      console.log('🛑 Speech recognition ended');
      setVoiceState('idle');
      setIsListening(false);
      isListeningRef.current = false;
    };

    return recognition;
  }, [isSupported, language, onTranscript, onError]);

  // Start listening
  const startListening = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = 'Speech recognition is not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (isListeningRef.current) {
      console.log('⚠️ Already listening, ignoring start request');
      return;
    }

    try {
      setError(null);
      setVoiceState('processing');
      
      // Request microphone permission first
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted');
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Initialize and start recognition
      const recognition = initRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        console.log('🎤 Starting speech recognition...');
        recognition.start();
      }
    } catch (err) {
      console.error('❌ Microphone access error:', err);
      let errorMsg = 'Failed to access microphone';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Microphone access denied. Please allow microphone access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'No microphone found. Please connect a microphone.';
        } else if (err.name === 'NotReadableError') {
          errorMsg = 'Microphone is already in use by another application.';
        } else {
          errorMsg = `Microphone error: ${err.message}`;
        }
      }
      
      setError(errorMsg);
      setVoiceState('error');
      onError?.(errorMsg);
    }
  }, [isSupported, initRecognition, onError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      console.log('🛑 Stopping speech recognition...');
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (!text || !text.trim()) {
      console.warn('⚠️ Cannot speak empty text');
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    console.log('🔊 Speaking AI response...');
    setVoiceState('responding');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(language.split('-')[0]) && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith(language.split('-')[0]));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      console.log('🔊 Speech started');
    };

    utterance.onend = () => {
      console.log('✅ Speech ended');
      setVoiceState('idle');
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      setVoiceState('idle');
    };

    synthesisRef.current = window.speechSynthesis;
    window.speechSynthesis.speak(utterance);
  }, [language]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      console.log('🛑 Stopping speech...');
      window.speechSynthesis.cancel();
      setVoiceState('idle');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListeningRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    voiceState,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  };
}