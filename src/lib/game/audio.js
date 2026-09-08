const MUSIC_TRACKS = Object.values(
  import.meta.glob("../../assets/music/*.{mp3,MP3,ogg,OGG,wav,WAV,m4a,M4A}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);

let buses = null;
let ambientNodes = null;

let musicGainValue = 0.45;
let sfxGainValue = 0.7;

let unlocked = false;

// Actual music player
let musicPlayer = null;
let currentTrack = -1;
let musicPlaying = false;

function curve(v) {
  const x = Math.min(1, Math.max(0, v));
  return x * x;
}

function ensure() {
  if (typeof window === "undefined") return null;

  if (buses) return buses;

  const AC = window.AudioContext || window.webkitAudioContext;

  if (!AC) return null;

  const ctx = new AC({
    latencyHint: "interactive",
  });

  const master = ctx.createGain();
  const music = ctx.createGain();
  const sfx = ctx.createGain();

  music.gain.value = curve(musicGainValue) * 0.35;
  sfx.gain.value = curve(sfxGainValue);

  music.connect(master);
  sfx.connect(master);

  master.connect(ctx.destination);

  buses = {
    ctx,
    master,
    music,
    sfx,
  };

  return buses;
}

/* -------------------------------------------------------
   AUDIO UNLOCK
------------------------------------------------------- */

export function unlockAudio() {
  const b = ensure();

  if (!b) return;

  if (b.ctx.state === "suspended") {
    void b.ctx.resume();
  }

  unlocked = true;

  // Start actual music after the user's first interaction.
  startAmbient();
}

/* -------------------------------------------------------
   VOLUME
------------------------------------------------------- */

export function setMusicVolume(v) {
  musicGainValue = v;

  if (buses) {
    buses.music.gain.setTargetAtTime(
      curve(v) * 0.35,
      buses.ctx.currentTime,
      0.04,
    );
  }

  if (musicPlayer) {
    musicPlayer.volume = Math.max(0, Math.min(1, v));
  }
}

export function setSfxVolume(v) {
  sfxGainValue = v;

  if (!buses) return;

  buses.sfx.gain.setTargetAtTime(curve(v), buses.ctx.currentTime, 0.03);
}

/* -------------------------------------------------------
   SFX
------------------------------------------------------- */

function tone(freq, dur, type, gain, when = 0, dest = "sfx") {
  const b = buses;

  if (!b || !unlocked) return;

  const t = b.ctx.currentTime + when;

  const osc = b.ctx.createOscillator();
  const g = b.ctx.createGain();

  osc.type = type;

  osc.frequency.setValueAtTime(freq, t);

  g.gain.setValueAtTime(0.0001, t);

  g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain), t + 0.018);

  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(g);

  g.connect(dest === "music" ? b.music : b.sfx);

  osc.start(t);

  osc.stop(t + dur + 0.02);
}

export function playFlip() {
  const jitter = 1 + (Math.random() * 0.08 - 0.04);

  tone(640 * jitter, 0.07, "triangle", 0.07);
}

export function playMatch() {
  tone(523.25, 0.16, "sine", 0.09);

  tone(783.99, 0.22, "sine", 0.07, 0.05);
}

export function playMiss() {
  tone(196, 0.18, "sine", 0.05);
}

export function playWin() {
  tone(523.25, 0.2, "sine", 0.08);

  tone(659.25, 0.22, "sine", 0.07, 0.08);

  tone(783.99, 0.28, "sine", 0.07, 0.16);

  tone(1046.5, 0.32, "triangle", 0.05, 0.26);
}

export function playRest() {
  tone(220, 0.28, "sine", 0.05);

  tone(277, 0.3, "sine", 0.04, 0.1);
}

export function playHint() {
  tone(880, 0.12, "triangle", 0.05);

  tone(1320, 0.16, "sine", 0.04, 0.06);
}

/* -------------------------------------------------------
   ACTUAL MUSIC
------------------------------------------------------- */

function getMusicPlayer() {
  if (typeof window === "undefined") {
    return null;
  }

  if (musicPlayer) {
    return musicPlayer;
  }

  musicPlayer = new Audio();

  musicPlayer.preload = "auto";

  musicPlayer.volume = musicGainValue;

  // When one song finishes,
  // automatically play the next one.
  musicPlayer.addEventListener("ended", () => {
    playNextMusic();
  });

  musicPlayer.addEventListener("error", () => {
    musicPlaying = false;

    // If one file is broken, try the next track.
    if (MUSIC_TRACKS.length > 1) {
      playNextMusic();
    }
  });

  return musicPlayer;
}

function playNextMusic() {
  if (!MUSIC_TRACKS.length) {
    console.warn("No music files found in src/assets/music/");

    return;
  }

  const player = getMusicPlayer();

  if (!player) return;

  // Move to next track.
  currentTrack = (currentTrack + 1) % MUSIC_TRACKS.length;

  const nextTrack = MUSIC_TRACKS[currentTrack];

  player.src = nextTrack;

  player.volume = musicGainValue;

  musicPlaying = true;

  const promise = player.play();

  if (promise) {
    promise.catch(() => {
      musicPlaying = false;
    });
  }
}

/* -------------------------------------------------------
   START MUSIC
------------------------------------------------------- */

export function startAmbient() {
  if (!unlocked) return;

  if (!MUSIC_TRACKS.length) {
    console.warn(
      "No music found. Put .mp3/.ogg/.wav/.m4a files inside src/assets/music/",
    );

    return;
  }

  const player = getMusicPlayer();

  if (!player) return;

  // First song.
  if (!player.src) {
    playNextMusic();
    return;
  }

  // Resume current song.
  const promise = player.play();

  if (promise) {
    promise
      .then(() => {
        musicPlaying = true;
      })
      .catch(() => {
        musicPlaying = false;
      });
  }
}

/* -------------------------------------------------------
   STOP MUSIC
------------------------------------------------------- */

export function stopAmbient() {
  if (!musicPlayer) return;

  musicPlayer.pause();

  musicPlayer.currentTime = 0;

  musicPlaying = false;
}

/* -------------------------------------------------------
   PAUSE MUSIC
------------------------------------------------------- */

export function pauseMusic() {
  if (!musicPlayer) return;

  musicPlayer.pause();

  musicPlaying = false;
}

/* -------------------------------------------------------
   TOGGLE MUSIC
------------------------------------------------------- */

export function toggleMusic() {
  if (!unlocked) {
    unlockAudio();
    return true;
  }

  if (!musicPlayer) {
    startAmbient();
    return true;
  }

  if (musicPlayer.paused) {
    startAmbient();
    return true;
  }

  pauseMusic();

  return false;
}

/* -------------------------------------------------------
   RESUME
------------------------------------------------------- */

export function resumeIfNeeded() {
  if (!buses) return;

  if (buses.ctx.state === "suspended") {
    void buses.ctx.resume();
  }

  if (unlocked && musicPlayer && musicPlayer.paused) {
    const promise = musicPlayer.play();

    if (promise) {
      promise.catch(() => {});
    }
  }
}

/* -------------------------------------------------------
   STATUS
------------------------------------------------------- */

export function isAudioUnlocked() {
  return unlocked;
}

export function isMusicPlaying() {
  return musicPlaying;
}

export function getMusicTracks() {
  return MUSIC_TRACKS;
}
