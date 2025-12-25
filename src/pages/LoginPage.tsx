
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // UI State
    const [isSignUp, setIsSignUp] = useState(false);
    const [authMethod, setAuthMethod] = useState<'username' | 'phone'>('username');
    const [step, setStep] = useState<1 | 2>(1);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');

    // Step 1: Handle Credentials
    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Specific Admin Credentials Check
        if ((email === 'krishna0858' && password === '@krishna') ||
            (email === 'Piyush_Mishra' && password === 'piyushmishra')) {
            setStep(2);
            // Simulated "Sent" toast
            return;
        }

        // Generic Validations
        if (email && password) {
            setStep(2);
        }
    };

    // Step 2: Handle OTP & Login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (otp === '123456') { // Mock OTP
            let userData = { name: 'User', email: email };

            if (email === 'krishna0858') {
                userData = { name: 'Krishna', email: 'krishna0858@opendiscover.com' };
            } else if (email === 'Piyush_Mishra') {
                userData = { name: 'Piyush Mishra', email: 'piyush@opendiscover.com' };
            } else if (isSignUp) {
                userData = { name: name, email: email };
            } else {
                userData = { name: email.split('@')[0], email: email };
            }

            login(userData);
            navigate('/profile');
        } else {
            alert('Invalid OTP');
        }
    };

    return (
        <div className="login-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

            {/* Logo Area */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    OpenDiscover
                </h1>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>
                    {step === 2 ? 'Security Verification' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h2>

                {step === 1 ? (
                    <>
                        {/* Toggle Tabs (Visual) */}
                        {!isSignUp && (
                            <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '0.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                                <button
                                    onClick={() => setAuthMethod('username')}
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: authMethod === 'username' ? 'var(--bg-card)' : 'transparent', color: authMethod === 'username' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: authMethod === 'username' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                >
                                    Username
                                </button>
                                <button
                                    onClick={() => setAuthMethod('phone')}
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: authMethod === 'phone' ? 'var(--bg-card)' : 'transparent', color: authMethod === 'phone' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: authMethod === 'phone' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                >
                                    Phone
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {isSignUp && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{authMethod === 'username' ? 'Username or Email' : 'Phone Number'}</label>
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder={authMethod === 'username' ? "Enter your username" : "Enter your phone number"}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                                {isSignUp ? 'Sign Up' : 'Log In'}
                            </button>
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#10b981', borderRadius: '50%', padding: '0.25rem' }}>✓</div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 700 }}>OTP Sent!</div>
                                <div style={{ fontSize: '0.8rem' }}>Check your device for the code (123456)</div>
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-input"
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 700 }}
                                maxLength={6}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>Verify & Login</button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                            >
                                {isSignUp ? 'Log In' : 'Sign Up'}
                            </button>
                        </p>
                        {!isSignUp && (
                            <button style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>
                                Forgot Password?
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
