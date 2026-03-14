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

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // Supabase sends verification email automatically
            setSuccess(true);
        } catch (err) {
            setError('Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div className="auth-container" variants={pageVariants} initial="initial" animate="animate" transition={pageTransition}>
                <div className="logo-header">
                    <img src={logoUrl} alt="8Patas Logo" style={{ height: '72px', display: 'inline-block' }} />
                </div>
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
                    <h2 style={{ margin: '0 0 12px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                        Verifique seu email
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                        Enviamos um link de verificação para<br />
                        <strong style={{ color: 'var(--color-accent)' }}>{email}</strong>
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Clique no link no email para ativar sua conta e depois faça login.
                    </p>
                    <Link to="/login" className="btn-primary mt-4" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                        Ir para Login
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className="auth-container" variants={pageVariants} initial="initial" animate="animate" transition={pageTransition}>
            <div className="logo-header">
                <img
                    src={logoUrl}
                    alt="8Patas Logo"
                    style={{ height: '72px', display: 'inline-block' }}
                />
                <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', fontSize: '1.05rem' }}>Crie sua conta gratuitamente</p>
            </div>

            <img className="auth-hero-img" src={heroImgUrl} alt="Cachorro e gato 8Patas" />

            <div className="auth-card">
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

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
                                minLength={6}
                                autoComplete="new-password"
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
                        {loading ? 'Cadastrando...' : 'Criar conta'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                    Já tem uma conta?{' '}
                    <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                        Entrar
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export { Signup };
