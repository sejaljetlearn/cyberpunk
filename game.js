/**
 * NEON RUNNER - Cyberpunk 3D Endless Runner
 * Pure Vanilla JavaScript Game Engine
 * 60 FPS requestAnimationFrame Loop, CSS 3D Parallax,
 * 8 Obstacle Classes across 4 Sectors, Near-Miss Slow-Mo System & Built-in Web Audio Synth
 */

'use strict';

/* ==========================================================================
   AUDIO SYNTHESIZER (PURE WEB AUDIO API - ZERO EXTERNAL ASSETS)
   ========================================================================== */
class CyberSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMuted = false;
    this.isMusicMuted = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bpm = 124;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.resume();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  toggleMusic() {
    this.init();
    this.resume();
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : 0.45, this.ctx.currentTime);
    }
    return !this.isMusicMuted;
  }

  /* Sound FX: Jump */
  playJump() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.16);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  /* Sound FX: Double Jump */
  playDoubleJump() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // Dual harmonic high-tech pulse
    [480, 720].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + 0.22);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  /* Sound FX: Near-Miss Slow-Mo Dilation */
  playNearMiss() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // Deep sub-bass whoosh with resonance
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(140, t + 0.6);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  /* Sound FX: Slow-Mo Recovery */
  playNearMissEnd() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /* Sound FX: Level Up Fanfare */
  playLevelUp() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const notes = [293.66, 369.99, 440.0, 587.33, 739.99]; // D, F#, A, D5, F#5

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.08;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.25, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startT);
      osc.stop(startT + 0.45);
    });
  }

  /* Sound FX: Collision & Game Over */
  playCollision() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // Noise buffer generation for glitch explosion
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);

    // Deep sub-bass boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(150, t);
    subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

    subGain.gain.setValueAtTime(0.5, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(t);
    subOsc.stop(t + 0.5);
  }

  /* Sound FX: UI Click */
  playClick() {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /* Cyberpunk Synthwave Music Loop */
  startBGM() {
    if (this.bgmTimer) return;
    const stepInterval = (60 / this.bpm) / 4; // 16th notes
    const bassline = [
      73.42, 73.42, 146.83, 73.42, 73.42, 73.42, 146.83, 73.42, // D2
      87.31, 87.31, 174.61, 87.31, 87.31, 87.31, 174.61, 87.31, // F2
      65.41, 65.41, 130.81, 65.41, 65.41, 65.41, 130.81, 65.41, // C2
      98.00, 98.00, 196.00, 98.00, 98.00, 98.00, 196.00, 98.00  // G2
    ];

    const leadNotes = [
      293.66, 0, 329.63, 0, 349.23, 0, 440.0, 0,
      523.25, 0, 440.0, 0, 392.0, 0, 349.23, 0
    ];

    this.bgmTimer = setInterval(() => {
      if (!this.initialized || this.isMusicMuted || this.isMuted) {
        this.bgmStep = (this.bgmStep + 1) % bassline.length;
        return;
      }

      const t = this.ctx.currentTime;
      const step = this.bgmStep;

      // 1. Synth Bass
      const bassFreq = bassline[step];
      if (bassFreq > 0) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, t);
        filter.frequency.exponentialRampToValueAtTime(160, t + 0.12);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.13);
      }

      // 2. Cyber Drums (Kick on 0, 4, 8, 12... Claps on 4, 12... Hihats on 2, 6, 10...)
      if (step % 4 === 0) {
        // Kick drum
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(140, t);
        kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
        kickGain.gain.setValueAtTime(0.35, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.1);
      }

      if (step % 8 === 4) {
        // Snare / Clap
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, t);
        snareGain.gain.setValueAtTime(0.2, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        snareOsc.connect(snareGain);
        snareGain.connect(this.musicGain);
        snareOsc.start(t);
        snareOsc.stop(t + 0.08);
      }

      // 3. Lead melody
      const leadStep = step % leadNotes.length;
      const leadFreq = leadNotes[leadStep];
      if (leadFreq > 0 && Math.random() > 0.3) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(leadFreq, t);

        leadGain.gain.setValueAtTime(0.08, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        leadOsc.connect(leadGain);
        leadGain.connect(this.musicGain);
        leadOsc.start(t);
        leadOsc.stop(t + 0.18);
      }

      this.bgmStep = (this.bgmStep + 1) % bassline.length;
    }, stepInterval * 1000);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

/* ==========================================================================
   OBSTACLE CLASSES (8 TOTAL ACROSS 4 SECTORS)
   Every class implements: size (width, height), speedMultiplier, movementPattern,
   cssClass, and precise multi-box or single-box hitboxes.
   ========================================================================== */

class Obstacle {
  constructor(config) {
    this.type = config.type;
    this.name = config.name;
    this.width = config.width;
    this.height = config.height;
    this.speedMultiplier = config.speedMultiplier || 1.0;
    this.cssClass = config.cssClass;
    this.x = config.startX;
    this.y = config.y || 0; // Altitude above ground
    this.baseY = this.y;
    this.passed = false;
    this.nearMissed = false;
    this.seed = Math.random() * 100;
    this.domElement = null;
    this.initDOM();
  }

