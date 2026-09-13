/**
 * SMASH LEARN & PLAY - Cheerful Audio & Speech Synthesizer Engine
 * Built with Web Audio API & Web Speech API for instant zero-latency offline play.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;
  private musicStep = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // --- SOUND EFFECTS ---

  /** Tap 1: Gentle wooden hit */
  playWoodHit1(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.09);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);

    // Add tiny wood snap noise
    this.playNoiseCrack(t, 0.04, 0.15);
  }

  /** Tap 2: Stronger wooden hit with crack */
  playWoodHit2(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.14);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(240, t);
    osc2.frequency.exponentialRampToValueAtTime(80, t + 0.14);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.15);
    osc2.stop(t + 0.15);

    // Stronger crack
    this.playNoiseCrack(t, 0.08, 0.35);
  }

  /** Tap 3: Big satisfying box break crash */
  playWoodBreak(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // 1. Low boom
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'triangle';
    bass.frequency.setValueAtTime(140, t);
    bass.frequency.exponentialRampToValueAtTime(30, t + 0.45);
    bassGain.gain.setValueAtTime(0.9, t);
    bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start(t);
    bass.stop(t + 0.45);

    // 2. Wood splintering snap
    this.playNoiseCrack(t, 0.25, 0.6);

    // 3. Triumphant sparkle burst
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + 0.08 + idx * 0.04);
      gain.gain.setValueAtTime(0.25, t + 0.08 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + idx * 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + 0.08 + idx * 0.04);
      osc.stop(t + 0.55 + idx * 0.04);
    });
  }

  /** Little noise burst for wood splinter/crack simulation */
  private playNoiseCrack(startTime: number, duration: number, volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  /** Object pops out of box */
  playObjectPop(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.18);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /** Child taps the object (Apple, etc.) */
  playObjectTap(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.35, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.38);
    });
  }

  /** Star or coin collection chime */
  playStarCollect(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const freqs = [880, 1174.66, 1479.98, 1760]; // A5, D6, F#6, A6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.04);

      gain.gain.setValueAtTime(0.3, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.28);
    });
  }

  /** Button click sound */
  playButtonClick(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.07);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /** Letter completed celebration chime */
  playLevelComplete(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.12, t: 0.0 },  // C5
      { f: 659.25, d: 0.12, t: 0.12 }, // E5
      { f: 783.99, d: 0.12, t: 0.24 }, // G5
      { f: 1046.5, d: 0.35, t: 0.36 }, // C6
    ];

    fanfare.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t + n.t);

      gain.gain.setValueAtTime(0.4, t + n.t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + n.t);
      osc.stop(t + n.t + n.d + 0.02);
    });
  }

  /** Big grand fanfare for A-Z Finale */
  playGrandFanfare(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [
      { f: 523.25, start: 0.0, dur: 0.15 },
      { f: 659.25, start: 0.15, dur: 0.15 },
      { f: 783.99, start: 0.3, dur: 0.15 },
      { f: 1046.5, start: 0.45, dur: 0.25 },
      { f: 880.0, start: 0.72, dur: 0.15 },
      { f: 1046.5, start: 0.88, dur: 0.5 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.start);

      gain.gain.setValueAtTime(0.45, t + n.start);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.start + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + n.start);
      osc.stop(t + n.start + n.dur + 0.05);
    });
  }

  // --- BACKGROUND MUSIC SYNTHESIZER ---

  /** Starts gentle, cheerful, marimba melody loop */
  startMusic(enabled = true) {
    if (!enabled || this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Marimba sequence in C Major / Pentatonic (cheerful and calm for kids)
    const melody = [
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 440.00, 392.00,
      349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 293.66,
      261.63, 392.00, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63,
      293.66, 329.63, 349.23, 392.00, 523.25, 392.00, 261.63, 0,
    ];

    const stepInterval = 280; // ms per note

    const playNext = () => {
      if (!this.isMusicPlaying) return;
      const freq = melody[this.musicStep % melody.length];
      this.musicStep++;

      if (freq > 0 && this.ctx && this.ctx.state === 'running') {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        // Gentle soft marimba envelope
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
      }

      this.musicTimer = window.setTimeout(playNext, stepInterval);
    };

    playNext();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMusic(enabled: boolean) {
    if (enabled) {
      this.startMusic(true);
    } else {
      this.stopMusic();
    }
  }

  // --- SPEECH SYNTHESIS (VOICE) ---

  speak(text: string, enabled = true, rate = 0.95, pitch = 1.2) {
    if (!enabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // clear and friendly
      utterance.pitch = pitch; // cheerful tone for children

      // Try selecting a friendly English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  /** Cheerful high-pitch two-tone correct answer chime */
  playCorrect(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const notes = [659.25, 880]; // E5 to A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);
      gain.gain.setValueAtTime(0.3, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.28);
    });
  }

  /** Gentle non-punishing encouragement tone */
  playWrong(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.18);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  /** Card flip swoosh */
  playCardFlip(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  /** Balloon pop / bubble pop */
  playBalloonPop(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.09);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  /** Mystery chest open chime */
  playChestOpen(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(0.35, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.4);
    });
  }

  /** Level Up Celebration Fanfare */
  playLevelUp(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [
      { f: 523.25, time: 0, d: 0.12 },
      { f: 659.25, time: 0.12, d: 0.12 },
      { f: 783.99, time: 0.24, d: 0.12 },
      { f: 1046.5, time: 0.36, d: 0.35 },
      { f: 1318.5, time: 0.55, d: 0.6 },
    ];
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.time);
      gain.gain.setValueAtTime(0.4, t + n.time);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.time + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + n.time);
      osc.stop(t + n.time + n.d + 0.05);
    });
  }

  speakLetterAndWord(letter: string, word: string, enabled = true) {
    if (!enabled) return;
    // Speaks "A for Apple! ... A!"
    this.speak(`${letter} for ${word}! ... ${letter}!`, enabled, 0.92, 1.25);
  }

  speakWord(word: string, enabled = true) {
    if (!enabled) return;
    this.speak(word, enabled, 0.9, 1.2);
  }

  speakCount(count: number, item: string, enabled = true) {
    if (!enabled) return;
    this.speak(`${count}! ${count} ${item}!`, enabled, 0.92, 1.2);
  }
}

export const audio = new SoundEngine();
