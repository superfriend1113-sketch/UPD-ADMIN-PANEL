'use client';

/**
 * Login Page
 * Admin authentication with email/password
 * UPD Design System
 */

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase/clientConfig';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user has retailer role
      const userRole = data.user?.user_metadata?.role;
      if (userRole && userRole !== 'retailer') {
        await supabase.auth.signOut();
        throw new Error('This account is registered as a consumer. Please use the consumer website to sign in.');
      }
      
      // Wait for session cookie to be created
      if (data.session) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          }),
        });
      }
      
      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a hard navigation to ensure server sees the session
      window.location.href = '/';
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Supabase auth errors
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address');
      } else if (err.message?.includes('consumer')) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please try again');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          background: #f5f2eb;
        }
        .login-wrapper {
          width: 100%;
          max-width: 480px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px;
          line-height: 1;
          letter-spacing: 1px;
          color: #0d0d0d;
          margin-bottom: 10px;
        }
        .login-title-accent {
          color: #c8401a;
        }
        .login-subtitle {
          font-size: 15px;
          color: #888070;
        }
        .login-card {
          background: #ffffff;
          border: 1px solid #d6d0c4;
          border-radius: 6px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(13, 13, 13, 0.10);
        }
        .login-card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 16px;
        }
        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #0d0d0d;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .form-label-required {
          color: #c8401a;
        }
        .form-input {
          border: 1.5px solid #d6d0c4;
          border-radius: 6px;
          padding: 9px 12px;
          font-size: 14px;
          background: #ede9df;
          color: #0d0d0d;
          transition: all 0.15s;
          outline: none;
        }
        .form-input:focus {
          border-color: #0d0d0d;
          background: #ffffff;
        }
        .form-input:disabled {
          opacity: 0.4;
        }
        .error-box {
          background: #fef2f2;
          border: 1.5px solid #fca5a5;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 20px;
        }
        .error-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 2px;
          color: #c8401a;
        }
        .error-text {
          font-size: 13px;
          line-height: 1.5;
          color: #0d0d0d;
        }
        .login-footer {
          text-align: center;
          font-size: 13px;
          color: #888070;
          margin-top: 20px;
        }
      `}</style>
      
      <div className="login-container">
        <div className="login-wrapper">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              UNLIMITED <span className="login-title-accent">PERFECT</span> DEALS
            </h1>
            <p className="login-subtitle">
              Admin Panel — Sign in to manage your platform
            </p>
          </div>

          {/* Login Form Card */}
          <div className="login-card">
            <h2 className="login-card-title">Sign In</h2>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="form-label-required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="form-label-required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-box">
                  <div className="error-content">
                    <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="error-text">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer Note */}
          <p className="login-footer">
            Secure admin access only
          </p>
        </div>
      </div>
    </>
  );
}
