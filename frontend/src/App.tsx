import { useState, useRef, useEffect } from 'react';
import './App.css'

import Timer from './components/Timer'
import Tasks, { TaskItem } from './components/Task'
import SessionStats from './components/Session';
import MusicPlayer from './components/MusicPlayer';
import Profile from './components/Profile';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Background from './components/Background';

import api from './services/api';

function App() {
  const screenBoundaryRef = useRef(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [isEndSession, setIsEndSession] = useState(false)

  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);


  const handleLogout = () => {
    window.location.reload();
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleLogin = (name: string) => {
        setUsername(name);
        setIsLoggedIn(true);
        if (isLoginModalOpen){
          setIsLoginModalOpen(false)
        }
        else {
          setIsRegisterModalOpen(false)   
        }
    };

  const handleChange = () => {
    if (isLoginModalOpen){
      setIsLoginModalOpen(false)
      setIsRegisterModalOpen(true)
    }
    else {
      setIsLoginModalOpen(true)
      setIsRegisterModalOpen(false)   
    }
  }

  const handleSessionEnd = () => {
    setIsEndSession(prev => !prev);
  }

  useEffect(() => {
      const checkUserSession = async () => {
          const token = localStorage.getItem('token');
          
          if (token) {
            try {
              const response = await api.get('/user/profile');
              
              const fetchedUsername = response.data.username; 
              
              setUsername(fetchedUsername);
              setIsLoggedIn(true);
            } catch (error) {
                console.error("Sesi tidak valid:", error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            }
          }
          setTimeout(() => {
              setFadeSplash(true); 
              
              setTimeout(() => {
                  setShowSplash(false); 
              }, 1000); 

          }, 2500);
      };

      checkUserSession();
  }, []);

  useEffect(() => {
      setActiveTask(null);
  }, [isLoggedIn]);

  return (
    <>
      {showSplash && (
        <div 
            className={`fixed inset-0 z-100 bg-gray-900 flex flex-col items-center justify-center font-mono text-violet-400 transition-opacity duration-1000 ease-in-out ${
                fadeSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            <span className="text-4xl mb-4">👾</span>
            <h1 className="text-2xl animate-bounce ease-in font-bold tracking-widest mb-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">ZEN APP</h1>
            <p className="tracking-widest animate-pulse text-sm text-gray-400">Loading...</p>
        </div>
      )}
      <div ref={screenBoundaryRef} className="relative w-screen h-screen overflow-hidden">

        {/* <div className='bg-[url(/bg.jpg)] bg-cover bg-center w-full h-screen '> */}
          <Background/>
          <div className='m-auto p-8 max-w-7xl items-center text-center'>
            
            <div className="absolute top-5 left-1/2 -translate-x-1/2">
              <Timer isGuest={!isLoggedIn} activeTask={activeTask} onSelectTask={setActiveTask} endSession={handleSessionEnd}/> 
            </div>
            <div className="absolute right-4 top-5 "> 
              {/* <Tasks isGuest={!isLoggedIn} bounds={screenBoundaryRef} onSetActiveTask={setActiveTask} activeTaskId={activeTask?.id}/>  */}
              <Tasks isGuest={!isLoggedIn} bounds={screenBoundaryRef} /> 
            </div>
            <div className="absolute top-2/11 left-2 z-10">
              {isLoggedIn ? (
                <SessionStats refreshToggle={isEndSession}/>

              ) :
                <></>
                // <SessionStats refreshToggle={isEndSession} />
              }
            </div>
            <div className="absolute bottom-0 left-0 w-full z-10">
              <MusicPlayer />
            </div>
            <div className="absolute top-6 left-4 z-20">
                {isLoggedIn ? (
                    <Profile
                        username={username} 
                        onLogout={handleLogout} 
                        onUpdateUsername={(newName) => setUsername(newName)}
                    />
                ) : (
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-violet-600/80 hover:bg-violet-500 backdrop-blur-sm border-2 border-violet-400 text-white px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all text-sm uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        Login to Save
                    </button>
                )}
            </div>
          </div>
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLogin} 
            onChange={handleChange}
          />
          <RegisterModal 
            isOpen={isRegisterModalOpen} 
            onClose={() => setIsRegisterModalOpen(false)} 
            onRegister={handleLogin} 
            onChange={handleChange}
          />
          
        {/* </div> */}
          <a 
              href="https://www.freepik.com/free-video/night-study-aesthetic_3876702" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-26 left-2 text-sm p-2 rounded-md bg-gray-800/60 backdrop-blur-sm border-2 border-gray-500  text-violet-500 hover:text-gray-300 transition-colors z-50 tracking-wider"
          >
              Video by <span className="underline">Freepik</span>
          </a>
      </div>
    </>
  )
}

export default App
