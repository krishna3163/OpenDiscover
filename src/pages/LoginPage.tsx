import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // UI State
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

    // Form State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');

    // handleCredentialSubmit: Simulate sending OTP
    const handleCredentialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation: In a real app, this would call an API to send email/SMS.
        // For demo, we just alert the code.
        alert(`Authentication Code Sent to ${email}\n\nYour OTP is: 123456`);
        setStep('otp');
    };

    // handleOtpSubmit: Verify code and log in
    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === '123456') {
            // Success!
            const userName = name || email.split('@')[0]; // Use name or part of email
            login(userName, email);
            navigate('/profile'); // Redirect to profile after login
        } else {
            alert('Invalid OTP. Please try again (Hint: 123456)');
        }
    };

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>
                    {step === 'otp' ? 'Two-Step Verification' : (isLogin ? 'Welcome Back' : 'Create Account')}
                </h2>

                {step === 'credentials' ? (
                    <form onSubmit={handleCredentialSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                required
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}>
                            {isLogin ? 'Log In' : 'Sign Up'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                Please enter the verification code sent to <strong>{email}</strong>
                            </p>
                            <input
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2rem' }}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Verify & Login</button>
                        <button
                            type="button"
                            onClick={() => setStep('credentials')}
                            style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            Back
                        </button>
                    </form>
                )}

                {step === 'credentials' && (
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-base)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};
