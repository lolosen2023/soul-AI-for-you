import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // A ethereal ambient track (Copyright Free / Creative Commons style placeholder URL)
  // Using a reliable source for demo purposes.
  const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impromptu-01-4422.mp3";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.3; // Low volume for ambience
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
      <audio ref={audioRef} src={MUSIC_URL} loop />
      <button 
        onClick={togglePlay}
        className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg group ${isPlaying ? 'bg-gold-accent/20 text-gold-accent animate-pulse-slow' : 'bg-black/30 text-gray-400 hover:bg-white/10'}`}
        title={isPlaying ? "Mute Ambience" : "Play Ambience"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
