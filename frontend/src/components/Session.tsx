import { useState, useEffect } from 'react';

import api from '../services/api';


export interface SessionItem {
    id: number;
    duration: number;
    created_at: string;
}

interface SessionProps {
    refreshToggle: boolean;
}

export default function StatsWidget({refreshToggle}: SessionProps) {
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalDurationSeconds: 0,
        todayDurationSeconds: 0,
        averageDuration: 0,
        lastActive: "--/--/----, --:--"
    });

    const goalMinutes = 7200;

    const fetchStats = async () => {
        try {
            const response = await api.get('/session');
            const sessions: SessionItem[] = response.data.session || [];

            if (sessions.length > 0) {
                const totalSecs = sessions.reduce((acc, curr) => acc + curr.duration, 0);

                const todayString = new Date().toDateString();
                const todaySessions = sessions.filter(session => {
                    const sessionDate = new Date(session.created_at).toDateString();
                    return sessionDate === todayString;
                });
                const todaySecs = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);
                
                const avgSecs = Math.round(totalSecs / sessions.length);
                
                const lastSession = sessions[sessions.length - 1];
                const lastTime = new Date(lastSession.created_at).toLocaleString('en-GB', { 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                setStats({
                    totalSessions: sessions.length,
                    totalDurationSeconds: totalSecs,
                    todayDurationSeconds: todaySecs,
                    averageDuration: avgSecs,
                    lastActive: lastTime
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refreshToggle]);

    const progressPercentage = Math.min((stats.todayDurationSeconds / goalMinutes) * 100, 100);

    const formatHours = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    return (
        <div className="relative bg-gray-800/60 backdrop-blur-sm border-2 border-gray-500 rounded-lg p-4 text-white font-mono w-82 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex flex-col">
            <div className="border-b-2 border-gray-600 pb-2 mb-4">
                <h2 className="text-sm font-bold text-violet-400 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(52,0,153,0.8)]">
                    Stats
                </h2>
            </div>

            <div className="mb-4 flex flex-row justify-between">
                <div className='text-center bg-gray-900/50 py-2 px-3 rounded-lg'>
                    <p className="text-xs text-white uppercase tracking-wide">Total Focus</p>
                    <p className="text-3xl font-bold text-violet-400 drop-shadow-[0_0_8px_rgba(52,0,153,0.8)]">
                        {formatHours(stats.totalDurationSeconds)}
                    </p>
                </div>
                <div className='text-center  bg-gray-900/50 py-2 px-3 rounded-lg'>
                    <p className="text-xs text-white uppercase tracking-wide">Today Focus</p>
                    <p className="text-3xl font-bold text-violet-400 drop-shadow-[0_0_8px_rgba(52,0,153,0.8)]">
                        {formatHours(stats.todayDurationSeconds)}
                    </p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Total Sessions</span>
                    <span className="font-bold text-gray-200">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Average Time</span>
                    <span className="font-bold text-gray-200">{formatHours(stats.averageDuration)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Last Session</span>
                    <span className="font-bold text-gray-200">{stats.lastActive}</span>
                </div>
            </div>

            <div className="mt-auto pt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Daily Goal (2h)</span>
                    <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full border border-gray-600 overflow-hidden">
                    <div
                        className="bg-violet-500 h-full transition-all duration-1000"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}