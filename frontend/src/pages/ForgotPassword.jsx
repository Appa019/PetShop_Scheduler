import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../lib/motion';
import { supabase } from '../lib/supabase';
import logoUrl from '../assets/logo.png';

const EyeIcon = ({ open }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = email, 2 = success message
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/app/reset-password`,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setStep(2);
        } catch (err) {
            setError('Erro ao enviar email de redefinição. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="auth-container" variants={pageVariants} initial="initial" animate="animate" transition={pageTransition}>
            <div className="logo-header">
                <img
                    src={logoUrl}
                    alt="8Patas Logo"
                    style={{
                        height: '88px',
                        display: 'inline-block',
                        filter: 'drop-shadow(0 4px 14px rgba(45, 42, 38, 0.12))',
                    }}
                />
            </div>

            <div className="glass-card">
                {step === 1 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
                            <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                                Esqueci minha senha
                            </h2>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Digite seu email e enviaremos um link para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleSendReset}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {error && <p className="error-text text-center">{error}</p>}

                            <button type="submit" className="btn-primary mt-4" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
                        <h2 style={{ margin: '0 0 12px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Email enviado!
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Enviamos um link de redefinição de senha para<br />
                            <strong style={{ color: 'var(--color-accent)' }}>{email}</strong>
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '16px' }}>
                            Clique no link no email para criar uma nova senha.
                        </p>
                    </div>
                )}

                <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                    <Link to="/login" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                        ← Voltar ao login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export { ForgotPassword };
