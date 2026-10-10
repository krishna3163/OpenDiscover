import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useToast } from '../context/toast';
import { DEMO_OTP_HINT, isDemoStaff, resolveDemoName } from '../config/demo';

/**
 * Demo authentication screen.
 *
 * ⚠️ There is no backend: no password is verified, no OTP is sent, and the
 * resulting session lives in `localStorage`. Credentials are deliberately
 * **not** checked against anything — see SECURITY.md for why hard-coding them
 * here would be a real vulnerability.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<'username' | 'phone'>('username');
  const [step, setStep] = useState<1 | 2>(1);

  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const handleCredentialsSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (identifier.trim().length < 3) {
      setError(authMethod === 'username' ? 'Enter a username or email (3+ characters).' : 'Enter a valid phone number.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters (demo only — nothing is verified).');
      return;
    }
    if (isSignUp && name.trim().length < 2) {
      setError('Please tell us what to call you.');
      return;
    }

    setOtp('');
    setStep(2);
    toast.info('Demo OTP step', DEMO_OTP_HINT);
  };

  const handleVerify = (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit demo code.');
      return;
    }

    const resolvedName = isSignUp && name.trim() ? name.trim() : resolveDemoName(identifier);
    const email = identifier.includes('@')
      ? identifier
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.opendiscover.local`;

    login({ name: resolvedName, email });

    if (isDemoStaff(resolvedName)) {
      toast.success(`Welcome back, ${resolvedName}`, 'Demo staff view enabled — try the community chat.');
    } else {
      toast.success(`Signed in as ${resolvedName}`, 'Session stored locally in this browser.');
    }

    navigate(redirectTo === '/login' ? '/profile' : redirectTo);
  };

  return (
    <div className="container page-narrow login-page">
      <header className="login-brand">
        <span className="logo-mark" aria-hidden="true">
          ◎
        </span>
        <h1>OpenDiscover</h1>
        <p className="badge badge-warning">Demo sign-in · no real accounts</p>
      </header>

      <div className="card login-card">
        <h2>{step === 2 ? 'Security verification' : isSignUp ? 'Create your profile' : 'Welcome back'}</h2>

        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}

        {step === 1 ? (
          <>
            {!isSignUp && (
              <div className="segmented" role="tablist" aria-label="Sign-in method">
                {(['username', 'phone'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    role="tab"
                    aria-selected={authMethod === method}
                    className={`segmented-button${authMethod === method ? ' segmented-active' : ''}`}
                    onClick={() => setAuthMethod(method)}
                  >
                    {method === 'username' ? 'Username' : 'Phone'}
                  </button>
                ))}
              </div>
            )}

            <form className="form-stack" onSubmit={handleCredentialsSubmit} noValidate>
              {isSignUp && (
                <div className="field">
                  <label htmlFor="signup-name">Full name</label>
                  <input
                    id="signup-name"
                    className="form-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="identifier">{authMethod === 'username' ? 'Username or email' : 'Phone number'}</label>
                <input
                  id="identifier"
                  className="form-input"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={authMethod === 'username' ? 'yourname or you@example.com' : '+91 90000 00000'}
                  autoComplete={authMethod === 'username' ? 'username' : 'tel'}
                  inputMode={authMethod === 'phone' ? 'tel' : 'text'}
                  aria-invalid={!!error}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Anything — this demo does not check it"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  aria-invalid={!!error}
                  required
                />
                <span className="field-hint">Not verified. Never reuse a real password in a demo.</span>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg">
                {isSignUp ? 'Create profile' : 'Continue'}
              </button>
            </form>

            <p className="login-switch">
              {isSignUp ? 'Already have a profile?' : 'New here?'}{' '}
              <button type="button" className="link-button" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </>
        ) : (
          <form className="form-stack" onSubmit={handleVerify} noValidate>
            <p className="notice notice-success">
              <strong>Demo code sent!</strong> In a real deployment this would arrive by SMS or an authenticator app.
              Here, {DEMO_OTP_HINT.toLowerCase()}.
            </p>

            <div className="field">
              <label htmlFor="otp">6-digit code</label>
              <input
                id="otp"
                className="form-input otp-input"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                aria-invalid={!!error}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Verify & continue
            </button>
            <button type="button" className="link-button" onClick={() => setStep(1)}>
              ← Back to login
            </button>
          </form>
        )}
      </div>

      <p className="login-footnote">
        Auth in this build is a client-side simulation for the community demo. Read{' '}
        <a
          href="https://github.com/krishna3163/OpenDiscover/blob/main/SECURITY.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          SECURITY.md
        </a>{' '}
        before wiring it to anything real — or <Link to="/">skip the login and keep browsing</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
