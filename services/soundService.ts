// Using Mixkit preview assets for sound effects
export const SOUNDS = {
  click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // UI Click
  hover: "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3", // Soft tick
  shuffle: "https://assets.mixkit.co/active_storage/sfx/2042/2042-preview.mp3", // Card Shuffle
  draw: "https://assets.mixkit.co/active_storage/sfx/2034/2034-preview.mp3", // Card Slide/Draw
  flip: "https://assets.mixkit.co/active_storage/sfx/2040/2040-preview.mp3", // Card Flip
  magic: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Magic Reveal
  success: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3", // Success chime
  message: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3", // Message bubble
  breathIn: "https://assets.mixkit.co/active_storage/sfx/203/203-preview.mp3", // Soft wind
};

class SoundManager {
  private audios: Record<string, HTMLAudioElement> = {};
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload sounds
      Object.keys(SOUNDS).forEach((key) => {
        const audio = new Audio(SOUNDS[key as keyof typeof SOUNDS]);
        audio.volume = 0.3; // Default SFX volume
        this.audios[key] = audio;
      });
      
      // Adjust specific volumes
      if(this.audios.shuffle) this.audios.shuffle.volume = 0.5;
      if(this.audios.magic) this.audios.magic.volume = 0.4;
    }
  }

  play(key: keyof typeof SOUNDS) {
    if (this.isMuted) return;
    const audio = this.audios[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay policy errors for UI sounds
      });
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }
}

export const soundManager = new SoundManager();
