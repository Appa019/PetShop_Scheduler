import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle, Sparkles, Heart, ShieldAlert, ChevronDown, ChevronUp,
    CheckCircle2, AlertCircle, Droplets, Scissors, Stethoscope, Trash2
} from 'lucide-react';

// ─── Helper: group care_script by category ──────────────────────────────────
function parseCareCategories(text) {
    if (!text) return [];
    const lines = text.split('\n').filter(l => l.trim());
    const categories = [];
    let currentCat = null;

    for (const line of lines) {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const content = isBullet ? trimmed.slice(2) : trimmed;

        // Detect category headers: lines starting with **Category:**
        const headerMatch = content.match(/^\*\*(.+?):\*\*\s*(.*)/);
        if (headerMatch) {
            currentCat = {
                title: headerMatch[1].trim(),
                items: [],
                icon: getCategoryIcon(headerMatch[1].trim())
            };
            // If there's text after the header on the same line, add it as first item
            if (headerMatch[2].trim()) {
                currentCat.items.push(headerMatch[2].trim());
            }
            categories.push(currentCat);
        } else if (currentCat) {
            currentCat.items.push(content);
        } else {
            // No category yet — create "Geral"
            if (!categories.find(c => c.title === 'Geral')) {
                currentCat = { title: 'Geral', items: [], icon: '📋' };
                categories.push(currentCat);
            } else {
                currentCat = categories.find(c => c.title === 'Geral');
            }
            currentCat.items.push(content);
        }
    }
    return categories;
}

function getCategoryIcon(title) {
    const lower = title.toLowerCase();
    if (lower.includes('alimenta') || lower.includes('dieta') || lower.includes('ração')) return '🍽️';
    if (lower.includes('exerc') || lower.includes('atividade')) return '🏃';
    if (lower.includes('vacin') || lower.includes('vermifug')) return '💉';
    if (lower.includes('dent') || lower.includes('bucal')) return '🦷';
    if (lower.includes('pelo') || lower.includes('pele') || lower.includes('banho') || lower.includes('tosa')) return '✂️';
    if (lower.includes('saúde') || lower.includes('exame') || lower.includes('check')) return '🩺';
    if (lower.includes('alergia') || lower.includes('alérgic')) return '⚠️';
    if (lower.includes('petisco') || lower.includes('snack')) return '🦴';
    if (lower.includes('sociali') || lower.includes('comporta')) return '🐾';
    if (lower.includes('castração') || lower.includes('reprodução')) return '🏥';
    return '📋';
}

// ─── Helper: render bold markdown in text ───────────────────────────────────
function renderBoldText(text) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, j) =>
        j % 2 === 1
            ? <strong key={j} style={{ color: 'var(--primary-dark)' }}>{part}</strong>
            : part
    );
}

// ─── Helper: parse symptoms with descriptions ──────────────────────────────
function parseSymptoms(symptomsStr) {
    if (!symptomsStr) return [];
    try {
        const parsed = JSON.parse(symptomsStr);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(item =>
            typeof item === 'string'
                ? { name: item, description: '' }
                : { name: item.name || item, description: item.description || '' }
        );
    } catch {
        return [];
    }
}

// ─── Section Toggle Button ──────────────────────────────────────────────────
const SectionToggle = ({ icon, label, count, isOpen, onToggle, accentColor, bgColor, borderColor }) => (
    <button
        onClick={onToggle}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: isOpen ? '14px 14px 0 0' : '14px',
            padding: '13px 16px',
            cursor: 'pointer',
            justifyContent: 'space-between',
            transition: 'all 0.25s ease',
            outline: 'none'
        }}
    >
        <span style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: accentColor, fontWeight: '700', fontSize: '0.9rem'
        }}>
            {icon}
            {label}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {count !== undefined && (
                <span style={{
                    background: accentColor,
                    color: 'white',
                    borderRadius: '20px',
                    padding: '2px 10px',
                    fontSize: '0.73rem',
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                }}>
                    {count}
                </span>
            )}
            {isOpen
                ? <ChevronUp size={16} color={accentColor} />
                : <ChevronDown size={16} color={accentColor} />
            }
        </span>
    </button>
);

