

import { useEffect, useState } from 'react';
import api from '../services/api';
import { TaskItem } from './Task';

import { motion } from 'framer-motion';

interface TimerProps {
    isGuest?: boolean;
    activeTask: TaskItem | null;
    onSelectTask: (task: TaskItem) => void;
    endSession: () => void;
}

export default function Timer({ isGuest, activeTask, onSelectTask, endSession }: TimerProps) {
    const [initialSeconds, setInitialSeconds] = useState(1500);
    const [seconds, setSeconds] = useState(1500);
    const [isActive, setIsActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [availableTasks, setAvailableTasks] = useState<TaskItem[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);

    const [showTimeUp, setShowTimeUp] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (isActive && seconds === 0) {
            setIsActive(false);
            if (interval) clearInterval(interval);

            //time up
            setShowTimeUp(true);
            
            const saveSession = async () => {
                if (!activeTask || !startTime) return;

                if (isGuest) {
                    setStartTime(null);
                    setSeconds(initialSeconds);
                    return; 
                }

                try {
                    setIsSaving(true);
                    const endTime = new Date().toISOString();
                    const durationMinutes = Math.round(initialSeconds / 60);
                    
                    await api.post('/session', {
                        task_id: activeTask.id,
                        start_time: startTime,
                        end_time: endTime,
                        duration: durationMinutes
                    });

                    endSession();
                    
                    setStartTime(null);
                    setSeconds(initialSeconds);
                } catch (error) {
                    console.error("Failed to save session:", error);
                } finally {
                    setIsSaving(false);
                }
            };

            saveSession();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, activeTask, initialSeconds, startTime, endSession, isGuest]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (!isActive && seconds === initialSeconds) {
            setStartTime(new Date().toISOString());
        }
        setIsActive(!isActive);
    };

    const stopTimer = () => {
        setIsActive(false);
    };

    const handleEndSession = async () => {
        if (!activeTask || !startTime || seconds === initialSeconds) {
            setIsActive(false);
            setSeconds(initialSeconds);
            setStartTime(null);
            return;
        }

        setIsActive(false);

        if (isGuest) {
            setSeconds(initialSeconds);
            setStartTime(null);
            return;
        }

        try {
            setIsSaving(true);
            const endTime = new Date().toISOString();
            const timeSpentSeconds = initialSeconds - seconds;
            // const durationMinutes = Math.max(1, Math.round(timeSpentSeconds / 60));

            await api.post('/session', {
                task_id: activeTask.id,
                start_time: startTime,
                end_time: endTime,
                duration: timeSpentSeconds
            });

            endSession();

        } catch (error) {
            console.error("Failed to save manual session:", error);
        } finally {
            setIsSaving(false);
            setSeconds(initialSeconds);
            setStartTime(null);
        }
    };

    const increaseTimer = () => {
        const newSeconds = initialSeconds + 300;
        setInitialSeconds(newSeconds);
        setSeconds(newSeconds);
    };

    const decreaseTimer = () => {
        const newSeconds = initialSeconds - 300;
        if (newSeconds >= 60) {
            setInitialSeconds(newSeconds);
            setSeconds(newSeconds);
        }
    };

    const isLimitReached = seconds === 0;

    
    // buat dropdown
    const toggleDropdown = async () => {
        if (isActive) return; 

        if (!isDropdownOpen) {
            if (isGuest) {
                setAvailableTasks([{
                    id: 9999,
                    title: "Guest Focus Mode (Not Saved)",
                    body: "",
                    status: "On Progress"
                }]);
                setIsDropdownOpen(true);
                return;
            }

            setIsLoadingTasks(true);
            try {
                const response = await api.get('/tasks');
                const fetchedTasks = response.data.task || response.data.data || [];
                
                const activeOnly = fetchedTasks.filter((t: TaskItem) => t.status !== 'Done');
                setAvailableTasks(activeOnly);
            } catch (error) {
                console.error("Failed to fetch tasks for timer:", error);
            } finally {
                setIsLoadingTasks(false);
            }
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleTaskSelection = (task: TaskItem) => {
        onSelectTask(task);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> 

        if (showTimeUp){
            timeoutId = setTimeout(() => {
                setShowTimeUp(false);
            }, 3000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
            
    }, [showTimeUp])
    
    return (
        <div className="relative z-10 bg-gray-800/60 backdrop-blur-sm border-2 border-gray-500 rounded-lg p-5 text-white font-mono w-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex flex-col items-center">
            
            {/* <div className="w-full text-center mb-4 px-2 py-1.5 bg-gray-900/50 rounded border border-gray-600 truncate">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-0.5">Focusing On:</span>
                <span className={`text-sm font-bold ${activeTask ? 'text-violet-300' : 'text-gray-500'}`}>
                    {activeTask ? activeTask.title : "NO TASK SELECTED"}
                </span>
            </div> */}
            <div className="relative w-full text-center mb-4">
                <button
                    onClick={toggleDropdown}
                    disabled={isActive}
                    className="relative w-full px-8 py-2 bg-gray-900/50 hover:bg-gray-800 rounded border border-gray-600 transition-colors cursor-pointer group flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-0.5 group-hover:text-violet-400 transition-colors">
                        {activeTask ? "Focusing On:" : "Select Task to Start Timer"}
                    </span>
                    
                    <span className={`text-sm font-bold truncate w-full ${activeTask ? 'text-violet-300' : 'animate-pulse text-gray-500'}`}>
                        {activeTask ? activeTask.title : "NO TASK SELECTED"}
                    </span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-violet-400 transition-colors">
                        <svg 
                            className="w-5 h-5 transition-transform duration-300 rotate-0"
                            aria-hidden="true" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path fillRule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clipRule="evenodd"/>
                        </svg>
                    </div>
                </button>

                {isDropdownOpen && (
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="absolute top-full left-0 mt-2 w-full bg-gray-800 border-2 border-gray-600 rounded-md z-100 shadow-[0_4px_20px_rgba(0,0,0,0.8)] max-h-48 overflow-y-auto custom-scrollbar text-left">
                        {isLoadingTasks ? (
                            <div className="p-3 text-center text-xs text-gray-400 animate-pulse">Scanning tasks...</div>
                        ) : availableTasks.length > 0 ? (
                            availableTasks.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => handleTaskSelection(t)}
                                    className="p-3 border-b border-gray-700 last:border-0 hover:bg-violet-600/40 cursor-pointer transition-colors text-sm text-gray-200 truncate"
                                >
                                    {t.title}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-xs text-gray-400 bg-gray-900/50">
                                No active tasks found.
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <div className="text-center items-center w-full">
                <div className='flex justify-between items-center px-4'>
                    <button disabled={isActive || seconds !== initialSeconds} onClick={decreaseTimer} className='cursor-pointer disabled:active:translate-y-0 disabled:hover:scale-100 disabled:cursor-default disabled:text-gray-700 text-white hover:text-gray-400 hover:scale-110 active:translate-y-1 transition-all'>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m15 19-7-7 7-7"/>
                        </svg>
                    </button>
                    
                    <h1 className={`text-6xl font-bold drop-shadow-[0_0_8px_rgba(52,0,153,0.8)] transition-colors ${isSaving ? 'text-green-400 animate-pulse' : 'text-violet-400'}`}>
                        {formatTime(seconds)}
                    </h1>
                    
                    <button disabled={isActive || seconds !== initialSeconds} onClick={increaseTimer} className='cursor-pointer disabled:active:translate-y-0 disabled:hover:scale-100 disabled:cursor-default disabled:text-gray-700 text-white hover:text-gray-400 hover:scale-110 active:translate-y-1 transition-all'>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m9 5 7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-6 flex justify-center gap-4 w-full">
                <button 
                    onClick={isActive ? stopTimer : toggleTimer} 
                    disabled={!activeTask || isLimitReached || isSaving}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-800 text-white px-4 py-2 rounded-sm text-sm font-bold border-b-4 border-violet-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                >
                    {isActive ? "Pause" : "START"}
                </button>
                
                <button 
                    onClick={handleEndSession} 
                    disabled={isActive || seconds === initialSeconds || isSaving}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:border-gray-900 text-white px-4 py-2 rounded-sm text-sm font-bold border-b-4 border-gray-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:cursor-default"
                >
                    End Session
                </button>
            </div>
            {showTimeUp && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/95 rounded-lg backdrop-blur-md border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                >
                    <span className="text-5xl mb-3 animate-bounce">🎉</span>
                    <h2 className="text-2xl font-bold text-white tracking-widest mb-1">TIME'S UP!</h2>
                    <p className="text-sm text-violet-300 mb-6">Session successfully recorded.</p>
                    
                    <button 
                        onClick={() => setShowTimeUp(false)}
                        className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-sm text-sm font-bold border-b-4 border-violet-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                    >
                        Close
                    </button>
                </motion.div>
            )}
        </div>
    )
}