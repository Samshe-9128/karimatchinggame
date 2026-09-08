# Kari Memory Road v5

A clean React + JSX + Vite release built from the original visual UI.

## Key behavior
- No welcome screen: opens directly on the path.
- Original warm garden UI is preserved.
- 5,000 levels across 11 chapters.
- Existing local progress is migrated from older `bloom-path` and `kari-memory-*` keys.
- The release continues writing legacy keys so an update on the same domain does not wipe old users.
- Settings modal works without Radix.
- Companion is local-only; no Grok/API dependency.
- Audio uses Web Audio with best-effort page-load start plus first-interaction unlock for browser autoplay restrictions.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
