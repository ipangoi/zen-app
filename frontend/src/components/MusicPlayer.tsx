import { useState } from 'react';
import YouTube from 'react-youtube';


const list_player = [
    { id: "jfKfPfyJRdk", title: "Lofi hip hop radio 📚 beats to relax/study to", subtitle: "Lofi Girl" },
    { id: "4xDzrJKXOOY", title: "Synthwave radio 🌌 beats to chill/game to", subtitle: "Lofi Girl" },
    { id: "7NOSDKb0HlU", title: "Lofi hip hop radio - beats to study/relax to 🐾", subtitle: "Chillhop Music" }
];

export default function MusicPlayer() {
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(66);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    const currentPlayer = list_player[playerIndex];


    const onPlayerReady = (event: { target: any; }) => {
        setPlayer(event.target); 
        event.target.setVolume(50);
    };

    const onPlayerError = () => {
        nextStation(); 
    };

    const togglePlay = () => {
        if (!player) return;

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const nextStation = () => {
        setPlayerIndex((prevIndex) => (prevIndex + 1) % list_player.length);
        setIsPlaying(true); 
    };

    const prevStation = () => {
        setPlayerIndex((prevIndex) => (prevIndex - 1 + list_player.length) % list_player.length);
        setIsPlaying(true);
    };

    const handleVolumeChange = (e: { target: { value: string; }; }) => {
        const newVolume = parseInt(e.target.value, 10);
        setVolume(newVolume);
        if (isMuted && newVolume > 0) {
            setIsMuted(false);
        }
        if (player) {
            player.setVolume(newVolume);
        }
    };

    const handleMute = () => {
        if (isMuted) {
            setVolume(prevVolume);
            setIsMuted(false);
            if (player) player.setVolume(prevVolume);
        }
        else {
            setPrevVolume(volume);
            setVolume(0);
            setIsMuted(true);
            if (player) player.setVolume(0);
        }
    }

    const opts = {
        height: '0', 
        width: '0', 
        playerVars: {
            autoplay: 0, 
            controls: 0,
            disablekb: 1,
        },
    };

    const handleStateChange = (event: { data: number; target: { playVideo: () => void; }; }) => {
        if (event.data === 3) {
            setIsBuffering(true);
        } else if (event.data === 1 || event.data === 2) {
            setIsBuffering(false);
        }

        if (isPlaying && (event.data === -1 || event.data === 5)) {
            event.target.playVideo();
        }
    };

    return (
        <div className="w-full h-24 bg-gray-900/80 backdrop-blur-md border-t-2 border-gray-600 flex items-center justify-between px-6 text-white font-mono z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
            <div className="absolute opacity-0 pointer-events-none">
                <YouTube videoId={currentPlayer.id} opts={opts} onReady={onPlayerReady} onError={onPlayerError} onStateChange={handleStateChange}/>
            </div>
            
            <div className="flex items-center gap-4 w-1/3">
                <div className="w-12 h-12 bg-gray-800 border-2 border-gray-500 rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                    </svg>
                </div>
                <a href={`https://www.youtube.com/watch?v=${currentPlayer.id}`} className='text-left'>
                    <h3 className="text-sm font-bold text-violet-400 drop-shadow-[0_0_5px_rgba(52,0,153,0.8)]">{currentPlayer.title}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{currentPlayer.subtitle}</p>
                </a>
            </div>

            <div className="flex flex-col items-center justify-center w-1/3 gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={prevStation} className=" transition-all active:scale-90 cursor-pointer active:translate-y-1">
                        <svg className="w-8 h-8 text-white hover:text-gray-400 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M7 6a1 1 0 0 1 2 0v4l6.4-4.8A1 1 0 0 1 17 6v12a1 1 0 0 1-1.6.8L9 14v4a1 1 0 1 1-2 0V6Z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 bg-violet-500 hover:bg-violet-400 text-black flex items-center justify-center rounded-sm border-b-2 border-violet-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                    >
                        {isPlaying ? (
                            <svg className="w-6 h-6 ml-0.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clipRule="evenodd"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 ml-0.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd"/>
                            </svg>
                        )}
                    </button>
                    <button onClick={nextStation} className="active:translate-y-1 transition-all active:scale-90 cursor-pointer">
                        <svg className="w-8 h-8 text-white hover:text-gray-400 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M17 6a1 1 0 1 0-2 0v4L8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8L15 14v4a1 1 0 1 0 2 0V6Z" clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full max-w-sm flex items-center gap-3 text-xs text-gray-400">
                    <span>LIVE</span>
                    <div className="flex-1 h-2 bg-gray-800 border border-gray-600 rounded-sm overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${isBuffering ? 'w-0 bg-violet-300 animate-pulse' : 'w-full bg-violet-500 drop-shadow-[0_0_5px_rgba(139,92,246,1)]'}`}></div>
                    </div>
                    <span>&#8734;</span>
                </div>
            </div>

            <div className="flex items-center justify-end w-1/3 gap-3">
                <button onClick={handleMute} className='cursor-pointer'>
                    {!isMuted ? (
                            <svg className="w-6 h-6 text-gray-800 dark:text-white active:translate-y-1 transition-all active:scale-90 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
                                <path fillRule="evenodd" d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clipRule="evenodd"/>
                                <path fillRule="evenodd" d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z" clipRule="evenodd"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-gray-800 dark:text-white active:translate-y-1 transition-all active:scale-90 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
                            </svg>
                        )}
                </button>
                {/* <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
                    <path fill-rule="evenodd" d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z" clip-rule="evenodd"/>
                </svg>

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
                </svg> */}

                <div className="relative w-24 h-2 bg-gray-800 border border-gray-600 rounded-sm overflow-hidden">
                    <div className="h-full bg-violet-400 pointer-events-none" style={{ width: `${volume}%` }}></div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                
            </div>
        </div>
    );
}