"use client";

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type WaveformState = 'idle' | 'listening' | 'processing';

interface VoiceWaveformProps {
  state?: WaveformState;
  className?: string;
  barCount?: number;
}

/**
 * VoiceWaveform - Real-time audio frequency visualization
 * Uses Web Audio API to capture microphone input and render animated bars.
 * Idle state: minimal ambient movement
 * Listening state: reacts to actual voice volume
 */
export function VoiceWaveform({
  state = 'idle',
  className,
  barCount = 32,
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number>(0);
  const isListeningRef = useRef(false);

  // Generate idle ambient data (soft, gentle movement)
  const idleDataRef = useRef<Float32Array>(new Float32Array(barCount));
  const idlePhaseRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = 0;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    isListeningRef.current = false;
  }, []);

  const startListening = useCallback(async () => {
    cleanup();
    isListeningRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch {
      // Fallback: use simulated data if microphone access denied
      isListeningRef.current = false;
    }
  }, [cleanup]);

  useEffect(() => {
    if (state === 'listening' && !isListeningRef.current) {
      startListening();
    } else if (state !== 'listening') {
      cleanup();
    }

    return cleanup;
  }, [state, startListening, cleanup]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width ?? 240;
    const height = rect?.height ?? 60;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const barWidth = (width - barCount * 2) / barCount;
    const gap = 2;

    let frequencyData: Uint8Array | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isListening = state === 'listening';
      const centerY = height / 2;

      if (isListening && analyserRef.current) {
        // Real frequency data from microphone
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        frequencyData = dataArray;
      } else if (isListening && !analyserRef.current) {
        // Fallback simulated data when mic not available
        const dataArray = new Uint8Array(barCount);
        const now = Date.now() / 1000;
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = Math.max(
            0,
            Math.min(255, 40 + Math.sin(now * 3 + i * 0.5) * 20 + Math.random() * 15)
          );
        }
        frequencyData = dataArray;
      }

      for (let i = 0; i < barCount; i++) {
        let value: number;

        if (isListening && frequencyData) {
          // Map frequency data to bar index
          const binIndex = Math.floor((i / barCount) * frequencyData.length);
          value = frequencyData[binIndex] / 255;
        } else {
          // Idle state: gentle ambient waves
          idlePhaseRef.current += 0.008;
          const phase = idlePhaseRef.current + i * 0.15;
          // Sine wave with slight randomness for organic feel
          const sine = Math.sin(phase) * 0.5 + 0.5;
          const noise = Math.random() * 0.04;
          value = Math.max(0.03, sine * 0.12 + noise);
        }

        // Apply exponential smoothing and minimum height for idle
        const minHeight = isListening ? 0.02 : 0.04;
        const barHeight = Math.max(minHeight, value);
        const maxBarHeight = height * 0.85;
        const pixelHeight = barHeight * maxBarHeight;

        const x = i * (barWidth + gap) + 1;
        const y = centerY - pixelHeight / 2;
        const radius = Math.min(barWidth / 2, 4);

        // Gradient from crimson to purple based on intensity
        const intensity = Math.min(1, barHeight * 1.5);
        const r = Math.floor(180 + 75 * intensity);
        const g = Math.floor(40 + 60 * (1 - intensity));
        const b = Math.floor(80 + 120 * (1 - intensity));
        const alpha = isListening ? Math.max(0.4, intensity * 0.9) : 0.15 + intensity * 0.25;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, pixelHeight, [radius, radius, radius, radius]);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        // Glow effect for active bars
        if (isListening && intensity > 0.3) {
          ctx.shadowColor = `rgba(220, 20, 60, ${intensity * 0.5})`;
          ctx.shadowBlur = 8 * intensity;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [state, barCount]);

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Glass container */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-500',
          state === 'listening'
            ? 'border-crimson-600/30 bg-crimson-600/5 shadow-[0_0_20px_rgba(220,20,60,0.1)]'
            : 'border-white/5 bg-white/[0.02]'
        )}
      >
        <canvas
          ref={canvasRef}
          className="block h-[60px] w-[240px]"
          role="img"
          aria-label={state === 'listening' ? 'Voice waveform visualization active' : 'Voice waveform idle'}
        />

        {/* Status indicator */}
        <div className="absolute bottom-1 left-3 flex items-center gap-1.5">
          <motion.span
            className={cn(
              'inline-block h-1.5 w-1.5 rounded-full',
              state === 'listening'
                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                : 'bg-zinc-600'
            )}
            animate={
              state === 'listening'
                ? { opacity: [1, 0.4, 1] }
                : { opacity: [0.4, 0.7, 0.4] }
            }
            transition={{
              duration: state === 'listening' ? 1.5 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
            {state === 'listening' ? 'Live' : state === 'processing' ? 'Processing' : 'Standby'}
          </span>
        </div>

        {/* Decorative corner glows */}
        {state === 'listening' && (
          <>
            <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full bg-crimson-500/20 blur-xl" />
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-12 w-12 rounded-full bg-purple-500/20 blur-xl" />
          </>
        )}
      </div>
    </div>
  );
}