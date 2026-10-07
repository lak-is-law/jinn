// Egyptian / Arabian Nights Ambient Music & SFX Synthesizer using Web Audio API
// 100% royalty-free, zero external audio assets, works instantly in all browsers.

class JinnAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.bgmTimer = null;
    this.scale = [146.83, 155.56, 185.00, 196.00, 220.00, 233.08, 277.18, 293.66]; // D Hijaz / Double Harmonic Egyptian scale
    this.droneOsc = null;
    this.droneGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }

  playSfx(type) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    switch (type) {
      case 'click': {
        // Soft desert wood percussion
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
        break;
      }

      case 'answer': {
        // Resonant Egyptian Ney / chime tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(293.66, t); // D4
        osc.frequency.exponentialRampToValueAtTime(370, t + 0.3);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.36);
        break;
      }

      case 'reveal': {
        // Mystical tomb unearth chime (arpeggio in Hijaz scale)
        const notes = [293.66, 311.13, 369.99, 440.00, 587.33];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0, t + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.65);
        });
        break;
      }

      case 'gong': {
        // Deep ancient Egyptian temple gong for guess moment
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(110, t); // A2
        osc2.frequency.setValueAtTime(164.8, t); // E3
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 2.25);
        osc2.stop(t + 2.25);
        break;
      }

      case 'win': {
        // Victorious ancient celebration fanfare
        const notes = [293.66, 370.00, 440.00, 587.33, 739.99];
        notes.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t + i * 0.12);
          g.gain.setValueAtTime(0.25, t + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.8);
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.start(t + i * 0.12);
          osc.stop(t + i * 0.12 + 0.85);
        });
        break;
      }
    }
  }

  startMusic() {
    if (this.isMuted || this.isPlayingMusic) return;
    this.init();
    if (!this.ctx) return;

    this.isPlayingMusic = true;
    const t = this.ctx.currentTime;

    // 1. Ambient low Desert Drone (D2 / A2)
    this.droneOsc = this.ctx.createOscillator();
    const droneSub = this.ctx.createOscillator();
    this.droneGain = this.ctx.createGain();
    const droneFilter = this.ctx.createBiquadFilter();

    this.droneOsc.type = 'sawtooth';
    this.droneOsc.frequency.setValueAtTime(73.42, t); // D2
    droneSub.type = 'sine';
    droneSub.frequency.setValueAtTime(110.0, t); // A2

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, t);

    this.droneGain.gain.setValueAtTime(0, t);
    this.droneGain.gain.linearRampToValueAtTime(0.07, t + 3);

    this.droneOsc.connect(droneFilter);
    droneSub.connect(droneFilter);
    droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneOsc.start();
    droneSub.start();

    // 2. Generative Arabian Oud / Ney melodic plucks
    const melodySeq = [
      293.66, 311.13, 369.99, 293.66,
      440.00, 369.99, 311.13, 293.66,
      587.33, 440.00, 466.16, 369.99
    ];
    let step = 0;

    const playStep = () => {
      if (!this.isPlayingMusic || this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Oud pluck
      const freq = melodySeq[step % melodySeq.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);

      const delay = (Math.random() > 0.4 ? 1200 : 2400);
      this.bgmTimer = setTimeout(playStep, delay);
    };

    this.bgmTimer = setTimeout(playStep, 1000);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.droneOsc) {
            this.droneOsc.stop();
            this.droneOsc = null;
          }
        }, 600);
      } catch (e) {}
    }
  }
}

window.jinnAudio = new JinnAudio();
