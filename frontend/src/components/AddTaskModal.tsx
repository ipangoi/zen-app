import { motion } from 'framer-motion';
import { useState } from 'react';

interface AddTaskModalProps {
    initialTitle: string;
    onClose: () => void;
    onSave: (title: string, body: string) => void;
    isLoading: boolean
}

export default function AddTaskModal({ initialTitle, onClose, onSave, isLoading }: AddTaskModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState("");

    const handleSave = () => {
        if (title.trim() === "") return;
        onSave(title, body);
    };

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gray-800 border-2 h-9/10 border-gray-500 rounded-lg w-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono"
            >
                <div className="bg-gray-700 border-b-2 border-gray-600 px-4 py-2 flex justify-between items-center">
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">// Add New Task</span>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:text-gray-400"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase mb-1 block">Title</label>
                        <input 
                            type="text"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add Task Title..."
                            className="w-full bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 uppercase mb-1 block">Detail Description (Optional)</label>
                        <textarea 
                            rows={6}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Add Task Detail..."
                            className="w-full bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-violet-500 outline-none resize-none custom-scrollbar"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button 
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:text-gray-400"
                        >
                            CANCEL
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={title.trim() === "" || isLoading}
                            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 text-white px-6 py-1.5 rounded-sm text-xs font-bold border-b-4 border-green-800 disabled:border-gray-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            {!isLoading ? 
                            "CREATE TASK"
                            :
                            <svg className="w-4 h-4 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>

                            }
                            
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}