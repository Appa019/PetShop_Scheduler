import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { User, Mail, Calendar, PawPrint, LogOut, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import catProfileUrl from '../assets/cat_profile.png';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Busca usuário e agendamentos em paralelo para maior performance
                // pet_name já vem incluso em cada agendamento (AppointmentWithPetResponse)
                const [userRes, apptsRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/appointments/'),
                ]);
                setUser(userRes.data);
                // Ordena por data crescente (próximos primeiro)
                const sorted = apptsRes.data.sort(
                    (a, b) => new Date(a.date_time) - new Date(b.date_time)
                );
                setAppointments(sorted);
            } catch (err) {
                console.error("Error fetching profile data", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Activity size={40} style={{ color: 'var(--primary-color)' }} className="spin" />
            </div>
        );
    }

    return (
        <div className="page-container">
            <h2 className="profile-header">
                <User size={28} />
                Meu Perfil
            </h2>

            {/* User Info Card */}
            <div className="user-info-card" style={{ backgroundImage: `url(${catProfileUrl})` }}>
                <div className="user-avatar-container">
                    <User size={45} color="var(--primary-dark)" />
                </div>
                <h3 className="user-name">{user?.name}</h3>
                <p className="user-email">
                    <Mail size={16} /> {user?.email}
                </p>

                <button onClick={handleLogout} className="logout-pill-btn">
                    <LogOut size={18} /> Sair da Conta
                </button>
            </div>

            {/* Checkups and Scheduling Section */}
            <h3 className="section-label">
                <Calendar size={22} />
                Histórico de Checkups e Agendamentos
            </h3>

            {appointments.length === 0 ? (
                <div className="glass-card empty-state">
                    <Calendar size={40} className="empty-state-icon" />
                    <p className="empty-state-text">Você ainda não possui agendamentos.</p>
                    <button className="btn-primary mt-3" onClick={() => navigate('/schedule')} style={{ width: 'auto' }}>
                        Agendar Checkup
                    </button>
                </div>
            ) : (
                <div className="history-list">
                    {appointments.map(app => {
                        const date = new Date(app.date_time);
                        const isPast = date < new Date();
                        // pet_name já vem no response — não precisa buscar pets separadamente
                        const statusClass = isPast ? 'past' : 'upcoming';

                        return (
                            <div key={app.id} className="history-card" style={{ borderLeft: `4px solid ${isPast ? 'var(--color-success)' : 'var(--primary-color)'}` }}>
                                <PawPrint size={100} className="history-bg-icon" />

                                <div className={`history-icon-container ${statusClass}`}>
                                    {isPast ? <Activity size={24} /> : <Clock size={24} />}
                                </div>
                                <div className="history-content">
                                    <h4 className="history-title">
                                        <span>{app.pet_name ? `Consulta de ${app.pet_name}` : 'Consulta Veterinária'}</span>
                                        <span className={`status-badge ${statusClass}`}>
                                            {isPast ? 'Concluído' : 'Agendado'}
                                        </span>
                                    </h4>
                                    <div className="history-meta">
                                        <span className="meta-item">
                                            <Calendar size={14} />
                                            {date.toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="meta-item">
                                            <Clock size={14} />
                                            {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {app.notes && (
                                        <p className="history-notes">"{app.notes}"</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Profile;
