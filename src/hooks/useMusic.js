import { useEffect, useRef, useState } from "react";

import { readStorage, writeStorage } from "../utils/storage";

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
    return readStorage("kari-memory-music", "on") !== "off";
  });

  const audioRef = useRef(null);
  const musicOnRef = useRef(musicOn);
  const currentTrackRef = useRef(null);
  const startedRef = useRef(false);

  /* -----------------------------------------
     Save preference
  ----------------------------------------- */

  useEffect(() => {
    musicOnRef.current = musicOn;

    writeStorage("kari-memory-music", musicOn ? "on" : "off");
  }, [musicOn]);

  /* -----------------------------------------
     Create audio
  ----------------------------------------- */

  useEffect(() => {
    if (!MUSIC_TRACKS.length) {
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
        (track) => track !== currentTrackRef.current,
      );

      return (
        available[Math.floor(Math.random() * available.length)] ??
        MUSIC_TRACKS[0]
      );
    }

    function playNextTrack() {
      const nextTrack = chooseTrack();

      currentTrackRef.current = nextTrack;

      audio.src = nextTrack;

      if (musicOnRef.current) {
        audio
          .play()
          .then(() => {
            startedRef.current = true;
          })
          .catch(() => {
            // Autoplay blocked.
          });
      }
    }

    function handleEnded() {
      playNextTrack();
    }

    audio.addEventListener("ended", handleEnded);

    /*
     * Try immediately on page load.
     * Desktop Chrome may allow it.
     */
    playNextTrack();

    return () => {
      audio.removeEventListener("ended", handleEnded);

      audio.pause();
      audio.src = "";
      audio.load();

      audioRef.current = null;
      currentTrackRef.current = null;
      startedRef.current = false;
    };
  }, []);

  /* -----------------------------------------
     START MUSIC DIRECTLY FROM USER ACTION
  ----------------------------------------- */

  function startMusic() {
    const audio = audioRef.current;

    if (!audio || !musicOnRef.current) {
      return;
    }

    audio
      .play()
      .then(() => {
        startedRef.current = true;
      })
      .catch(() => {
        // Browser still refused playback.
      });
  }

  /* -----------------------------------------
     ON / OFF
  ----------------------------------------- */

  function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (musicOnRef.current) {
      audio.pause();

      musicOnRef.current = false;
      setMusicOn(false);

      return;
    }

    musicOnRef.current = true;

    audio
      .play()
      .then(() => {
        startedRef.current = true;
        setMusicOn(true);
      })
      .catch(() => {
        musicOnRef.current = false;
        setMusicOn(false);
      });
  }

  return {
    musicOn,
    setMusicOn,
    toggleMusic,
    startMusic,
    hasMusic: MUSIC_TRACKS.length > 0,
  };
}
