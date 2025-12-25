import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // UI State
    const [isSignUp, setIsSignUp] = useState(false);
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
            alert('OTP sent to your device: 123456');
            return;
        }

        // Generic Validations
        if (email && password) {
            setStep(2);
            alert('OTP sent to your device: 123456');
        }
    };

    // Step 2: Handle OTP & Login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (otp === '123456') {
            let userData = { name: 'User', email: email };

            // Set User Data based on credentials
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
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>
                    {step === 2 ? 'Two-Step Verification' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleCredentialsSubmit}>
                        {isSignUp && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email or Username</label>
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}>
                            {isSignUp ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                Please enter the verification code sent to your device.
                            </p>
                            <input
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2rem' }}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Verify & Login</button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            Back
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-base)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isSignUp ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};
