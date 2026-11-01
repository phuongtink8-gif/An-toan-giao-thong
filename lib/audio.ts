// Web Audio API procedural sound synthesizer for "Bé Vui Học Giao Thông 3D"
// Completely zero-404 asset dependencies: all sound effects and cheerful nursery BGM are synthesized in real-time.

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private isTtsEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted() {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx?.currentTime || 0);
    }
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getTtsEnabled() {
    return this.isTtsEnabled;
  }

  public setTtsEnabled(enabled: boolean) {
    this.isTtsEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // UI Click sound
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // Correct answer chime (Bright major triad arpeggio)
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Gentle, friendly incorrect sound (soft boing, non-punishing)
  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

    // lowpass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  // Star collect sparkling chime
  public playStar() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
    osc.frequency.exponentialRampToValueAtTime(1760.00, ctx.currentTime + 0.15); // A6

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  // Playful cartoon car beep beep
  public playHonk() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playBeep = (delay: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      const time = ctx.currentTime + delay;
      osc1.frequency.setValueAtTime(440, time);
      osc2.frequency.setValueAtTime(554.37, time); // major 3rd harmony

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.12);
      osc2.stop(time + 0.12);
    };

    playBeep(0);
    playBeep(0.15);
  }

  // Victory fanfare for completing the game
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // C4, E4, G4, C5, G4, C5, E5 arpeggiated triumph
    const sequence = [
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.25 },
      { f: 587.33, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.35 },
      { f: 1046.5, d: 0.55 }
    ];

    let t = ctx.currentTime;
    sequence.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + item.d);
      t += item.d * 0.9;
    });
  }

  // Procedural playful nursery background music (Pentatonic Marimba)
  public startBgm() {
    if (this.isBgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.07, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);

    // Pentatonic happy melody notes (C major pentatonic: C, D, E, G, A)
    const melody = [
      { f: 523.25, d: 0.25 }, // C5
      { f: 587.33, d: 0.25 }, // D5
      { f: 659.25, d: 0.25 }, // E5
      { f: 783.99, d: 0.5 },  // G5
      { f: 659.25, d: 0.25 }, // E5
      { f: 783.99, d: 0.25 }, // G5
      { f: 880.00, d: 0.5 },  // A5
      { f: 783.99, d: 0.25 }, // G5
      { f: 659.25, d: 0.25 }, // E5
      { f: 587.33, d: 0.25 }, // D5
      { f: 523.25, d: 0.5 }   // C5
    ];

    let noteIdx = 0;
    const step = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const note = melody[noteIdx % melody.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now);

      noteGain.gain.setValueAtTime(0.3, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 0.85);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + note.d);

      noteIdx++;
      this.bgmTimer = window.setTimeout(step, note.d * 1000);
    };

    step();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isBgmActive() {
    return this.isBgmPlaying;
  }

  // Speech Synthesis (Read aloud question & options for primary school children)
  public speakText(text: string) {
    if (!this.isTtsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // cancel any active utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // slightly slower for young kids
    utterance.pitch = 1.1; // cheerful, friendly tone

    // Try to find a Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundManager();
