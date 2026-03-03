import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, Clock, LogOut, PawPrint, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dogBannerUrl from '../assets/dog_banner.png';
import logoPataUrl from '../assets/logo_circulo.png';
import CalendarWidget from '../components/CalendarWidget';
import './Dashboard.css';

const PRIORITY_COLORS = {
    high: { bg: 'rgba(239, 68, 68, 0.07)', border: '#EF4444', text: '#B91C1C', dot: '#EF4444' },
    medium: { bg: 'rgba(123, 94, 167, 0.07)', border: 'var(--primary-light)', text: 'var(--primary-dark)', dot: 'var(--primary-color)' },
    low: { bg: 'rgba(16, 185, 129, 0.07)', border: '#10B981', text: '#065F46', dot: '#10B981' },
};

function parseNote(notes) {
    if (!notes) return { type: 'Consulta', reason: '', priority: 'medium' };
    const match = notes.match(/^\[(\w+)\]\s+(.+?)\s+-\s+(.+)$/);
    if (match) {
        return {
            priority: match[1].toLowerCase(),
            type: match[2],
            reason: match[3],
        };
    }
    return { type: notes, reason: '', priority: 'medium' };
}

const monthShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const AppointmentCard = ({ app, showDate }) => {
    const date = new Date(app.date_time);
    const { type, reason, priority } = parseNote(app.notes);
    const p = PRIORITY_COLORS[priority] ? priority : 'medium';

    return (
        <div className={`appt-card ${p}`}>
            {showDate ? (
                <div className="appt-icon">
                    <div>{String(date.getDate()).padStart(2, '0')}</div>
                    <div>{monthShort[date.getMonth()]}</div>
                </div>
            ) : (
                <div className="appt-icon clock">
                    <Clock size={20} />
                </div>
            )}

            <div style={{ flex: 1 }}>
                {app.pet_name && (
                    <div className="appt-pet-label">
                        <PawPrint size={11} />
                        {app.pet_name}
                        {app.pet_breed && (
                            <span className="appt-pet-breed"> · {app.pet_breed}</span>
                        )}
                    </div>
                )}
                <div className="appt-time">
                    {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {showDate && ` · ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                </div>
                <div className="appt-type">{type}</div>
                {reason && <div className="appt-reason">{reason}</div>}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedPetFilter, setSelectedPetFilter] = useState('all');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

                const [apptRes, petsRes] = await Promise.all([
                    api.get('/appointments/'),
                    api.get('/pets/')
                ]);
                setAppointments(apptRes.data);
                setPets(petsRes.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Filter appointments by selected pet
    const filteredAppointments = selectedPetFilter === 'all'
        ? appointments
        : appointments.filter(app => String(app.pet_id) === selectedPetFilter);

    const selectedDayAppointments = selectedDate ? filteredAppointments.filter(app => {
        const appDate = new Date(app.date_time);
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
        const appDateStr = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
        return appDateStr === dateStr;
    }) : [];

    const upcomingAppointments = filteredAppointments
        .filter(app => new Date(app.date_time) >= new Date().setHours(0, 0, 0, 0))
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
        .slice(0, 5);

    return (
        <div className="page-container">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h2 className="dashboard-welcome">
                        <img src={logoPataUrl} alt="8Patas" style={{ height: '44px', width: '44px', objectFit: 'contain' }} />
                        Olá, {user?.name?.split(' ')[0] || 'Cliente'}
                    </h2>
                    <p className="dashboard-subtitle">Bem-vindo à 8Patas</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={24} />
                </button>
            </header>

            {/* Banner */}
            <div className="dashboard-banner" style={{ backgroundImage: `url(${dogBannerUrl})` }}>
                <div className="dashboard-banner-content">
                    <h3 className="dashboard-banner-title">Agende com facilidade!</h3>
                    <p className="dashboard-banner-text">O melhor cuidado que seu pet merece.</p>
                </div>
            </div>

            {/* Pet Filter + Calendar */}
            {pets.length > 1 && (
                <div className="pet-filter-row">
                    <Filter size={16} color="var(--primary-color)" />
                    <select
                        value={selectedPetFilter}
                        onChange={(e) => setSelectedPetFilter(e.target.value)}
                        className="pet-filter-select"
                    >
                        <option value="all">🐾 Todos os Pets</option>
                        {pets.map(pet => (
                            <option key={pet.id} value={String(pet.id)}>
                                {pet.name}{pet.ai_breed ? ` — ${pet.ai_breed}` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <CalendarWidget
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                appointments={filteredAppointments}
            />

            {/* Consultas do Dia Selecionado */}
            {selectedDate && (
                <div className="glass-card flat mt-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <h3 className="section-title">
                        <Calendar size={20} />
                        Consultas de {selectedDate} de {monthNames[currentMonth.getMonth()]}
                    </h3>

                    {selectedDayAppointments.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={40} className="empty-state-icon" />
                            <p className="empty-state-text">Nenhuma consulta agendada para este dia.</p>
                        </div>
                    ) : (
                        <div className="card-list">
                            {selectedDayAppointments.map(app => (
                                <AppointmentCard key={app.id} app={app} showDate={false} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Próximas Consultas */}
            {!selectedDate && upcomingAppointments.length > 0 && (
                <div className="glass-card flat mt-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <h3 className="section-title">
                        <Clock size={20} />
                        Suas Próximas Consultas
                    </h3>

                    <div className="card-list">
                        {upcomingAppointments.map(app => (
                            <AppointmentCard key={app.id} app={app} showDate={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {appointments.length === 0 && (
                <div className="glass-card mt-4 empty-state">
                    <img src={logoPataUrl} alt="8Patas" className="empty-state-icon" style={{ height: '48px', width: '48px', objectFit: 'contain' }} />
                    <p className="empty-state-text">Nenhuma consulta agendada ainda.</p>
                    <button className="btn-primary" onClick={() => navigate('/schedule')} style={{ width: 'auto' }}>
                        Agendar Primeira Consulta
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
