// Web Audio API procedural sound engine for magical birthday effects

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopBirthdayMusic();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getIsMusicPlaying() {
    return this.isMusicPlaying;
  }

  // 1. Sonido de campanas mágicas y destellos
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.55);
      });
    } catch {
      // Audio context might need user interaction first
    }
  }

  // 2. Sonido pop al abrir la caja de regalo
  public playPopOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Pop bajo
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Chime agudo de sorpresa
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chime.type = 'sine';
      chime.frequency.setValueAtTime(880, now + 0.08);
      chime.frequency.exponentialRampToValueAtTime(1760, now + 0.4);

      chimeGain.gain.setValueAtTime(0.001, now + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.18, now + 0.12);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);

      chime.start(now + 0.08);
      chime.stop(now + 0.65);
    } catch {}
  }

  // 3. Fanfarria triunfal para el Gran Montaje Final
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpegio mayor triunfal: C4, E4, G4, C5, G4, C5
      const chords = [
        { f: 261.63, t: 0.0, d: 0.2 },
        { f: 329.63, t: 0.15, d: 0.2 },
        { f: 392.00, t: 0.3, d: 0.2 },
        { f: 523.25, t: 0.45, d: 0.6 },
        { f: 659.25, t: 0.7, d: 0.3 },
        { f: 783.99, t: 0.95, d: 0.3 },
        { f: 1046.50, t: 1.2, d: 1.2 },
      ];

      chords.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.18, now + t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.1);
      });
    } catch {}
  }

  // 4. Música de caja de música suave (Cumpleaños Feliz)
  public toggleBirthdayMusic(onStateChange?: (playing: boolean) => void) {
    this.initCtx();
    if (this.isMusicPlaying) {
      this.stopBirthdayMusic();
      if (onStateChange) onStateChange(false);
    } else {
      this.startBirthdayMusic();
      if (onStateChange) onStateChange(true);
    }
  }

  public startBirthdayMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.isMuted = false;
    this.initCtx();

    // Notas de "Cumpleaños Feliz" (C4 base)
    // C C D C F E | C C D C G F | C C C' A F E D | Bb Bb A F G F
    const melody: [number, number][] = [
      [261.63, 0.35], [261.63, 0.35], [293.66, 0.7], [261.63, 0.7], [349.23, 0.7], [329.63, 1.4],
      [261.63, 0.35], [261.63, 0.35], [293.66, 0.7], [261.63, 0.7], [392.00, 0.7], [349.23, 1.4],
      [261.63, 0.35], [261.63, 0.35], [523.25, 0.7], [440.00, 0.7], [349.23, 0.7], [329.63, 0.7], [293.66, 1.2],
      [466.16, 0.35], [466.16, 0.35], [440.00, 0.7], [349.23, 0.7], [392.00, 0.7], [349.23, 1.8],
    ];

    const playMelodyLoop = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      let offset = 0;
      const startTime = this.ctx.currentTime + 0.1;

      melody.forEach(([freq, dur]) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Sonido tipo caja de música de ensueño (sine con armónicos sutiles)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + offset);

        gain.gain.setValueAtTime(0.0001, startTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + offset);
        osc.stop(startTime + offset + dur + 0.1);

        offset += dur + 0.08;
      });

      // Repetir suavemente con intervalo
      const loopDurationMs = (offset + 1.5) * 1000;
      this.musicInterval = window.setTimeout(() => {
        if (this.isMusicPlaying) {
          playMelodyLoop();
        }
      }, loopDurationMs);
    };

    playMelodyLoop();
  }

  public stopBirthdayMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundFX = new SoundEffectsEngine();
