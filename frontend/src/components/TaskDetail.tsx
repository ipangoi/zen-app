import { motion } from 'framer-motion';
import { useState } from 'react';
import { TaskItem } from './Task';

interface TaskDetailProps {
    task: TaskItem;
    onClose: () => void;
    onSave: (updatedTask: TaskItem) => void;
    bounds: any
}

export default function TaskDetail({ task, onClose, onSave, bounds }: TaskDetailProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [body, setBody] = useState(task.body);

    const handleUpdate = () => {
        onSave({ ...task, title, body });
        setIsEditing(false);
    };

    return (
            <div className='fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    drag
                    dragConstraints={bounds}
                    className="absolute right-1/2 top-1/4 bg-gray-800 border-2 border-gray-500 rounded-lg w-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono cursor-grab active:cursor-grabbing"
                >
                    <div className="bg-gray-700 border-b-2 border-gray-600 px-4 py-2 flex justify-between items-center ">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${task.status === 'Done' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">
                                {isEditing ? "// Editing Mode" : "// Task Reader"}
                            </span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-tighter">Task Title</label>
                            <input 
                                readOnly={!isEditing}
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full text-center bg-transparent border-b-2 transition-all text-lg font-bold outline-none ${
                                    isEditing ? 'border-violet-500 text-white pb-1' : 'border-transparent text-violet-400'
                                }`}
                            />
                        </div>

                        <div className="space-y-1 pb-2  border-b border-gray-700">
                            <label className="text-[10px] text-gray-500 uppercase tracking-tighter">Detail Task</label>
                            <textarea
                                readOnly={!isEditing}
                                rows={8}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder={isEditing ? "Type details here..." : "No additional data recorded."}
                                className={`w-full bg-gray-900/50 p-4 rounded-md text-sm leading-relaxed outline-none resize-none custom-scrollbar transition-all ${
                                    isEditing ? 'border-2 border-gray-600 text-white ring-1 ring-violet-500/30' : 'border-2 border-transparent text-gray-300'
                                }`}
                            />
                            <div className="text-[10px] text-gray-500 text-left">
                                Status: <span className={task.status === 'Done' ? 'text-green-500' : 'text-yellow-500'}>{task.status.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex justify-end items-center pt-2">
                            
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-[10px] font-bold rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                    >
                                        EDIT TASK
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-gray-500 hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                                        >
                                            DISCARD
                                        </button>
                                        <button 
                                            onClick={handleUpdate}
                                            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                        >
                                            SAVE CHANGES
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
    );
}
