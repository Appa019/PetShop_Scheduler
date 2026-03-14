import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setError('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError('Erro ao redefinir senha. Tente novamente.');
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
                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Senha redefinida!
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            Redirecionando...
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
                            <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                                Redefinir senha
                            </h2>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Escolha uma nova senha para sua conta.
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            <div className="input-group">
                                <label>Nova senha</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        style={{ paddingRight: '44px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(v => !v)}
                                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                        aria-label={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                                    >
                                        <EyeIcon open={showNewPassword} />
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Confirmar nova senha</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        style={{ paddingRight: '44px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                                    >
                                        <EyeIcon open={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>

                            {error && <p className="error-text text-center">{error}</p>}

                            <button type="submit" className="btn-primary mt-4" disabled={loading}>
                                {loading ? 'Redefinindo...' : 'Redefinir senha'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export { ResetPassword };