  initDOM() {
    this.domElement = document.createElement('div');
    this.domElement.className = `obstacle ${this.cssClass}`;
    this.domElement.style.width = `${this.width}px`;
    this.domElement.style.height = `${this.height}px`;
    this.domElement.style.position = 'absolute';
    this.domElement.style.left = '0px';
    this.domElement.style.bottom = '120px';
    this.domElement.style.zIndex = '25';
    this.domElement.style.pointerEvents = 'none';
    this.renderDOM();
  }

  update(dt, baseSpeed, gameTime) {
    // Standard horizontal translation from right to left
    this.x -= baseSpeed * this.speedMultiplier * dt;
    this.movementPattern(dt, gameTime);
    this.renderDOM();
  }

  movementPattern(dt, gameTime) {
    // Default: stationary relative to ground speed
  }

  renderDOM() {
    if (this.domElement) {
      this.domElement.style.transform = `translate3d(${this.x}px, ${-this.y}px, 0)`;
    }
  }

  // Get screen-aligned bounding boxes for collision and near-miss checks
  getHitboxes(groundScreenY) {
    const bottomScreen = groundScreenY - this.y;
    const topScreen = bottomScreen - this.height;
    return [{
      left: this.x,
      right: this.x + this.width,
      top: topScreen,
      bottom: bottomScreen
    }];
  }

  destroy() {
    if (this.domElement && this.domElement.parentNode) {
      this.domElement.parentNode.removeChild(this.domElement);
    }
  }
}

/* 1. StructuralBlock (Level 1: Neon City) - High-visibility cyber hazard block */
class StructuralBlock extends Obstacle {
  constructor(startX) {
    super({
      type: 'structural_block',
      name: 'Structural Block',
      width: 48,
      height: 72,
      speedMultiplier: 1.0,
      cssClass: 'obs-structural-block',
      startX,
      y: 0
    });
  }
}

/* 2. DefencePyramid (Level 1: Neon City) - Luminous neon hazard ramp */
class DefencePyramid extends Obstacle {
  constructor(startX) {
    super({
      type: 'defence_pyramid',
      name: 'Defence Pyramid',
      width: 58,
      height: 46,
      speedMultiplier: 1.0,
      cssClass: 'obs-defence-pyramid',
      startX,
      y: 0
    });
  }
}

/* 3. RotatingCube (Level 2: The Grid) - 3D spinning polyhedral cube */
class RotatingCube extends Obstacle {
  constructor(startX) {
    super({
      type: 'rotating_cube',
      name: 'Rotating Cube',
      width: 50,
      height: 50,
      speedMultiplier: 1.1,
      cssClass: 'obs-rotating-cube-container',
      startX,
      y: 18 // Slightly levitating
    });
  }

  initDOM() {
    this.domElement = document.createElement('div');
    this.domElement.className = `obstacle ${this.cssClass}`;
    this.domElement.style.width = `${this.width}px`;
    this.domElement.style.height = `${this.height}px`;

    const cube = document.createElement('div');
    cube.className = 'obs-rotating-cube';

    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach((f) => {
      const face = document.createElement('div');
      face.className = `cube-face face-${f}`;
      face.textContent = '◈';
      cube.appendChild(face);
    });

    this.domElement.appendChild(cube);
    this.renderDOM();
  }
}

/* 4. SeekerDrone (Level 2: The Grid) - Flying drone with sinusoidal bobbing */
class SeekerDrone extends Obstacle {
  constructor(startX) {
    super({
      type: 'seeker_drone',
      name: 'Seeker Drone',
      width: 54,
      height: 32,
      speedMultiplier: 1.15,
      cssClass: 'obs-seeker-drone',
      startX,
      y: 105 // Mid-altitude
    });
  }

  initDOM() {
    super.initDOM();
    const eye = document.createElement('div');
    eye.className = 'drone-eye';

    const beam = document.createElement('div');
    beam.className = 'drone-scan-beam';

    const thruster = document.createElement('div');
    thruster.className = 'drone-thruster';

    this.domElement.appendChild(eye);
    this.domElement.appendChild(beam);
    this.domElement.appendChild(thruster);
  }

  movementPattern(dt, gameTime) {
    // Sinusoidal flight path
    this.y = this.baseY + Math.sin(gameTime * 3.8 + this.seed) * 26;
  }
}

/* 5. LaserGate (Level 3: Hyper Drive) - Dual posts with a safe passage gap */
class LaserGate extends Obstacle {
  constructor(startX) {
    super({
      type: 'laser_gate',
      name: 'Laser Gate',
      width: 40,
      height: 250, // Spans playfield height
      speedMultiplier: 1.0,
      cssClass: 'obs-laser-gate',
      startX,
      y: 0
    });
    // Passage gap configured between y = 80 and y = 165
    this.gapBottom = 80;
    this.gapTop = 165;
  }

