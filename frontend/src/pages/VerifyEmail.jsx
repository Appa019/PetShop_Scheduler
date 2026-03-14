import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../lib/motion';
import { supabase } from '../lib/supabase';
import logoUrl from '../assets/logo.png';

// Supabase Auth handles verification via magic link in email.
// This page handles the redirect after clicking the verification link.
const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [error, setError] = useState('');

    useEffect(() => {
        const handleVerification = async () => {
            // Check if user is already authenticated (link was clicked)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setStatus('success');
                setTimeout(() => navigate('/'), 2000);
                return;
            }

            // Check for error in URL params (Supabase redirects with error)
            const errorDesc = searchParams.get('error_description');
            if (errorDesc) {
                setStatus('error');
                setError(errorDesc);
                return;
            }

            // If no session and no error, show waiting message
            setStatus('waiting');
        };

        handleVerification();

        // Listen for auth state changes (in case verification completes)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    setStatus('success');
                    setTimeout(() => navigate('/'), 2000);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate, searchParams]);

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

            <div className="glass-card" style={{ textAlign: 'center' }}>
                {status === 'verifying' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
                        <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Verificando...
                        </h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Email verificado!
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            Redirecionando...
                        </p>
                    </>
                )}

                {status === 'waiting' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
                        <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Verifique seu email
                        </h2>
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Enviamos um link de verificação para seu email.<br />
                            Clique no link para ativar sua conta.
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
                        <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.3rem' }}>
                            Erro na verificação
                        </h2>
                        <p className="error-text text-center">{error}</p>
                    </>
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

export { VerifyEmail };
