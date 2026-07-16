"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BookOpen, HeartHandshake, Sparkles, Smile, Frown, Meh } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const staticStats = [
  { label: 'Calmness', value: '78%', change: '+12%' },
  { label: 'Reflection', value: '5.2 days', change: '+1' },
  { label: 'Support streak', value: '14 days', change: '+3' },
];

const moodOptions = [
  { label: 'Great', score: 9, icon: Smile, color: 'text-emerald-400' },
  { label: 'Good', score: 7, icon: Smile, color: 'text-sky-400' },
  { label: 'Okay', score: 5, icon: Meh, color: 'text-yellow-400' },
  { label: 'Low', score: 3, icon: Frown, color: 'text-orange-400' },
  { label: 'Struggling', score: 1, icon: Frown, color: 'text-red-400' },
];

export default function MoodPage() {
  const { token, isAuthenticated } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [moodStats, setMoodStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMoodHistory();
    }
  }, [isAuthenticated, token]);

  const fetchMoodHistory = async () => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/mood/history?token=${token}&limit=30`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMoodHistory(data);
        
        if (data.length > 0) {
          const avg = data.reduce((sum: number, entry: any) => sum + entry.mood_score, 0) / data.length;
          setMoodStats({ average: Math.round(avg), total: data.length });
        }
      }
    } catch (error) {
      console.error('Failed to fetch mood history:', error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood || !token) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedOption = moodOptions.find(m => m.score === selectedMood);
      if (!selectedOption) return;
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/mood?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood_score: selectedMood,
          mood_label: selectedOption.label,
          note: note || undefined,
        }),
      });
      
      if (res.ok) {
        setSelectedMood(null);
        setNote('');
        fetchMoodHistory();
      }
    } catch (error) {
      console.error('Failed to save mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Mood Dashboard" />
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <Card className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-sky-300">Weekly mood</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        {moodStats.average >= 7 ? 'Feeling good' : moodStats.average >= 5 ? 'Holding steady' : 'Taking it gentle'}
                      </h3>
                    </div>
                    {moodStats.total > 0 && (
                      <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                        {moodStats.total} entries
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex h-40 items-end gap-3 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
                    {moodHistory.slice(0, 7).reverse().map((entry) => {
                      const height = (entry.mood_score / 10) * 100;
                      return (
                        <div
                          key={entry.id}
                          className="flex-1 rounded-t-[16px] bg-gradient-to-t from-[#6D5EF9] via-[#8B5CF6] to-[#38BDF8]"
                          style={{ height: `${height}%` }}
                          title={`${entry.mood_label}: ${entry.mood_score}/10`}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How are you feeling?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {moodOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.score}
                          onClick={() => setSelectedMood(option.score)}
                          className={`flex flex-col items-center gap-2 rounded-[16px] border p-3 transition-all ${
                            selectedMood === option.score
                              ? 'border-crimson-600/30 bg-crimson-600/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${option.color}`} />
                          <span className="text-xs text-zinc-300">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note (optional)..."
                        className="w-full rounded-[20px] border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-zinc-500 focus:border-sky-400/50 focus:outline-none"
                        rows={3}
                      />
                      <Button
                        onClick={handleMoodSubmit}
                        disabled={isSubmitting}
                        className="w-full h-10 rounded-full crimson-glow-subtle"
                      >
                        {isSubmitting ? 'Saving...' : 'Save mood'}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {staticStats.map((stat) => (
                    <div key={stat.label} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-zinc-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-sm text-emerald-400">{stat.change}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Journal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
                      3 new entries this week
                    </div>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">Your recent notes reflect clearer intention and softer self-talk.</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Activity className="h-4 w-4 text-sky-400" />
                      Motion and calm balance
                    </div>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">Your patterns suggest a strong foundation for sustainable routine.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}