import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function StudentLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Failed to sign in');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Student Login</h1>
        <p className="text-gray-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-bufc-blue hover:bg-bufc-blue/90 text-white"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <Link
              to="/forgot-password"
              state={{ from: 'student' }}
              className="text-bufc-blue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </form>
    </Card>
  );
} 