import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import logoUrl from '../assets/logo.png';

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    // Redireciona se não tiver email
    useEffect(() => {
        if (!email) navigate('/signup');
    }, [email, navigate]);

    // Cooldown para reenvio
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleDigitChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
        // Avança para o próximo campo automaticamente
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = digits.join('');
        if (code.length < 6) {
            setError('Digite todos os 6 dígitos do código.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/verify-email', { email, code });
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Código inválido. Verifique e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/resend-verification', { email });
            setSuccess('Novo código enviado! Verifique sua caixa de entrada.');
            setCooldown(RESEND_COOLDOWN);
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError('Não foi possível reenviar o código. Tente novamente.');
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-header">
                <img
                    src={logoUrl}
                    alt="8Patas Logo"
                    style={{
                        height: '88px',
                        display: 'inline-block',
                        filter: 'drop-shadow(0 4px 14px rgba(123,94,167,0.22))',
                    }}
                />
            </div>

            <div className="glass-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📬</div>
                    <h2 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                        Verifique seu email
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Enviamos um código de 6 dígitos para<br />
                        <strong style={{ color: 'var(--primary-color)' }}>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleVerify}>
                    {/* Inputs de 6 dígitos */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }} onPaste={handlePaste}>
                        {digits.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleDigitChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                style={{
                                    width: '44px',
                                    height: '52px',
                                    textAlign: 'center',
                                    fontSize: '22px',
                                    fontWeight: '700',
                                    border: `2px solid ${digit ? 'var(--primary-color)' : 'var(--border-color, #E5E7EB)'}`,
                                    borderRadius: '12px',
                                    background: 'var(--input-bg, #F9FAFB)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                            />
                        ))}
                    </div>

                    {error && <p className="error-text text-center">{error}</p>}
                    {success && (
                        <p style={{ color: '#10B981', textAlign: 'center', fontSize: '0.875rem', marginBottom: '8px' }}>
                            {success}
                        </p>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Verificando...' : 'Verificar e entrar'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 8px' }}>
                        Não recebeu o código?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: cooldown > 0 ? 'var(--text-muted)' : 'var(--primary-color)',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: cooldown > 0 ? 'default' : 'pointer',
                            padding: 0,
                        }}
                    >
                        {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
                    </button>
                </div>

                <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                    <Link to="/signup" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        ← Voltar ao cadastro
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