  initDOM() {
    super.initDOM();
    // Top Pylon
    const pylonTop = document.createElement('div');
    pylonTop.className = 'laser-pylon pylon-top';
    pylonTop.style.height = `${250 - this.gapTop}px`;

    // Bottom Pylon
    const pylonBottom = document.createElement('div');
    pylonBottom.className = 'laser-pylon pylon-bottom';
    pylonBottom.style.height = `${this.gapBottom}px`;

    // Upper and lower laser beams
    const beamTop = document.createElement('div');
    beamTop.className = 'laser-beam-visual beam-top';
    beamTop.style.height = `${250 - this.gapTop}px`;

    const beamBottom = document.createElement('div');
    beamBottom.className = 'laser-beam-visual beam-bottom';
    beamBottom.style.height = `${this.gapBottom}px`;

    // Holographic gap label
    const label = document.createElement('div');
    label.className = 'laser-gap-indicator';
    label.style.bottom = `${this.gapBottom + 26}px`;
    label.textContent = '>> GAP <<';

    this.domElement.appendChild(pylonTop);
    this.domElement.appendChild(pylonBottom);
    this.domElement.appendChild(beamTop);
    this.domElement.appendChild(beamBottom);
    this.domElement.appendChild(label);
  }

  // Multi-box collision: bottom post and top post, leaving safe gap in the center
  getHitboxes(groundScreenY) {
    const bottomScreen = groundScreenY;
    const topPostTop = groundScreenY - this.height;
    const topPostBottom = groundScreenY - this.gapTop;
    const bottomPostTop = groundScreenY - this.gapBottom;
    const bottomPostBottom = groundScreenY;

    return [
      // Bottom hazard post
      {
        left: this.x + 6,
        right: this.x + this.width - 6,
        top: bottomPostTop,
        bottom: bottomPostBottom
      },
      // Top hazard post
      {
        left: this.x + 6,
        right: this.x + this.width - 6,
        top: topPostTop,
        bottom: topPostBottom
      }
    ];
  }
}

/* 6. SurgeConduit (Level 3: Hyper Drive) - Electrified plasma barrier on ground */
class SurgeConduit extends Obstacle {
  constructor(startX) {
    super({
      type: 'surge_conduit',
      name: 'Surge Conduit',
      width: 78,
      height: 44,
      speedMultiplier: 1.2,
      cssClass: 'obs-surge-conduit',
      startX,
      y: 0
    });
  }

  initDOM() {
    super.initDOM();
    const core = document.createElement('div');
    core.className = 'surge-core';

    const spark1 = document.createElement('div');
    spark1.className = 'surge-spark';
    spark1.style.left = '20%';

    const spark2 = document.createElement('div');
    spark2.className = 'surge-spark';
    spark2.style.left = '60%';

    this.domElement.appendChild(core);
    this.domElement.appendChild(spark1);
    this.domElement.appendChild(spark2);
  }
}

/* 7. GlitchShard (Level 4: The Void) - Quantum crystal shifting X-position unpredictably */
class GlitchShard extends Obstacle {
  constructor(startX) {
    super({
      type: 'glitch_shard',
      name: 'Glitch Shard',
      width: 50,
      height: 74,
      speedMultiplier: 1.25,
      cssClass: 'obs-glitch-shard',
      startX,
      y: 0
    });
    this.shiftTimer = 0;
    this.jitterX = 0;
  }

  movementPattern(dt, gameTime) {
    this.shiftTimer += dt;
    // Unpredictably shift X-position every 0.5 seconds
    if (this.shiftTimer >= 0.5) {
      this.shiftTimer = 0;
      this.jitterX = (Math.random() - 0.5) * 80;
    }
  }

  renderDOM() {
    if (this.domElement) {
      const currentX = this.x + this.jitterX;
      this.domElement.style.transform = `translate3d(${currentX}px, ${-this.y}px, 0)`;
    }
  }

  getHitboxes(groundScreenY) {
    const effectiveX = this.x + this.jitterX;
    const bottomScreen = groundScreenY - this.y;
    const topScreen = bottomScreen - this.height;
    return [{
      left: effectiveX + 4,
      right: effectiveX + this.width - 4,
      top: topScreen + 6,
      bottom: bottomScreen
    }];
  }
}

/* 8. VoidAnomaly (Level 4: The Void) - Pulsating cosmic singularity rift */
class VoidAnomaly extends Obstacle {
  constructor(startX) {
    super({
      type: 'void_anomaly',
      name: 'Void Anomaly',
      width: 64,
      height: 64,
      speedMultiplier: 1.3,
      cssClass: 'obs-void-anomaly',
      startX,
      y: 75 // Floating mid-height
    });
    this.scale = 1.0;
  }

  initDOM() {
    super.initDOM();
    const ring = document.createElement('div');
    ring.className = 'void-ring';
    this.domElement.appendChild(ring);
  }

  movementPattern(dt, gameTime) {
    // Pulsating radius
    this.scale = 1.0 + Math.sin(gameTime * 5.2 + this.seed) * 0.24;
  }

  renderDOM() {
    if (this.domElement) {
      this.domElement.style.transform = `translate3d(${this.x}px, ${-this.y}px, 0) scale(${this.scale})`;
    }
  }

