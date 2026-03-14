import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { pageVariants, pageTransition } from '../lib/motion';
import logoUrl from '../assets/logo_pata.avif';
import heroImgUrl from '../assets/pets_nobg.png';

const EyeIcon = ({ open }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('Email not confirmed')) {
                    setError('Email não verificado. Verifique sua caixa de entrada e ative sua conta.');
                } else if (authError.message.includes('Invalid login credentials')) {
                    setError('Email ou senha incorretos.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            navigate('/');
        } catch (err) {
            setError('Erro ao realizar login. Tente novamente.');
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
                    style={{ height: '72px', display: 'inline-block' }}
                />
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '6px', fontSize: '0.95rem', letterSpacing: '0.3px' }}>A melhor clínica para seu pet</p>
            </div>

            <img className="auth-hero-img" src={heroImgUrl} alt="Cachorro e gato 8Patas" />

            <div className="auth-card">
                <form onSubmit={handleLogin}>
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

                    <div className="input-group">
                        <label>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ paddingRight: '44px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'var(--color-danger-bg)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.875rem',
                            color: 'var(--color-danger-text)',
                            fontWeight: '500',
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary mt-4" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                    <Link to="/forgot-password" style={{ color: 'var(--color-text-secondary)' }}>
                        Esqueci minha senha
                    </Link>
                </p>

                <p className="text-center mt-3" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                    Não tem uma conta?{' '}
                    <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export { Login };
