import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarWidget.css';

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarWidget = ({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate, appointments }) => {
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
    };

    const getAppointmentsForDate = (day) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return appointments.filter(app => {
            const appDate = new Date(app.date_time);
            const appDateStr = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
            return appDateStr === dateStr;
        });
    };

    const changeMonth = (direction) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return (
        <div className="glass-card calendar-widget">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} className="calendar-nav-btn">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="calendar-title">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button onClick={() => changeMonth(1)} className="calendar-nav-btn">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-weekdays">
                {weekDays.map((day, index) => (
                    <div key={index} className="weekday-name">{day}</div>
                ))}
            </div>

            <div className="calendar-days">
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} />;
                    }

                    const dayAppointments = getAppointmentsForDate(day);
                    const hasAppointments = dayAppointments.length > 0;
                    const isTodayDate = isToday(day);
                    const isSelected = selectedDate === day;

                    let className = "calendar-day-cell";
                    if (isSelected) className += " selected";
                    else if (isTodayDate) className += " today";
                    else if (hasAppointments) className += " has-appointments";

                    return (
                        <div
                            key={day}
                            onClick={() => setSelectedDate(day)}
                            className={className}
                        >
                            <span className="day-number">{day}</span>
                            {hasAppointments && (
                                <div className="appointment-dots">
                                    {dayAppointments.slice(0, 3).map((_, idx) => (
                                        <div key={idx} className="dot" />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;
