import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
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
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = pedir email, 2 = código + nova senha

    // Step 1
    const [email, setEmail] = useState('');
    const [loadingStep1, setLoadingStep1] = useState(false);
    const [errorStep1, setErrorStep1] = useState('');

    // Step 2
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingStep2, setLoadingStep2] = useState(false);
    const [errorStep2, setErrorStep2] = useState('');
    const inputRefs = useRef([]);

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoadingStep1(true);
        setErrorStep1('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (err) {
            setErrorStep1(err.response?.data?.detail || 'Erro ao enviar código. Tente novamente.');
        } finally {
            setLoadingStep1(false);
        }
    };

    const handleDigitChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const code = digits.join('');

        if (code.length < 6) {
            setErrorStep2('Digite todos os 6 dígitos do código.');
            return;
        }
        if (newPassword.length < 6) {
            setErrorStep2('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorStep2('As senhas não coincidem.');
            return;
        }

        setLoadingStep2(true);
        setErrorStep2('');
        try {
            await api.post('/auth/reset-password', { email, code, new_password: newPassword });
            navigate('/login', { state: { message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' } });
        } catch (err) {
            setErrorStep2(err.response?.data?.detail || 'Erro ao redefinir senha. Verifique o código e tente novamente.');
        } finally {
            setLoadingStep2(false);
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
                {step === 1 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
                            <h2 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                                Esqueci minha senha
                            </h2>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Digite seu email e enviaremos um código para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleSendCode}>
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

                            {errorStep1 && <p className="error-text text-center">{errorStep1}</p>}

                            <button type="submit" className="btn-primary mt-4" disabled={loadingStep1}>
                                {loadingStep1 ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📬</div>
                            <h2 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                                Redefinir senha
                            </h2>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Enviamos um código para<br />
                                <strong style={{ color: 'var(--primary-color)' }}>{email}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            {/* Inputs de 6 dígitos */}
                            <p style={{ margin: '0 0 8px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                Código de verificação
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }} onPaste={handlePaste}>
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
                                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
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
                                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                                    >
                                        <EyeIcon open={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>

                            {errorStep2 && <p className="error-text text-center">{errorStep2}</p>}

                            <button type="submit" className="btn-primary mt-4" disabled={loadingStep2}>
                                {loadingStep2 ? 'Redefinindo...' : 'Redefinir senha'}
                            </button>
                        </form>

                        <p className="text-center mt-3" style={{ fontSize: '0.875rem' }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}
                            >
                                ← Usar outro email
                            </button>
                        </p>
                    </>
                )}

                <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                    <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        ← Voltar ao login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
