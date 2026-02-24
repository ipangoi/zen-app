import { useState } from "react";
import api from "../services/api";

interface ProfileProps {
    username: string;
    onLogout: () => void;
    onUpdateUsername: (newUsername: string) => void;
}

export default function Profile({ username, onLogout, onUpdateUsername }: ProfileProps) {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState(username);
    
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setNewUsername(username);
        setIsEditModalOpen(true);
        setIsDropdownMenuOpen(false);
    };

    const handleSaveUsername = async () => {
        setIsLoading(true);
        setErrorMsg("");
        if (newUsername.trim() !== "") {
           
            try{
                await api.put('/user/profile', { 
                    username: newUsername
                });
                onUpdateUsername(newUsername);
                setIsEditModalOpen(false);
    
            } catch (error: any) {
                const rawError = error.response?.data?.message || "";
                const lowerError = rawError.toLowerCase();
                
                if (lowerError.includes("unique") || lowerError.includes("duplicate") || lowerError.includes("already exists")) {
                    setErrorMsg("Username is already taken. Please choose another one.");
                } else {
                    setErrorMsg(rawError || "Connection to server failed!");
                }
            } finally {
                setIsLoading(false);
            }
        }

    };

    return (
        <>
            <div className="bg-gray-800/60 backdrop-blur-sm border-2 border-gray-500 rounded-lg p-3 text-white font-mono flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] w-auto">
                <div className="w-10 h-10 bg-gray-900 border-2 border-violet-500 rounded-sm flex items-center justify-center shadow-[inset_0_0_8px_rgba(139,92,246,0.3)]">
                    <span className="text-xl">👾</span>
                </div>
                
                <div onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)} className="flex-1 overflow-hidden p-1 -ml-1 text-start">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 px-2">
                        Terminal User
                    </p>
                    <p className="text-base font-bold text-violet-400 truncate cursor-pointer group hover:bg-gray-700/50 px-2 rounded-lg transition-colors">
                        {username} ▼
                    </p>
                </div>

                <button 
                    onClick={onLogout}
                    className="bg-gray-700 hover:bg-red-500/80 text-gray-300 hover:text-white p-1.5 rounded-sm border-b-2 border-gray-900 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Logout"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                </button>
                {isDropdownMenuOpen && (
                        <div className="absolute top-full left-18 mt-2 w-40 bg-gray-800 border-2 border-gray-500 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                            <button 
                                onClick={handleOpenModal}
                                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-violet-500 hover:text-black transition-colors font-bold cursor-pointer"
                            >
                                Edit Username
                            </button>
                        </div>
                    )}
            </div>
            {isEditModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm font-mono">
                    <div className="bg-gray-800 border-2 border-gray-500 rounded-lg p-5 w-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-violet-400 uppercase tracking-widest border-b-2 border-gray-600 pb-2">
                            // Update Profile
                        </h2>
                        {errorMsg && (
                            <div className="bg-red-500/20 border-2 border-red-500 text-red-400 px-3 py-2 rounded-sm text-xs text-center font-bold">
                                {errorMsg}
                            </div>
                        )}
                        
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block uppercase">New Username</label>
                            <input 
                                type="text" 
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                className="w-full bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-gray-500"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <button 
                                disabled={isLoading}
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-sm text-sm font-bold border-b-4 border-gray-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveUsername}
                                disabled={isLoading || newUsername.trim() === ""}
                                className={`px-4 py-2 text-white rounded-sm text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:cursor-not-allowed
                                     ${
                                        isLoading 
                                        ? "bg-gray-600 text-gray-400 border-gray-700 animate-pulse" 
                                        : "bg-violet-500 hover:bg-violet-400 text-black border-violet-700"
                                    }`}
                            >
                                {isLoading ? "Loading..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}