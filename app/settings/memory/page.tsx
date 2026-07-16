"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, Plus } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';

type Memory = {
  id: number;
  key: string;
  value: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export default function MemorySettingsPage() {
  const { token, isAuthenticated, logout } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState('preference');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMemories();
    }
  }, [isAuthenticated, token]);

  const fetchMemories = async () => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/memories?token=${token}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    }
  };

  const handleAddMemory = async () => {
    if (!newKey || !newValue || !token) return;
    
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/memories?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: newKey,
          value: newValue,
          category: newCategory,
        }),
      });
      
      if (res.ok) {
        setNewKey('');
        setNewValue('');
        setNewCategory('preference');
        setShowAddForm(false);
        fetchMemories();
      }
    } catch (error) {
      console.error('Failed to add memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryId: number) => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/memories/${memoryId}?token=${token}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        setMemories(memories.filter(m => m.id !== memoryId));
      }
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/auth/logout?token=${token}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Memory Settings" />
          <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Memories</CardTitle>
                    <Button
                      onClick={() => setShowAddForm(!showAddForm)}
                      size="sm"
                      className="h-9 rounded-full crimson-glow-subtle"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Memory
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">
                    These are preferences and information Eunoia remembers about you to provide more personalized support.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-4"
                    >
                      <Input
                        placeholder="Memory key (e.g., favorite_coping_strategy)"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="h-10 rounded-[16px] border-white/10 bg-white/5 px-3 text-sm"
                      />
                      <Input
                        placeholder="Memory value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="h-10 rounded-[16px] border-white/10 bg-white/5 px-3 text-sm"
                      />
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full rounded-[16px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      >
                        <option value="preference">Preference</option>
                        <option value="context">Context</option>
                        <option value="goal">Goal</option>
                        <option value="insight">Insight</option>
                      </select>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddMemory}
                          disabled={isLoading || !newKey || !newValue}
                          className="flex-1 h-9 rounded-full crimson-glow-subtle"
                        >
                          {isLoading ? 'Saving...' : 'Save Memory'}
                        </Button>
                        <Button
                          onClick={() => setShowAddForm(false)}
                          variant="secondary"
                          className="h-9 rounded-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {memories.length === 0 ? (
                    <div className="rounded-[20px] border border-white/10 bg-white/5 p-8 text-center">
                      <Sparkles className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
                      <p className="text-sm text-zinc-400">No memories saved yet</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Memories help Eunoia provide more personalized support
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {memories.map((memory) => (
                        <motion.div
                          key={memory.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-start justify-between rounded-[16px] border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-white truncate">
                                {memory.key}
                              </p>
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                                {memory.category}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-300 break-words">
                              {memory.value}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteMemory(memory.id)}
                            variant="ghost"
                            size="sm"
                            className="ml-3 h-8 w-8 rounded-full p-0 text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-red-400/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="w-full h-12 rounded-full border-red-400/20 text-red-400 hover:bg-red-400/10"
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}