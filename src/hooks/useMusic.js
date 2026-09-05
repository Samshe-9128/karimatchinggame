import { useEffect, useRef, useState } from "react";

import {
  readStorage,
  writeStorage,
} from "../utils/storage";

const musicFiles = import.meta.glob(
  "../assets/music/*.{mp3,MP3,ogg,OGG,wav,WAV,m4a,M4A}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const MUSIC_TRACKS = Object.values(musicFiles);

export default function useMusic() {
  const [musicOn, setMusicOn] = useState(() => {
    return (
      readStorage("kari-memory-music", "on") !== "off"
    );
  });

  const audioRef = useRef(null);
  const musicOnRef = useRef(musicOn);
  const currentTrackRef = useRef(null);

  useEffect(() => {
    musicOnRef.current = musicOn;

    writeStorage(
      "kari-memory-music",
      musicOn ? "on" : "off",
    );

    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  useEffect(() => {
    if (MUSIC_TRACKS.length === 0) {
      return undefined;
    }

    const audio = new Audio();

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.3;

    audioRef.current = audio;

    function chooseTrack() {
      if (MUSIC_TRACKS.length === 1) {
        return MUSIC_TRACKS[0];
      }

      const available = MUSIC_TRACKS.filter(
        (track) =>
          track !== currentTrackRef.current,
      );

      return available[
        Math.floor(
          Math.random() * available.length,
        )
      ];
    }

    function playNextTrack() {
      const nextTrack = chooseTrack();

      currentTrackRef.current = nextTrack;
      audio.src = nextTrack;

      if (musicOnRef.current) {
        audio.play().catch(() => {});
      }
    }

    audio.addEventListener(
      "ended",
      playNextTrack,
    );

    playNextTrack();

    return () => {
      audio.removeEventListener(
        "ended",
        playNextTrack,
      );

      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    function unlockAudio() {
      if (
        !musicOnRef.current ||
        !audioRef.current
      ) {
        return;
      }

      audioRef.current.play().catch(() => {});
    }

    window.addEventListener(
      "pointerdown",
      unlockAudio,
      { once: true },
    );

    window.addEventListener(
      "keydown",
      unlockAudio,
      { once: true },
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        unlockAudio,
      );

      window.removeEventListener(
        "keydown",
        unlockAudio,
      );
    };
  }, []);

  return {
    musicOn,
    setMusicOn,
    hasMusic: MUSIC_TRACKS.length > 0,
  };
}