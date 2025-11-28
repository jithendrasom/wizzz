import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { MockAPI } from '../services/mockBackend';
import { User } from '../types';
import { Shirt, Mail, Lock, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'VERIFY';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // For mock purposes, direct login. In real app, would allow verify flow if enabled.
      // We will simulate a "Verification Needed" for new registrations only to show the feature.
      const user = await MockAPI.login(email);
      onLogin(user);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await MockAPI.register(email);
      setPendingEmail(email);
      setMode('VERIFY');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const isValid = await MockAPI.verifyCode(code);
      if (isValid) {
        const user = await MockAPI.login(pendingEmail);
        onLogin(user);
      } else {
        setError('Invalid verification code (Try 123456).');
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Wizzzz Laundry</h1>
          <p className="text-slate-500 mt-2">
            {mode === 'LOGIN' ? 'Welcome back! Please login.' : 
             mode === 'REGISTER' ? 'Create your account.' : 
             'Verify your email.'}
          </p>
        </div>

        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
            <div className="text-center text-sm">
              <span className="text-slate-500">New here? </span>
              <button type="button" onClick={() => setMode('REGISTER')} className="text-indigo-600 font-medium hover:underline">
                Create account
              </button>
            </div>
          </form>
        )}

        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Register
            </Button>
            <div className="text-center text-sm">
              <span className="text-slate-500">Already have an account? </span>
              <button type="button" onClick={() => setMode('LOGIN')} className="text-indigo-600 font-medium hover:underline">
                Sign in
              </button>
            </div>
          </form>
        )}

        {mode === 'VERIFY' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5" />
              <p>We've sent a 6-digit code to <strong>{pendingEmail}</strong>. (Hint: Use 123456)</p>
            </div>
            <Input
              label="Verification Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify & Login
            </Button>
            <button 
              type="button" 
              onClick={() => setMode('REGISTER')} 
              className="w-full text-center text-sm text-slate-500 hover:text-slate-800"
            >
              Back to Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};