// ─── Category Sub-Toggle ────────────────────────────────────────────────────
const CategoryToggle = ({ category, isOpen, onToggle }) => (
    <div style={{ marginBottom: isOpen ? '0' : '6px' }}>
        <button
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                background: isOpen ? 'rgba(123, 94, 167, 0.06)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(123,94,167,0.08)',
                padding: '10px 4px',
                cursor: 'pointer',
                justifyContent: 'space-between',
                outline: 'none',
                transition: 'all 0.2s ease'
            }}
        >
            <span style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)'
            }}>
                <span style={{ fontSize: '1rem' }}>{category.icon}</span>
                {category.title}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                    fontSize: '0.72rem', color: 'var(--text-muted)',
                    fontWeight: '500'
                }}>
                    {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
                </span>
                {isOpen
                    ? <ChevronUp size={14} color="var(--text-muted)" />
                    : <ChevronDown size={14} color="var(--text-muted)" />
                }
            </span>
        </button>
        {isOpen && (
            <div style={{
                padding: '6px 0 8px 12px',
                animation: 'fadeIn 0.2s ease-out'
            }}>
                {category.items.map((item, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '7px 0',
                        borderBottom: i < category.items.length - 1
                            ? '1px solid rgba(123,94,167,0.05)' : 'none',
                        alignItems: 'flex-start'
                    }}>
                        <CheckCircle2
                            size={14}
                            color="var(--primary-color)"
                            style={{ flexShrink: 0, marginTop: '3px' }}
                        />
                        <span style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.55',
                            color: 'var(--text-main)'
                        }}>
                            {renderBoldText(item)}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// ─── Formatted Breed Diseases ───────────────────────────────────────────────
function BreedDiseasesFormatted({ text }) {
    if (!text) return null;
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {paragraphs.map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                // Bold markdown rendering within paragraphs
                const parts = trimmed.split(/\*\*(.*?)\*\*/g);
                const rendered = parts.map((part, j) =>
                    j % 2 === 1
                        ? <strong key={j} style={{ color: '#DC2626' }}>{part}</strong>
                        : part
                );

                return (
                    <div key={idx} style={{
                        padding: '12px 14px',
                        background: idx % 2 === 0 ? 'rgba(239,68,68,0.03)' : 'transparent',
                        borderRadius: '10px',
                        borderLeft: '3px solid rgba(239,68,68,0.3)'
                    }}>
                        <p style={{
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            lineHeight: '1.75',
                            margin: 0
                        }}>
                            {rendered}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
const PetsList = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await api.get('/pets/');
                setPets(res.data);
            } catch (err) {
                console.error("Error fetching pets", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, [navigate]);

    const handleDeletePet = async (petId, petName) => {
        if (!window.confirm(`Tem certeza que deseja remover ${petName}? Todas as consultas agendadas também serão removidas.`)) return;
        setDeleting(petId);
        try {
            await api.delete(`/pets/${petId}`);
            setPets(prev => prev.filter(p => p.id !== petId));
        } catch (err) {
            alert('Erro ao remover pet: ' + (err.response?.data?.detail || err.message));
        } finally {
            setDeleting(null);
        }
    };

    const toggle = (petId, section) =>
        setExpanded(prev => ({
            ...prev,
            [petId]: { ...(prev[petId] || {}), [section]: !(prev[petId]?.[section]) }
        }));

    const isOpen = (petId, section) => !!(expanded[petId]?.[section]);

    return (
        <div className="page-container">
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0 }}>Meus Pets</h2>
                <button
                    onClick={() => navigate('/pets/new')}
                    style={{
                        background: 'none', border: 'none',
                        color: 'var(--primary-color)', cursor: 'pointer'
                    }}
                >
                    <PlusCircle size={32} />
                </button>
            </div>

            {loading ? (
                <p className="text-center">Carregando seus pets...</p>
            ) : pets.length === 0 ? (
                <div className="glass-card text-center" style={{ padding: '40px 20px' }}>
                    <p>Você ainda não cadastrou nenhum pet.</p>
                    <button className="btn-primary mt-4" onClick={() => navigate('/pets/new')}>
                        Cadastrar Pet
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {pets.map(pet => {
                        const symptoms = parseSymptoms(pet.ai_suggested_symptoms);
                        const careCategories = parseCareCategories(pet.ai_care_script);
                        const careOpen = isOpen(pet.id, 'care');
                        const symptomsOpen = isOpen(pet.id, 'symptoms');
                        const diseasesOpen = isOpen(pet.id, 'diseases');

                        const totalCareItems = careCategories.reduce((sum, c) => sum + c.items.length, 0);

                        return (
                            <div key={pet.id} className="glass-card" style={{
                                padding: '0', overflow: 'hidden',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                            }}>

                                {/* ── Photo ── */}
                                {pet.photo_url && (
                                    <div style={{
                                        width: '100%',
                                        height: '220px',
                                        backgroundImage: `url(${pet.photo_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '60px',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.4))'
                                        }} />
                                        {pet.ai_breed && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: pet.ai_breed.startsWith('SRD')
                                                    ? 'var(--secondary-color)'
                                                    : 'var(--primary-color)',
                                                color: 'white',
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                fontSize: '0.78rem',
                                                fontWeight: '700',
                                                maxWidth: '200px',
                                                textAlign: 'center',
                                                lineHeight: '1.4',
                                                backdropFilter: 'blur(6px)',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.25)'
                                            }}>
                                                {pet.ai_breed}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ padding: '18px 20px 22px' }}>

                                    {/* ── Name + Meta + Delete ── */}
                                    <div style={{
                                        marginBottom: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                margin: 0, fontSize: '1.4rem',
                                                color: 'var(--text-main)'
                                            }}>
                                                {pet.name}
                                            </h3>
                                            <p style={{
                                                margin: '4px 0 0',
                                                color: 'var(--text-muted)',
                                                fontSize: '0.88rem'
                                            }}>
                                                {pet.age}
                                                {pet.size ? ` · ${pet.size}` : ''}
                                                {pet.weight ? ` · ${pet.weight}` : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePet(pet.id, pet.name)}
                                            disabled={deleting === pet.id}
                                            title="Remover pet"
                                            style={{
                                                background: deleting === pet.id
                                                    ? 'rgba(239,68,68,0.15)'
                                                    : 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                                borderRadius: '10px',
                                                padding: '8px',
                                                cursor: deleting === pet.id ? 'wait' : 'pointer',
                                                color: '#DC2626',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                opacity: deleting === pet.id ? 0.5 : 1
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* No-photo breed badge fallback */}
                                    {!pet.photo_url && pet.ai_breed && (
                                        <div style={{
                                            display: 'inline-block',
                                            background: pet.ai_breed.startsWith('SRD')
                                                ? 'var(--secondary-color)'
                                                : 'var(--primary-light)',
                                            color: 'white',
                                            padding: '4px 14px',
                                            borderRadius: '20px',
                                            fontSize: '0.78rem',
                                            fontWeight: '700',
                                            marginBottom: '10px'
                                        }}>
                                            {pet.ai_breed}
                                        </div>
                                    )}

                                    {/* Basic info */}
                                    {pet.basic_info && (
                                        <p style={{
                                            marginTop: '4px', marginBottom: '16px',
                                            fontSize: '0.88rem', color: 'var(--text-muted)',
                                            lineHeight: '1.5'
                                        }}>
                                            {pet.basic_info}
                                        </p>
                                    )}

                                    {/* ═══════════════════════════════════════════
                                        Section: Cuidados Personalizados
                                    ═══════════════════════════════════════════ */}
                                    {pet.ai_care_script && (
                                        <div style={{ marginTop: '14px' }}>
                                            <SectionToggle
                                                icon={<Sparkles size={15} />}
                                                label="Cuidados Personalizados"
                                                count={totalCareItems}
                                                isOpen={careOpen}
                                                onToggle={() => toggle(pet.id, 'care')}
                                                accentColor="var(--primary-color)"
                                                bgColor="rgba(123, 94, 167, 0.06)"
                                                borderColor="rgba(123, 94, 167, 0.18)"
                                            />
                                            {careOpen && (
                                                <div style={{
                                                    background: 'rgba(123, 94, 167, 0.02)',
                                                    border: '1px solid rgba(123,94,167,0.18)',
                                                    borderTop: 'none',
                                                    borderRadius: '0 0 14px 14px',
                                                    padding: '10px 14px 6px',
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}>
                                                    {careCategories.length > 0 ? (
                                                        careCategories.map((cat, idx) => (
                                                            <CategoryToggle
                                                                key={idx}
                                                                category={cat}
                                                                isOpen={isOpen(pet.id, `cat_${idx}`)}
                                                                onToggle={() => toggle(pet.id, `cat_${idx}`)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p style={{
                                                            fontSize: '0.85rem',
                                                            color: 'var(--text-muted)',
                                                            padding: '10px 0'
                                                        }}>
                                                            {pet.ai_care_script}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ═══════════════════════════════════════════
                                        Section: Condições a Monitorar
                                    ═══════════════════════════════════════════ */}
                                    {symptoms.length > 0 && (
                                        <div style={{ marginTop: '10px' }}>
                                            <SectionToggle
                                                icon={<ShieldAlert size={15} />}
                                                label={`Saúde de ${pet.name}`}
                                                count={symptoms.length}
                                                isOpen={symptomsOpen}
                                                onToggle={() => toggle(pet.id, 'symptoms')}
                                                accentColor="#D97706"
                                                bgColor="rgba(217, 119, 6, 0.06)"
                                                borderColor="rgba(217, 119, 6, 0.2)"
                                            />
                                            {symptomsOpen && (
                                                <div style={{
                                                    background: 'rgba(217,119,6,0.02)',
                                                    border: '1px solid rgba(217,119,6,0.2)',
                                                    borderTop: 'none',
                                                    borderRadius: '0 0 14px 14px',
                                                    padding: '12px 14px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}>
                                                    {symptoms.map((condition, idx) => (
                                                        <div key={idx} style={{
                                                            display: 'flex',
                                                            gap: '12px',
                                                            padding: '12px 14px',
                                                            background: 'rgba(217, 119, 6, 0.04)',
                                                            border: '1px solid rgba(217, 119, 6, 0.15)',
                                                            borderRadius: '12px',
                                                            alignItems: 'flex-start'
                                                        }}>
                                                            <div style={{
                                                                width: '30px', height: '30px',
                                                                borderRadius: '50%',
                                                                background: 'rgba(217, 119, 6, 0.12)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                <AlertCircle size={15} color="#D97706" />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontWeight: '700',
                                                                    fontSize: '0.9rem',
                                                                    color: '#92400E'
                                                                }}>
                                                                    {condition.name}
                                                                </p>
                                                                {condition.description && (
                                                                    <p style={{
                                                                        margin: '4px 0 0',
                                                                        fontSize: '0.82rem',
                                                                        color: 'var(--text-muted)',
                                                                        lineHeight: '1.5'
                                                                    }}>
                                                                        {condition.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ═══════════════════════════════════════════
                                        Section: Perfil de Saúde da Raça
                                    ═══════════════════════════════════════════ */}
                                    {pet.ai_breed_diseases && (
                                        <div style={{ marginTop: '10px' }}>
                                            <SectionToggle
                                                icon={<Heart size={15} />}
                                                label="Perfil de Saúde da Raça"
                                                isOpen={diseasesOpen}
                                                onToggle={() => toggle(pet.id, 'diseases')}
                                                accentColor="#DC2626"
                                                bgColor="rgba(239, 68, 68, 0.06)"
                                                borderColor="rgba(239, 68, 68, 0.2)"
                                            />
                                            {diseasesOpen && (
                                                <div style={{
                                                    background: 'rgba(239,68,68,0.02)',
                                                    border: '1px solid rgba(239,68,68,0.2)',
                                                    borderTop: 'none',
                                                    borderRadius: '0 0 14px 14px',
                                                    padding: '14px',
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}>
                                                    <BreedDiseasesFormatted text={pet.ai_breed_diseases} />
                                                </div>
                                            )}
                                        </div>
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

export default PetsList;
