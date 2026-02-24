import { useState, useEffect } from 'react';

import TaskDetail from './TaskDetail';
import AddTaskModal from './AddTaskModal';

import api from '../services/api';


interface TaskProps {
    isGuest: boolean;
    bounds: any;
    // onSetActiveTask: (task: TaskItem) => void;
    // activeTaskId?: number;
}

export interface TaskItem {
    id: number;
    title: string;
    body: string;
    status: string;
}

// export default function Tasks({isGuest, bounds, onSetActiveTask, activeTaskId}: TaskProps) {
export default function Tasks({isGuest, bounds}: TaskProps) {

    const [tasks, setTasks] = useState<TaskItem[]>([
        { id: 1, title: "Welcome to Zen!", body: "Ini detail task pertama", status: "On Progress" },
        { id: 2, title: "Try the music player", body: "", status: "Done" },
    ]);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    
    const [isAddTask, setIsAddTask] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [statusLoading, setStatusLoading] = useState<number | null>(null);

    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const [addLoading, setAddLoading] = useState(false);

    const [editLoading, setEditLoading] = useState(false);

    const toggleTask = async (id: number) => {
        const taskToToggle = tasks.find(t => t.id === id);
        if (!taskToToggle) return;

        const newStatus = taskToToggle.status === "Done" ? "On Progress" : "Done";

        if (isGuest) {
            setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
            return;
        }

        setStatusLoading(id)

        try {
            await api.put(`/tasks/${id}`, {
                title: taskToToggle.title,
                body: taskToToggle.body,
                status: newStatus
            });
            setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setStatusLoading(null);
        }
    };

    const addTask = () => {
        setIsAddTask(true)
    };

    const deleteTask = async (id: number) => {
        if (isGuest) {
            setTasks(tasks.filter(task => task.id !== id));
            return;
        }

        setDeleteLoading(id);
        
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const isLimitReached = isGuest && tasks.length >= 3;

    const handleSaveNewTask = async (newTitle: string, newBody: string) => {
        if (isGuest) {
            const newTask: TaskItem = {
                id: Date.now(),
                title: newTitle,
                body: newBody,
                status: "On Progress"
            };
            setTasks([...tasks, newTask]);
            setNewTaskTitle("");
            setIsAddTask(false);
            return;
        }

        setAddLoading(true);

        try {
            const response = await api.post('/tasks', {
                title: newTitle,
                body: newBody,
                status: "On Progress"
            });
            
            const savedTask = response.data.data || response.data;
            setTasks([...tasks, savedTask]);
            setNewTaskTitle("");
            setIsAddTask(false);
        } catch (error) {
            console.error("Failed to add task:", error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateTaskDetail = async (updatedTask: TaskItem) => {
        if (isGuest) {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
            return;
        }

        setEditLoading(true);

        try {
            await api.put(`/tasks/${updatedTask.id}`, {
                title: updatedTask.title,
                body: updatedTask.body,
                status: updatedTask.status
            });
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
        } catch (error) {
            console.error("Failed to update task detail:", error);
        } finally {
            setEditLoading(false);
        }
    };

    

    useEffect(() => {
        const fetchTasks = async () => {
            if (isGuest) {
                setTasks([
                    { id: 1, title: "Welcome to Zen!", body: "Login to save your tasks permanently.", status: "On Progress" },
                    { id: 2, title: "Try the music player", body: "It helps you focus.", status: "Done" },
                ]);
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/tasks');
                setTasks(response.data.task || []);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [isGuest]);


    return (
        <div 
            
            className="relative bg-gray-800/60 backdrop-blur-sm border-2 border-gray-500 rounded-lg p-4 text-white font-mono w-82 h-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex flex-col"
        >
            <div className="flex justify-between items-center border-b-2 border-gray-600 pb-2 mb-3 gap-4">
                <h2 className="text-sm font-bold text-violet-400 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(52,0,153,0.8)]">
                    // Tasks To Do
                </h2>
                <div className="flex items-center gap-2">
                    {isLoading && <span className="w-2 h-2 bg-violet-500 rounded-full animate-ping"></span>}
                    <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                        {tasks.filter(t => t.status === "Done").length}/{tasks.length}
                    </span>
                </div>
                
            </div>
            {isGuest && (
                <div className="bg-yellow-500/20 text-yellow-300 text-[10px] p-1.5 mb-2 text-center border border-yellow-500/50 rounded-sm uppercase tracking-wider">
                    Guest Mode: Not Saved
                </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar cursor-auto">
                { isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-10 bg-gray-700/50 rounded animate-pulse w-full"></div>
                            
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-4 font-bold">
                        No tasks found.
                    </div>
                ) : (
                    tasks.map((task) => (
                    <div 
                        key={task.id} 
                        className={`group flex items-start gap-3 p-2 rounded transition-colors ${task.status === "Done" ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-300 hover:bg-gray-300/80' } `}
                    >
                        <button 
                            onClick={() => toggleTask(task.id)}
                            disabled={statusLoading === task.id || deleteLoading === task.id}
                            className={`w-5 h-5 mt-0.5 border-2 rounded-sm shrink-0 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                task.status === "Done" 
                                ? 'bg-violet-500 border-violet-500 text-black' 
                                : 'border-gray-500 hover:border-violet-400 text-black'
                            }`}
                        >
                            { statusLoading === task.id ? (
                                <svg className="w-3 h-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : task.status === "Done" && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                            )}
                        </button>
                        
                        <p 
                            onClick={() => setSelectedTask(task)}
                            title="Open task detail"
                            className={`text-sm font-bold flex-1 text-left wrap-break-word mt-0.5 cursor-pointer hover:text-violet-400 transition-colors ${
                                task.status === "Done" ? 'text-gray-400 line-through' : 'text-gray-800'
                            }`}
                        >
                            {task.title}
                        </p>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">

                            <button
                                onClick={() => deleteTask(task.id)}
                                title="Delete task"
                                className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                {deleteLoading === task.id ? (
                                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    )))
                }
            </div>

            <div className="mt-3 pt-3 border-t-2 border-gray-600 flex gap-2 cursor-auto">
                {/* <input 
                    type="text" 
                    placeholder={isLimitReached ? "Login to add more..." : "New task..."}
                    value={newTaskTitle} 
                    onPointerDownCapture={e => e.stopPropagation()} 
                    className="flex-1 bg-gray-900 border-2 border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-gray-500"
                    disabled={isLimitReached}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isLimitReached && addTask()}
                /> */}
                <button disabled={isLimitReached} onClick={addTask} className="w-full bg-violet-500 hover:bg-violet-400 text-white px-3 py-1 rounded-sm text-sm font-bold border-b-2 border-violet-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:bg-gray-600 disabled:border-0 disabled:cursor-default disabled:active:translate-0">
                    {!isLimitReached ? "Add Task" : "Login To Add More"}
                </button>
            </div>
            {selectedTask && (
                <TaskDetail 
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleUpdateTaskDetail}
                    bounds={bounds}
                    isLoading={editLoading}
                />
            )}
            {isAddTask && (
                <AddTaskModal 
                    initialTitle={newTaskTitle}
                    onClose={() => setIsAddTask(false)}
                    onSave={handleSaveNewTask}
                    isLoading={addLoading}
                />
            )}

        </div>
    )
}