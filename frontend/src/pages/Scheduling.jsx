import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, listContainer, listItem } from '../lib/motion';
import './Scheduling.css';

const Scheduling = () => {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await api.get('/pets');
                const petsData = Array.isArray(res.data) ? res.data : [];
                setPets(petsData);
                if (petsData.length > 0) {
                    setSelectedPet(petsData[0].id.toString());
                }
            } catch (err) {
                console.error("Error fetching pets", err);
            }
        };
        fetchPets();
    }, []);

    useEffect(() => {
        if (selectedPet) {
            fetchSuggestions();
        }
    }, [selectedPet]);

    const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
            const res = await api.get(`/ai-suggest-appointments?pet_id=${selectedPet}`);
            setSuggestions(res.data);
        } catch (err) {
            console.error("Error fetching suggestions", err);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const applySuggestion = (appointmentType, intervalDays) => {
        const today = new Date();
        const suggestedDate = new Date(today.getTime() + intervalDays * 24 * 60 * 60 * 1000);

        // Format date for input (YYYY-MM-DD)
        const year = suggestedDate.getFullYear();
        const month = String(suggestedDate.getMonth() + 1).padStart(2, '0');
        const day = String(suggestedDate.getDate()).padStart(2, '0');

        setDate(`${year}-${month}-${day}`);
        setTime('10:00'); // Default time
        setNotes(appointmentType);
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Construct ISO datetime string
            const dateTimeString = new Date(`${date}T${time}:00`).toISOString();

            await api.post('/appointments', {
                pet_id: parseInt(selectedPet),
                date_time: dateTimeString,
                notes: notes
            });

            setSuccess('Consulta agendada com sucesso!');
            setTimeout(() => navigate('/'), 2500);

        } catch (err) {
            setError("Erro ao agendar: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="page-container"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
        >
            <h2 className="scheduling-header">
                <Calendar size={28} />
                Agendar Consulta
            </h2>
            <p className="scheduling-subtitle">Escolha o melhor horário para trazer o seu pet na 8Patas.</p>

            {success ? (
                <div className="glass-card text-center success-container">
                    <div className="success-icon">✅</div>
                    <h3 className="success-message">{success}</h3>
                    <p className="success-subtext">Redirecionando...</p>
                </div>
            ) : (
                <>
                    {/* AI Suggestions Section */}
                    {selectedPet && suggestions && (
                        <div className="glass-card mt-4 suggestions-card">
                            <h3 className="suggestions-header">
                                <Sparkles size={20} />
                                Sugestões Inteligentes
                            </h3>

                            {loadingSuggestions ? (
                                <p className="suggestions-loading">Analisando necessidades do pet...</p>
                            ) : (
                                <>
                                    <p className="suggestions-intro">
                                        Baseado na raça e idade do pet, recomendamos:
                                    </p>

                                    <motion.div
                                        className="suggestions-list"
                                        variants={listContainer}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {suggestions.appointments?.slice(0, 3).map((apt, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={listItem}
                                                onClick={() => applySuggestion(apt.type, apt.interval_days)}
                                                className={`suggestion-item-clean ${apt.priority || 'medium'}`}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div className="sug-type">{apt.type}</div>
                                                    <div className="sug-detail">{apt.reason} · em {apt.interval_days} dias</div>
                                                </div>
                                                <span className={`status-badge ${apt.priority || 'medium'}`}>
                                                    {apt.priority === 'high' ? 'Urgente' : apt.priority === 'low' ? 'Eletivo' : 'Importante'}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSchedule} className="glass-card mt-4">

                        <div className="input-group">
                            <label>Selecione o Pet</label>
                            {pets.length === 0 ? (
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Nenhum pet cadastrado. Vá até a aba Pets primeiro.</p>
                            ) : (
                                <select
                                    className="input-field select-field"
                                    value={selectedPet}
                                    onChange={(e) => setSelectedPet(e.target.value)}
                                    required
                                >
                                    {pets.map(pet => (
                                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label-icon">
                                <Calendar size={18} />
                                Data
                            </label>
                            <input
                                type="date"
                                className="input-field"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label-icon">
                                <Clock size={18} />
                                Hora
                            </label>
                            <input
                                type="time"
                                className="input-field"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de Atendimento</label>
                            <textarea
                                className="input-field"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ex: Checkup Geral, Vacinas, Banho e Tosa..."
                            />
                        </div>

                        {error && <p className="error-text text-center">{error}</p>}

                        <button type="submit" className="btn-primary mt-4" disabled={loading || pets.length === 0}>
                            {loading ? 'Agendando...' : 'Agendar Consulta'}
                        </button>
                    </form>
                </>
            )}
        </motion.div>
    );
};

export default Scheduling;