  getHitboxes(groundScreenY) {
    const effectiveWidth = this.width * this.scale;
    const effectiveHeight = this.height * this.scale;
    const offsetX = (effectiveWidth - this.width) / 2;
    const offsetY = (effectiveHeight - this.height) / 2;

    const bottomScreen = groundScreenY - this.y + offsetY;
    const topScreen = bottomScreen - effectiveHeight;
    return [{
      left: this.x - offsetX + 6,
      right: this.x + this.width + offsetX - 6,
      top: topScreen + 6,
      bottom: bottomScreen - 6
    }];
  }
}

/* ==========================================================================
   PARTICLE FX ENGINE (CANVAS BASED HIGH-SPEED VISUALS)
   ========================================================================== */
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnRunningDust(x, y) {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y - 2,
        vx: -(Math.random() * 120 + 60),
        vy: -(Math.random() * 30 + 10),
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff007f',
        alpha: 0.8,
        life: 0.35,
        maxLife: 0.35
      });
    }
  }

  spawnJumpBurst(x, y) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
      const speed = Math.random() * 220 + 80;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed - 60,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        color: '#00f0ff',
        alpha: 1.0,
        life: 0.45,
        maxLife: 0.45
      });
    }
  }

  spawnDoubleJumpBurst(x, y) {
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 280 + 120;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.4 ? '#ffe600' : '#bc13fe',
        alpha: 1.0,
        life: 0.5,
        maxLife: 0.5
      });
    }
  }

  spawnNearMissShock(x, y) {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 340 + 150;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4.5 + 2,
        color: Math.random() > 0.5 ? '#ffe600' : '#00f0ff',
        alpha: 1.0,
        life: 0.6,
        maxLife: 0.6
      });
    }
  }

  /* High-speed Cyber Motion Trail Ghost & Thruster Embers */
  spawnMotionTrail(x, y, isAirborne) {
    // Cyberpunk silhouette afterglow particle
    this.particles.push({
      x: x - 4,
      y: y + (Math.random() - 0.5) * 20,
      vx: -(Math.random() * 60 + 80),
      vy: (Math.random() - 0.5) * 12,
      size: Math.random() * 8 + 6,
      color: isAirborne ? '#ffe600' : (Math.random() > 0.4 ? '#00f0ff' : '#bc13fe'),
      alpha: 0.6,
      life: 0.28,
      maxLife: 0.28
    });

    // Cyber Visor Neon Ribbon Streak
    this.particles.push({
      x: x + 16,
      y: y - 22,
      vx: -220,
      vy: 0,
      size: 3,
      color: '#ff007f',
      alpha: 0.9,
      life: 0.14,
      maxLife: 0.14
    });
  }

  spawnCrashExplosion(x, y) {
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 450 + 100;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 2,
        color: Math.random() > 0.5 ? '#ff2255' : (Math.random() > 0.5 ? '#00f0ff' : '#ffe600'),
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9
      });
    }
  }

  updateAndRender(dt, obstacles, screenGroundY) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render bright neon obstacle footprints & direction indicators on runway
    if (obstacles && obstacles.length && screenGroundY) {
      this.drawObstacleHighlights(obstacles, screenGroundY);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = p.life / p.maxLife;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawObstacleHighlights(obstacles, screenGroundY) {
    this.ctx.save();
    for (let i = 0; i < obstacles.length; i++) {
      const obs = obstacles[i];
      const ox = obs.x;
      const oy = screenGroundY - obs.y;
      const w = obs.width;

      // 1. Glowing ground laser baseline projection under obstacle
      this.ctx.strokeStyle = '#ffe600';
      this.ctx.shadowColor = '#ffe600';
      this.ctx.shadowBlur = 15;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(ox - 8, oy);
      this.ctx.lineTo(ox + w + 8, oy);
      this.ctx.stroke();

      // 2. High-contrast neon direction chevron pointing left
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 8;
      this.ctx.font = '900 11px sans-serif';
      this.ctx.fillText('◀◀', ox - 20, oy - 4);
    }
    this.ctx.restore();
  }

  clear() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ==========================================================================
   MASTER GAME CONTROLLER
   ========================================================================== */
class NeonRunnerGame {
  constructor() {
    // DOM references
    this.gameViewport = document.getElementById('gameViewport');
    this.gameCanvas = document.getElementById('gameCanvas');
    this.fxCanvas = document.getElementById('fxCanvas');
    this.obstaclesLayer = document.getElementById('obstaclesLayer');
    this.playerEl = document.getElementById('player');
    this.playerTrailEl = document.getElementById('playerMotionTrail');
    this.playerShockwave = document.getElementById('playerShockwave');
    this.floatingTextsEl = document.getElementById('floatingTexts');

    // Skyline parallax layers
    this.bgLayer1 = document.getElementById('bgLayer1');
    this.bgLayer2 = document.getElementById('bgLayer2');
    this.bgLayer3 = document.getElementById('bgLayer3');
    this.groundGrid = document.querySelector('.ground-grid-lines');
    this.groundSpeedLasers = document.querySelector('.ground-speed-lasers');

    // HUD references
    this.scoreValEl = document.getElementById('scoreVal');
    this.bestValEl = document.getElementById('bestVal');
    this.levelValEl = document.getElementById('levelVal');
    this.speedValEl = document.getElementById('speedVal');
    this.nearMissCounterEl = document.getElementById('nearMissCounter');
    this.focusMultiplierEl = document.getElementById('focusMultiplier');
    this.focusBarEl = document.getElementById('focusBar');
    this.btnAudioToggle = document.getElementById('btnAudioToggle');
    this.audioIcon = document.getElementById('audioIcon');
    this.btnMusicTrack = document.getElementById('btnMusicTrack');
    this.musicIcon = document.getElementById('musicIcon');

    // Screens
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.levelUpOverlay = document.getElementById('levelUpOverlay');
    this.levelUpTitle = document.getElementById('levelUpTitle');
    this.levelUpSpeed = document.getElementById('levelUpSpeed');
    this.levelUpIntel = document.getElementById('levelUpIntel');

    this.finalScoreVal = document.getElementById('finalScoreVal');
    this.bestRecordVal = document.getElementById('bestRecordVal');
    this.finalSectorVal = document.getElementById('finalSectorVal');
    this.finalNearMissVal = document.getElementById('finalNearMissVal');
    this.newRecordBadge = document.getElementById('newRecordBadge');

    this.btnStartGame = document.getElementById('btnStartGame');
    this.btnRestartGame = document.getElementById('btnRestartGame');

    // Audio & FX
    this.synth = new CyberSynth();
    this.fx = new ParticleEngine(this.fxCanvas);

    // Game Physics & State
    this.state = 'START'; // START, PLAYING, LEVEL_UP, GAMEOVER
    this.lastTime = 0;
    this.gameTime = 0;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('neon_runner_best_score') || '0', 10);
    this.nearMissCount = 0;
    this.focusMultiplier = 1.0;

    // Time scaling (Slow-mo focus system)
    this.timeScale = 1.0;
    this.slowMoTimer = 0;
    this.isSlowMoActive = false;

    // Player Physics State
    this.playerX = 120;
    this.playerY = 0; // 0 = on ground
    this.playerVy = 0;
    this.gravity = 1950; // px/s^2
    this.jumpForce = 700; // upward px/s
    this.doubleJumpForce = 640;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.playerWidth = 48;
    this.playerHeight = 84;
    this.groundHeight = 120;
    this.trailHistory = [];
    this.trailTimer = 0;

    // Obstacles & Level Configuration
    this.obstacles = [];
    this.spawnTimer = 0;
    this.minSpawnInterval = 1.6; // seconds
    this.maxSpawnInterval = 2.4;
    this.currentSpawnTarget = 1.8;

    // Sector Configuration
    this.level = 1;
    this.baseSpeed = 420; // px/s
    this.levelSpeedMultiplier = 1.0;
    this.levelData = {
      1: {
        name: 'NEON CITY',
        speedMult: 1.0,
        scoreThreshold: 0,
        nextThreshold: 500,
        allowedObstacles: [StructuralBlock, DefencePyramid],
        intel: 'Structural Blocks & Defence Pyramids'
      },
      2: {
        name: 'THE GRID',
        speedMult: 1.2,
        scoreThreshold: 500,
        nextThreshold: 1300,
        allowedObstacles: [RotatingCube, SeekerDrone, StructuralBlock],
        intel: 'Rotating Cubes & Seeker Drones introduced (+20% Speed)'
      },
      3: {
        name: 'HYPER DRIVE',
        speedMult: 1.4,
        scoreThreshold: 1300,
        nextThreshold: 2400,
        allowedObstacles: [LaserGate, SurgeConduit, RotatingCube, SeekerDrone],
        intel: 'Laser Gates & Surge Conduits introduced (+40% Speed)'
      },
      4: {
        name: 'THE VOID',
        speedMult: 1.6,
        scoreThreshold: 2400,
        nextThreshold: Infinity,
        allowedObstacles: [GlitchShard, VoidAnomaly, LaserGate, SurgeConduit, RotatingCube],
        intel: 'Glitch Shards & Void Anomalies (Quantum jitter & max speed)'
      }
    };

    // Parallax background offsets
    this.p1Offset = 0;
    this.p2Offset = 0;
    this.p3Offset = 0;
    this.groundGridOffset = 0;

    // Initialize Event Listeners
    this.initEvents();
    this.updateHUD();

    // Start requestAnimationFrame loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /* ==========================================================================
     INPUT & EVENT LISTENERS
     ========================================================================== */
  initEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.fx.resize();
      this.updatePlayerXPosition();
    });
    this.updatePlayerXPosition();

    // Keyboard Jump
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this.handleJumpInput();
      }
    });

    // Screen Touch / Mouse Click Jump
    this.gameViewport.addEventListener('pointerdown', (e) => {
      // Don't trigger if clicking HUD buttons or modal buttons
      if (e.target.closest('button') || e.target.closest('.modal-card')) return;
      this.handleJumpInput();
    });

    // Start & Restart Buttons
    this.btnStartGame.addEventListener('click', () => {
      this.synth.init();
      this.synth.resume();
      this.synth.startBGM();
      this.synth.playClick();
      this.startGame();
    });

    this.btnRestartGame.addEventListener('click', () => {
      this.synth.init();
      this.synth.resume();
      this.synth.playClick();
      this.startGame();
    });

    // Audio Toggles
    this.btnAudioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isSoundOn = this.synth.toggleMute();
      this.audioIcon.textContent = isSoundOn ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
    });

    this.btnMusicTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const isMusicOn = this.synth.toggleMusic();
      this.musicIcon.textContent = isMusicOn ? '🎵 BGM: ON' : '🔇 BGM: OFF';
    });
  }

  updatePlayerXPosition() {
    this.playerX = window.innerWidth < 640 ? 45 : 120;
    this.playerEl.style.left = `${this.playerX}px`;
  }

  handleJumpInput() {
    if (this.state === 'START') {
      this.synth.init();
      this.synth.resume();
      this.synth.startBGM();
      this.startGame();
      return;
    }

    if (this.state === 'GAMEOVER') {
      this.startGame();
      return;
    }

    if (this.state === 'PLAYING') {
      this.executeJump();
    }
  }

  executeJump() {
    if (this.jumpCount === 0) {
      // First Jump from ground
      this.playerVy = this.jumpForce;
      this.jumpCount = 1;
      this.synth.playJump();
      this.fx.spawnJumpBurst(this.playerX + 24, window.innerHeight - this.groundHeight);
      this.triggerShockwave();
    } else if (this.jumpCount === 1) {
      // Double Jump in mid-air
      this.playerVy = this.doubleJumpForce;
      this.jumpCount = 2;
      this.synth.playDoubleJump();
      this.fx.spawnDoubleJumpBurst(this.playerX + 24, window.innerHeight - this.groundHeight - this.playerY);
      this.triggerShockwave();
    }
  }

  triggerShockwave() {
    this.playerShockwave.classList.remove('pulse');
    void this.playerShockwave.offsetWidth; // Force reflow
    this.playerShockwave.classList.add('pulse');
  }

  /* ==========================================================================
     GAME LIFECYCLE MANAGEMENT
     ========================================================================== */
  startGame() {
    // Clear old obstacles
    this.obstacles.forEach((obs) => obs.destroy());
    this.obstacles = [];
    this.obstaclesLayer.innerHTML = '';

    // Reset physics & score
    this.score = 0;
    this.nearMissCount = 0;
    this.focusMultiplier = 1.0;
    this.playerY = 0;
    this.playerVy = 0;
    this.jumpCount = 0;
    this.spawnTimer = 0;
    this.level = 1;
    this.levelSpeedMultiplier = 1.0;

    // Reset time scaling & filters
    this.timeScale = 1.0;
    this.slowMoTimer = 0;
    this.isSlowMoActive = false;
    this.gameCanvas.classList.remove('slow-mo');

    // Hide overlays
    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.levelUpOverlay.classList.add('hidden');

    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.updateHUD();

    // Spawn initial obstacle ahead so player immediately sees it approaching on the runway!
    const initialSpawnX = Math.max(window.innerWidth * 0.72, 680);
    this.spawnObstacle(initialSpawnX);
    this.spawnTimer = 0;
    this.currentSpawnTarget = 1.4;
  }

  triggerGameOver() {
    this.state = 'GAMEOVER';
    this.synth.playCollision();

    // Spawn dramatic crash explosion
    const screenGroundY = window.innerHeight - this.groundHeight;
    this.fx.spawnCrashExplosion(this.playerX + 24, screenGroundY - this.playerY);

    // Check High Score
    let isNewRecord = false;
    if (this.score > this.bestScore) {
      this.bestScore = Math.floor(this.score);
      localStorage.setItem('neon_runner_best_score', this.bestScore.toString());
      isNewRecord = true;
    }

    // Populate Game Over Screen
    this.finalScoreVal.textContent = Math.floor(this.score).toString().padStart(6, '0');
    this.bestRecordVal.textContent = this.bestScore.toString().padStart(6, '0');
    this.finalSectorVal.textContent = `L${this.level} : ${this.levelData[this.level].name}`;
    this.finalNearMissVal.textContent = `${this.nearMissCount} (+${this.nearMissCount * 50} PTS)`;

    if (isNewRecord) {
      this.newRecordBadge.classList.remove('hidden');
    } else {
      this.newRecordBadge.classList.add('hidden');
    }

    // Remove slowmo filter if active
    this.gameCanvas.classList.remove('slow-mo');
    this.isSlowMoActive = false;

    setTimeout(() => {
      this.gameOverScreen.classList.remove('hidden');
    }, 600);
  }

  /* ==========================================================================
     LEVEL PROGRESSION & LEVEL-UP FLASH SYSTEM
     ========================================================================== */
  checkLevelProgression() {
    const currentLvlCfg = this.levelData[this.level];
    if (this.level < 4 && this.score >= currentLvlCfg.nextThreshold) {
      this.level++;
      const newLvlCfg = this.levelData[this.level];
      this.levelSpeedMultiplier = newLvlCfg.speedMult;

      // Adjust spawn intervals for higher difficulty
      if (this.level === 3) {
        this.minSpawnInterval = 1.3;
        this.maxSpawnInterval = 1.9;
      } else if (this.level === 4) {
        this.minSpawnInterval = 1.0;
        this.maxSpawnInterval = 1.5;
      }

      this.triggerLevelUpFlash(newLvlCfg);
    }
  }

  triggerLevelUpFlash(lvlCfg) {
    this.synth.playLevelUp();

    this.levelUpTitle.textContent = `SECTOR 0${this.level}: ${lvlCfg.name}`;
    const speedPercent = Math.round((lvlCfg.speedMult - 1.0) * 100);
    this.levelUpSpeed.textContent = `VELOCITY INCREASED: +${speedPercent}%`;
    this.levelUpIntel.textContent = `NEW THREATS DETECTED: ${lvlCfg.intel}`;

    this.levelUpOverlay.classList.remove('hidden');

    // Float notification
    this.spawnFloatingText(`SECTOR 0${this.level} UNLOCKED!`, this.playerX + 100, window.innerHeight * 0.35, true);

    // Auto dismiss level up flash after 2 seconds
    setTimeout(() => {
      this.levelUpOverlay.classList.add('hidden');
    }, 2200);
  }

  /* ==========================================================================
     NEAR-MISS SLOW-MO FOCUS SYSTEM (+50 BONUS & CSS FILTER)
     ========================================================================== */
  triggerNearMiss(obstacle, hitBox) {
    obstacle.nearMissed = true;
    this.nearMissCount++;

    // Mandatory: Award +50 score bonus
    this.score += 50;
    this.focusMultiplier = Math.min(3.0, (1.0 + this.nearMissCount * 0.1));

    // Mandatory: Game speed halves for 1.5 seconds
    this.timeScale = 0.5;
    this.slowMoTimer = 1.5; // 1.5 seconds duration
    this.isSlowMoActive = true;

    // Mandatory: Apply css filter: saturate(3) blur(1px) to game canvas
    this.gameCanvas.classList.add('slow-mo');

    // Audio & Visual Effects
    this.synth.playNearMiss();
    this.triggerShockwave();

    const screenGroundY = window.innerHeight - this.groundHeight;
    this.fx.spawnNearMissShock(this.playerX + 35, screenGroundY - this.playerY - 20);

    // Spawn floating score bonus text
    this.spawnFloatingText('+50 NEAR MISS!', this.playerX + 50, screenGroundY - this.playerY - 30, false);

    this.updateHUD();
  }

  updateSlowMo(rawDt) {
    if (this.isSlowMoActive) {
      this.slowMoTimer -= rawDt;
      if (this.slowMoTimer <= 0) {
        this.isSlowMoActive = false;
        this.timeScale = 1.0;
        this.gameCanvas.classList.remove('slow-mo');
        this.synth.playNearMissEnd();
      }
    }
  }

  spawnFloatingText(text, x, y, isHuge = false) {
    const el = document.createElement('div');
    el.className = `floating-text ${isHuge ? 'bonus-huge' : ''}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    this.floatingTextsEl.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1200);
  }

  /* ==========================================================================
     SPAWNING LOGIC
     ========================================================================== */
  updateSpawning(dt) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.currentSpawnTarget) {
      this.spawnTimer = 0;
      this.spawnObstacle();

      // Randomize next spawn interval according to current level intensity
      const range = this.maxSpawnInterval - this.minSpawnInterval;
      this.currentSpawnTarget = this.minSpawnInterval + Math.random() * range;
    }
  }

  spawnObstacle(customX) {
    const allowed = this.levelData[this.level].allowedObstacles;
    const ChosenClass = allowed[Math.floor(Math.random() * allowed.length)];
    const startX = customX !== undefined ? customX : window.innerWidth + 80;

    const obstacle = new ChosenClass(startX);
    this.obstacles.push(obstacle);
    this.obstaclesLayer.appendChild(obstacle.domElement);
  }

  /* ==========================================================================
     PHYSICS, MOVEMENT & COLLISION DETECTION (CHECKED EVERY FRAME)
     ========================================================================== */
  updatePlayerPhysics(dt) {
    // Apply gravity
    this.playerVy -= this.gravity * dt;
    this.playerY += this.playerVy * dt;

    // Ground landing check
    if (this.playerY <= 0) {
      this.playerY = 0;
      this.playerVy = 0;
      this.jumpCount = 0; // Double jump resets on landing
      this.playerEl.classList.add('running');
      this.playerEl.classList.remove('jumping');

      // Spawn ground dust particles if running
      this.fx.spawnRunningDust(this.playerX + 15, window.innerHeight - this.groundHeight);
    } else {
      this.playerEl.classList.remove('running');
      this.playerEl.classList.add('jumping');
    }

    // Update DOM position
    this.playerEl.style.transform = `translate3d(0, ${-this.playerY}px, 0)`;

    // High performance canvas motion trail
    this.trailTimer += dt;
    if (this.trailTimer >= 0.035) {
      this.trailTimer = 0;
      const screenGroundY = window.innerHeight - this.groundHeight;
      this.fx.spawnMotionTrail(this.playerX + 20, screenGroundY - this.playerY - 35, this.playerY > 0);
    }
  }

  updateObstacles(dt) {
    const currentSpeed = this.baseSpeed * this.levelSpeedMultiplier;
    const screenGroundY = window.innerHeight - this.groundHeight;

    // Player AABB Bounding Box in screen coordinates
    const pLeft = this.playerX + 8;
    const pRight = this.playerX + this.playerWidth - 8;
    const pBottom = screenGroundY - this.playerY;
    const pTop = pBottom - this.playerHeight + 8;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(dt, currentSpeed, this.gameTime);

      // Check collision with all hitboxes of the obstacle
      const hitboxes = obs.getHitboxes(screenGroundY);

      for (let h = 0; h < hitboxes.length; h++) {
        const box = hitboxes[h];

        // 1. Precise Collision Check
        const collided = (
          pLeft < box.right &&
          pRight > box.left &&
          pTop < box.bottom &&
          pBottom > box.top
        );

        if (collided) {
          this.triggerGameOver();
          return;
        }

        // 2. Near-Miss Detection: within 12px without collision
        if (!obs.nearMissed) {
          const nearMiss = (
            pLeft - 12 < box.right &&
            pRight + 12 > box.left &&
            pTop - 12 < box.bottom &&
            pBottom + 12 > box.top
          );

          if (nearMiss) {
            this.triggerNearMiss(obs, box);
          }
        }
      }

      // Cleanup off-screen obstacles
      if (obs.x + obs.width < -100) {
        obs.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  /* ==========================================================================
     PARALLAX 3D SKYLINE UPDATE
     ========================================================================== */
  updateParallax(dt) {
    const speed = this.baseSpeed * this.levelSpeedMultiplier;

    // Layer 1: Distant Arcologies (Slowest: 0.15x)
    this.p1Offset = (this.p1Offset - speed * 0.15 * dt) % (window.innerWidth || 1000);
    this.bgLayer1.style.transform = `translate3d(${this.p1Offset}px, 0, 0)`;

    // Layer 2: Midground Towers (0.40x)
    this.p2Offset = (this.p2Offset - speed * 0.40 * dt) % (window.innerWidth || 1000);
    this.bgLayer2.style.transform = `translate3d(${this.p2Offset}px, 0, 0)`;

    // Layer 3: Near Industrial Pylons (0.80x)
    this.p3Offset = (this.p3Offset - speed * 0.80 * dt) % 400;
    this.bgLayer3.style.transform = `translate3d(${this.p3Offset}px, 0, 0)`;

    // 3D Perspective Ground Grid (1.0x)
    this.groundGridOffset = (this.groundGridOffset - speed * 1.0 * dt) % 75;
    this.groundGrid.style.transform = `translate3d(${this.groundGridOffset}px, 0, 0)`;
  }

  /* ==========================================================================
     HUD DISPLAY UPDATE
     ========================================================================== */
  updateHUD() {
    this.scoreValEl.textContent = Math.floor(this.score).toString().padStart(6, '0');
    this.bestValEl.textContent = this.bestScore.toString().padStart(6, '0');

    const currentLvlCfg = this.levelData[this.level];
    this.levelValEl.textContent = `L${this.level} : ${currentLvlCfg.name}`;
    this.speedValEl.textContent = `${this.levelSpeedMultiplier.toFixed(2)}x`;
    this.nearMissCounterEl.textContent = this.nearMissCount.toString();

    // Focus multiplier gauge
    this.focusMultiplierEl.textContent = `${this.focusMultiplier.toFixed(1)}x`;
    const focusPercent = Math.min(100, (this.nearMissCount % 10) * 10);
    this.focusBarEl.style.width = `${focusPercent}%`;
  }

  /* ==========================================================================
     MASTER 60 FPS GAME LOOP
     ========================================================================== */
  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;

    // Calculate delta time
    const rawDt = Math.min((timestamp - this.lastTime) / 1000, 0.1); // Clamp to prevent spiral on lag
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      // Process slow-mo timer in real time
      this.updateSlowMo(rawDt);

      // Scaled dt for game physics (halves to 0.5 during near-miss focus!)
      const dt = rawDt * this.timeScale;
      this.gameTime += dt;

      // Score increases continuously while alive
      this.score += dt * 25 * this.levelSpeedMultiplier * this.focusMultiplier;

      // Check Sector progression
      this.checkLevelProgression();

      // Updates
      this.updatePlayerPhysics(dt);
      this.updateSpawning(dt);
      this.updateObstacles(dt);
      this.updateParallax(dt);
      this.fx.updateAndRender(dt);
      this.updateHUD();
    } else {
      // Gentle background drift while on start or gameover screen
      this.updateParallax(rawDt * 0.25);
      this.fx.updateAndRender(rawDt);
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// Instantiate game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.neonRunner = new NeonRunnerGame();
});
