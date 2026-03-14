import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera, CheckCircle, Activity, Calendar as CalendarIcon,
    ChevronLeft, AlertCircle, Sparkles, PawPrint, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../lib/motion';
import api from '../api/axios';
import './PetRegistration.css';

// ─── AI Loading Screen ────────────────────────────────────────────────────────
const PROGRESS_STEPS = [8, 18, 30, 42, 53, 63, 71, 78, 84, 89, 93, 96];

const AILoadingScreen = ({ message, submessage }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
        let i = 0;
        const interval = setInterval(() => {
            if (i < PROGRESS_STEPS.length) {
                setProgress(PROGRESS_STEPS[i]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ai-loading-screen fade-in">
            <div className="ai-loading-icon">
                <Sparkles size={52} />
            </div>
            <h3 className="ai-loading-title">{message}</h3>
            {submessage && <p className="ai-loading-sub">{submessage}</p>}

            <div className="ai-progress-track">
                <div
                    className="ai-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="ai-progress-label">{progress}% concluído</p>

            <p className="ai-loading-wait">
                Isso pode demorar até 30 segundos — a IA está trabalhando!
            </p>

            <div className="ai-loading-dots">
                <span /><span /><span />
            </div>
        </div>
    );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ['form', 'breed-confirm', 'symptoms', 'schedule'];

const StepIndicator = ({ currentStep }) => {
    const idx = STEPS.indexOf(currentStep);
    return (
        <div className="step-indicator">
            {STEPS.map((s, i) => (
                <div
                    key={s}
                    className={`step-dot ${i === idx ? 'active' : i < idx ? 'done' : ''}`}
                />
            ))}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PetRegistration = () => {
    // Form inputs
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [basicInfo, setBasicInfo] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Navigation state
    const [step, setStep] = useState('form');
    const [loadingMsg, setLoadingMsg] = useState({ title: '', sub: '' });

    // AI / pet data
    const [petId, setPetId] = useState(null);
    const [aiBreed, setAiBreed] = useState('');
    const [confirmedBreed, setConfirmedBreed] = useState('');
    const [manualBreed, setManualBreed] = useState('');
    const [availableSymptoms, setAvailableSymptoms] = useState([]);
    const [schedule, setSchedule] = useState(null);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ── Helpers ──────────────────────────────────────────────────────────────
    const startLoading = (title, sub = '') => {
        setError('');
        setLoadingMsg({ title, sub });
        setStep('loading');
    };

    const isSRD = (breed) => breed?.toUpperCase().startsWith('SRD');

    const extractMixPart = (breed) => {
        const dashIdx = breed?.indexOf(' - ');
        return dashIdx !== -1 ? breed.slice(dashIdx + 3) : '';
    };

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('A foto do pet é obrigatória para a análise da nossa IA.');
            return;
        }
        startLoading('Analisando a foto...', `Identificando raça, porte e características de ${name}`);

        try {
            // Convert file to base64
            const photoDataUrl = await fileToBase64(file);
            const photoBase64 = photoDataUrl.split(',')[1];

            // Step 1: Create pet in DB
            const petRes = await api.post('/pets', {
                name,
                age,
                basic_info: basicInfo,
                size: size || '',
                weight: weight || '',
                photo_url: photoDataUrl,
            });

            const createdPetId = petRes.data.id;
            setPetId(createdPetId);

            // Step 2: Analyze with AI
            const aiRes = await api.post('/ai-analyze', {
                pet_id: createdPetId,
                pet_name: name,
                pet_age: age,
                basic_info: basicInfo,
                pet_size: size || '',
                pet_weight: weight || '',
                photo_base64: photoBase64,
            });

            const aiData = aiRes.data;

            let parsedSymptoms = [
                { name: 'Apatia', description: 'Seu pet parece sem energia ou menos animado que o normal.' },
                { name: 'Falta de Apetite', description: 'Recusa em comer por mais de 1 dia pode indicar dor ou doença.' },
                { name: 'Vômito', description: 'Episódios frequentes merecem atenção veterinária.' },
                { name: 'Diarreia', description: 'Fezes líquidas por mais de 24h exigem avaliação.' },
                { name: 'Coceira Excessiva', description: 'Pode indicar alergia ou parasitas.' }
            ];
            try {
                const raw = aiData.suggested_symptoms || [];
                parsedSymptoms = raw.map(item =>
                    typeof item === 'string' ? { name: item, description: '' } : item
                );
            } catch (_) {}

            setAiBreed(aiData.breed || '');
            setConfirmedBreed(aiData.breed || '');
            setAvailableSymptoms(parsedSymptoms);
            setStep('breed-confirm');
        } catch (err) {
            setError('Erro ao cadastrar pet: ' + (err.response?.data?.detail || err.message));
            setStep('form');
        }
    };

    const handleConfirmAIBreed = () => {
        setConfirmedBreed(aiBreed);
        setStep('symptoms');
    };

    const handleUseManualBreed = () => {
        if (!manualBreed.trim()) return;
        setConfirmedBreed(manualBreed.trim());
        setStep('symptoms');
    };

    const handleIdentifyMix = async () => {
        startLoading(
            `Identificando a mistura de ${name}...`,
            'Analisando características visuais para determinar as raças presentes'
        );
        try {
            const res = await api.post('/ai-breed-mix', { pet_id: petId });
            setAiBreed(res.data.breed);
            setConfirmedBreed(res.data.breed);
        } catch (err) {
            setAiBreed('SRD');
            setConfirmedBreed('SRD');
            setError('Não foi possível identificar a mistura. Usando "SRD".');
        }
        setStep('breed-confirm');
    };

    const handleGenerateSchedule = async () => {
        startLoading(
            'Criando cronograma de cuidados...',
            `Montando o plano de saúde de ${name} para os próximos 5 anos`
        );
        const symptomNames = availableSymptoms.slice(0, 8).map(s => s.name);
        const payload = { pet_id: petId, symptoms: symptomNames };
        if (confirmedBreed !== aiBreed) payload.breed_override = confirmedBreed;

        try {
            const res = await api.post('/ai-suggest-appointments', payload);
            setSchedule(res.data);
            setStep('schedule');
        } catch (err) {
            setError('Erro ao gerar cronograma: ' + (err.response?.data?.detail || err.message));
            setStep('symptoms');
        }
    };

    const goBack = () => {
        if (step === 'form') navigate(-1);
        else if (step === 'breed-confirm') setStep('form');
        else if (step === 'symptoms') setStep('breed-confirm');
        else navigate('/pets');
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <motion.div
            className="page-container"
            style={{ paddingBottom: '30px' }}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
        >

            {/* ── Loading ── */}
            {step === 'loading' && (
                <AILoadingScreen message={loadingMsg.title} submessage={loadingMsg.sub} />
            )}

            {/* ── Back button + step dots (shown on all real steps) ── */}
            {step !== 'loading' && (
                <>
                    <button onClick={goBack} className="pet-reg-header">
                        <ChevronLeft size={20} />
                        {step === 'form' ? 'Voltar' : 'Anterior'}
                    </button>
                    <StepIndicator currentStep={step} />
                </>
            )}

            {/* STEP 1 — Formulário */}
            {step === 'form' && (
                <>
                    <h2>Cadastrar Pet</h2>
                    <p>Nossa IA irá analisar a foto para identificar a raça e montar um guia de cuidados!</p>

                    <form onSubmit={handleSubmitForm} className="glass-card mt-4 fade-in">
                        <div className="input-group text-center">
                            <label>Foto do Pet (Obrigatório)</label>
                            <div
                                className={`photo-upload-area ${preview ? 'has-preview' : 'empty'}`}
                                onClick={() => document.getElementById('photo-upload').click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="photo-preview" />
                                ) : (
                                    <>
                                        <Camera size={40} color="var(--color-accent-light)" />
                                        <span className="upload-prompt">Toque para escolher a foto</span>
                                    </>
                                )}
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="input-group mt-4">
                            <label>Nome do Pet</label>
                            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <label>Idade (ex: 2 anos)</label>
                            <input type="text" className="input-field" value={age} onChange={(e) => setAge(e.target.value)} required />
                        </div>

                        <div className="pet-reg-row">
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Porte</label>
                                <select className="input-field" value={size} onChange={(e) => setSize(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    <option value="Miniatura">Miniatura (até 3kg)</option>
                                    <option value="Pequeno">Pequeno (3-10kg)</option>
                                    <option value="Médio">Médio (10-25kg)</option>
                                    <option value="Grande">Grande (25-45kg)</option>
                                    <option value="Gigante">Gigante (45kg+)</option>
                                </select>
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Peso Aprox. (kg)</label>
                                <input type="text" className="input-field" placeholder="Ex: 12kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Informações Adicionais / Problemas de saúde</label>
                            <textarea
                                className="input-field"
                                style={{ minHeight: '80px', resize: 'vertical' }}
                                placeholder="Ex: Castrado, alérgico a frango, manca da pata traseira..."
                                value={basicInfo}
                                onChange={(e) => setBasicInfo(e.target.value)}
                            />
                        </div>

                        {error && <p className="error-text text-center">{error}</p>}

                        <button type="submit" className="btn-primary mt-4">
                            <Sparkles size={20} /> Salvar e Analisar
                        </button>
                    </form>
                </>
            )}

            {/* STEP 2 — Confirmação de Raça */}
            {step === 'breed-confirm' && (
                <>
                    <h2>Confirmar Raça</h2>
                    <p>
                        A IA analisou a foto de <strong>{name}</strong>.
                        A identificação está correta?
                    </p>

                    <div className="glass-card mt-4 fade-in">
                        <div className="breed-display">
                            <p className="breed-display-label">Raça identificada pela IA</p>

                            {isSRD(aiBreed) ? (
                                <>
                                    <div className="breed-srd-badge">SRD</div>
                                    <p className="breed-display-mix">
                                        {extractMixPart(aiBreed) || 'Sem raça definida'}
                                    </p>
                                </>
                            ) : (
                                <p className="breed-display-value">{aiBreed || '—'}</p>
                            )}
                        </div>

                        <button onClick={handleConfirmAIBreed} className="btn-primary">
                            <CheckCircle size={20} /> Sim, está correto!
                        </button>

                        <div className="breed-divider">
                            <span>Não está correto?</span>
                        </div>

                        <div className="manual-breed-row">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Ex: Golden Retriever"
                                value={manualBreed}
                                onChange={(e) => setManualBreed(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUseManualBreed()}
                                style={{ margin: 0 }}
                            />
                            <button
                                onClick={handleUseManualBreed}
                                className="btn-outline-sm"
                                disabled={!manualBreed.trim()}
                            >
                                Usar
                            </button>
                        </div>

                        <button
                            onClick={handleIdentifyMix}
                            className="btn-ghost pet-reg-ghost"
                            style={{ marginTop: '10px' }}
                        >
                            <PawPrint size={18} /> Meu pet não tem raça definida
                        </button>

                        {error && (
                            <p className="error-text text-center" style={{ marginTop: '12px' }}>
                                {error}
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* STEP 3 — Condições de Saúde */}
            {step === 'symptoms' && (
                <>
                    <h2>Saúde de {name}</h2>
                    <p>Condições de saúde mais comuns para a raça de <strong>{name}</strong>. Fique atento a esses sinais.</p>

                    <div className="glass-card mt-4 fade-in">
                        <div className="confirmed-breed-pill">
                            <ShieldAlert size={14} /> {confirmedBreed}
                        </div>

                        <h4 style={{ marginBottom: '4px', marginTop: '4px' }}>
                            Condições a conhecer
                        </h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                            Estas são as condições mais frequentes para esta raça. Conhecê-las ajuda na prevenção.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {availableSymptoms.slice(0, 8).map((symptom, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    background: 'rgba(217, 119, 6, 0.05)',
                                    border: '1px solid rgba(217, 119, 6, 0.18)',
                                    borderRadius: '8px',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px',
                                        borderRadius: '50%',
                                        background: 'rgba(217, 119, 6, 0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <AlertCircle size={15} color="#D97706" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.92rem', color: 'var(--color-text)' }}>
                                            {symptom.name}
                                        </p>
                                        {symptom.description && (
                                            <p style={{ margin: '3px 0 0', fontSize: '0.83rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                                                {symptom.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {error && <p className="error-text text-center">{error}</p>}

                        <button onClick={handleGenerateSchedule} className="btn-primary">
                            <Activity size={20} /> Criar Cronograma de Cuidados
                        </button>
                    </div>
                </>
            )}

            {/* STEP 4 — Cronograma */}
            {step === 'schedule' && schedule && (
                <>
                    <h2>Cronograma Criado!</h2>
                    <p>Plano personalizado para <strong>{name}</strong> nos próximos 5 anos.</p>

                    <div className="glass-card mt-4 fade-in success-schedule-box">
                        <div className="success-schedule-header">
                            <CalendarIcon size={24} />
                            <h4>Consultas adicionadas à sua Agenda!</h4>
                        </div>

                        {schedule.next_recommended && (
                            <p className="urgent-note">
                                <AlertCircle size={18} color="#E53E3E" />
                                Mais Urgente: {schedule.next_recommended}
                            </p>
                        )}

                        <div className="schedule-list">
                            {schedule.appointments?.map((appt, i) => (
                                <div key={i} className="schedule-item">
                                    <strong>{appt.type}</strong>
                                    <span className="interval">(em ~{appt.interval_days} dias)</span>
                                    <p className="reason">{appt.reason}</p>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => navigate('/profile')} className="btn-primary mt-4">
                            <CheckCircle size={20} /> Ver Minhas Consultas no Perfil
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default PetRegistration;
