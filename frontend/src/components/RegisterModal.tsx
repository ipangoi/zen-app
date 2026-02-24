import { useState, SubmitEvent } from 'react';
import api from '../services/api';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (username: string) => void;
    onChange: () => void;
}

export default function RegisterModal({ isOpen, onClose, onRegister, onChange }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        if (email.trim() === "") {
            setErrorMsg("Email Is Empty");
            return;
        } else if (password.trim() === "") {
            setErrorMsg("Password Is Empty");
            return;
        }

        
        setIsLoading(true);
        try {
            await api.post('/user/register', { 
                email: email, 
                password: password 
            });

            const loginResponse = await api.post('/user/login', { 
                email: email, 
                password: password 
            });

            const token = loginResponse.data.token;
            localStorage.setItem('token', token);

            const profile = await api.get('/user/profile');
            const fetchedUsername = profile.data.username;

            
            onRegister(fetchedUsername);
            
            setEmail("");
            setPassword("");
        } catch (error: any) {
            let rawError = error.response?.data?.message || "";
            let cleanMessage =  `Connection to server failed! Try Again`;
            if (rawError.includes("failed on the 'email' tag")) {
                cleanMessage = "Invalid Email Format";
            } else if (rawError.includes("failed on the 'min' tag") && rawError.includes("Password")) {
                cleanMessage = "Password Must Be 6 Character or More";
            } else {
                cleanMessage = rawError;
            }

            setErrorMsg(cleanMessage);
        } finally {
            setIsLoading(false);
        }
        
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm font-mono">
            <div className="bg-gray-800 border-2 border-gray-500 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] w-80 flex flex-col overflow-hidden">
                <div className="bg-gray-700 border-b-2 border-gray-500 px-3 py-2 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-violet-400 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(52,0,153,0.8)]">
                        System Register
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {errorMsg && (
                        <div className="bg-red-500/20 border-2 border-red-500 text-red-400 px-3 py-2 rounded-sm text-xs text-center font-bold">
                            {errorMsg}
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Email</label>
                        <input 
                            type="text" 
                            placeholder='Enter your email...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-gray-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Password</label>
                        <input 
                            type="password" 
                            placeholder='Enter your password...'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border-2 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-gray-500 transition-colors"
                        />
                    </div>

                    <div className="mt-2">
                        <button 
                            type="submit"
                            className=
                            {`w-full py-2 rounded-sm text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:cursor-not-allowed
                                ${
                                    isLoading 
                                    ? "bg-gray-600 text-gray-400 border-gray-700 cursor-default animate-pulse" 
                                    : "bg-violet-500 hover:bg-violet-400 text-black border-violet-700"
                                }`
                            }
                        >
                            {isLoading ? "Loading..." : "REGISTER"}
                        </button>
                    </div>
                    <div className='text-center'>
                        <label className="text-xs text-gray-400 mb-1 block tracking-wider">
                            Already Have Account? 
                        </label>
                        <button type='button' onClick={onChange} className='cursor-pointer'>
                            <h2 className="text-sm font-bold text-violet-400 tracking-widest uppercase hover:text-base transition-all">
                                Login
                            </h2>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}