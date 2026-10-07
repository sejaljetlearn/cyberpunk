# ⚡ NEON RUNNER // 3D Cyberpunk Endless Runner

> A high-velocity, adrenaline-fueled 3D endless runner browser game built entirely with pure **HTML5, CSS3 3D Transforms, and Vanilla JavaScript** — zero external libraries, zero frameworks, and zero build step.

---

## 🎮 Play Directly in Browser

To launch the game:
1. Double-click or open [`index.html`](index.html) in any modern browser (Chrome, Edge, Firefox, Safari).
2. Or serve locally with any static web server (e.g. VS Code Live Server, Python `python -m http.server`, etc.).

---

## 🚀 One-Click GitHub Pages Deployment

This project requires **no build step** and is 100% self-contained in a single folder:
1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Within moments, your game will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 🕹️ Controls & Mechanics

| Input | Action | Description |
|---|---|---|
| **Spacebar** / **Up Arrow** / **W** | **Jump** | Applies upward velocity with gravity pull. |
| **Spacebar** (while airborne) | **Double Jump** | Mid-air booster leap with sonic shockwave ring; resets upon landing. |
| **Touch / Screen Tap** | **Jump / Double Jump** | Mobile & tablet friendly tap-to-jump. |
| **Near-Miss Graze (< 12px)** | **Slow-Mo Focus** | Passes within 12px of any obstacle without collision: **game speed halves for 1.5s**, applies CSS filter `saturate(3) blur(1px)`, and awards **+50 bonus points**! |

---

## 🌆 Sectors & 8 Unique Obstacle Classes

Each obstacle is an encapsulated JavaScript class featuring its own distinct 3D visual styling, speed multiplier, collision hitboxes, and movement pattern:

### 🏙️ Sector 1: Neon City (1.0x Speed)
* **`StructuralBlock`**: Tall ground barriers with neon cyan wireframe edges, magenta danger chevrons, and digital caution stripes.
* **`DefencePyramid`**: Angled hazard ramps with luminous polygon clip-path geometry and blinking apex warning beacon.

### 🌐 Sector 2: The Grid (+20% Speed: 1.2x)
* **`RotatingCube`**: 3D spinning polyhedral cube featuring 6 individual CSS 3D transformed faces rotating continuously on X, Y, and Z axes.
* **`SeekerDrone`**: Autonomous reconnaissance drone flying at mid-altitude with a downward scanning laser beam and sinusoidal bobbing flight pattern.

### ⚡ Sector 3: Hyper Drive (+40% Speed: 1.4x)
* **`LaserGate`**: Dual emitter posts (top & bottom) with a designated safe gap window in the middle. Players must time their jump to pass cleanly through!
* **`SurgeConduit`**: High-voltage electrical capacitor rail with animated plasma arcs and crackling energy bolts.

### 🌌 Sector 4: The Void (+60% Speed: 1.6x)
* **`GlitchShard`**: Unstable quantum crystals with RGB chromatic split that unpredictably shift X-position every 0.5 seconds!
* **`VoidAnomaly`**: Pulsating cosmic singularity rift with rotating event horizon rings that dynamically expand and contract in scale.

---

## 🔊 Built-in Web Audio Synthesizer

The game includes a self-contained Web Audio API synthesizer that requires zero external audio files:
* **Cyberpunk Synthwave BGM**: 16th-note arpeggiated bassline, 4-on-the-floor synth kicks, claps, and atmospheric lead melodies.
* **Dynamic SFX**: Pitch-rising jump sweeps, harmonic double-jump thrusts, cinematic sub-bass slow-mo dilation, level-up fanfare, and crunchy collision explosions.
* **Mute Toggles**: Toggle BGM and Master SFX anytime via HUD buttons.

---

## 🛠️ Tech Stack & Architecture

* **HTML5 Semantic Structure**: Semantic layout with HUD, 3D viewport, and modal overlays.
* **CSS3 3D Perspective & Parallax**:
  * `perspective: 900px` & `transform-style: preserve-3d`
  * 3 Parallax skyline layers (Distant megacity arcologies, midground towers with glowing conduits, near industrial pylons)
  * 3D perspective ground runway (`rotateX(45deg)`) with infinite scrolling neon grid
  * CRT Scanline overlay, screen vignette, and chromatic aberration
  * Dynamic filter `saturate(3) blur(1px)` during slow-mo
* **Vanilla JavaScript Game Loop**:
  * 60 FPS `requestAnimationFrame` loop with delta-time (`dt`) calculation
  * Frame-by-frame AABB bounding box collision detection and 12px near-miss detection
  * Persistent high score tracking with `localStorage`
