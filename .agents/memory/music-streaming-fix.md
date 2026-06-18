---
name: Music streaming fix
description: Why play-dl stream() was replaced with yt-dlp + ffmpeg for audio playback
---

# Music Streaming Fix

**Why:** play-dl's `stream()` returns "Invalid URL" because YouTube constantly changes their internal cipher/format, breaking third-party streaming libraries. This is an ongoing YouTube-side change, not a fixable code bug in play-dl.

**Fix applied:**
- `tweetnacl` installed — `@discordjs/voice` requires an encryption lib (sodium-native, libsodium-wrappers, or tweetnacl) to encrypt voice data. Without it, voice connections silently fail.
- `yt-dlp` system binary installed — actively maintained, handles YouTube auth/format changes.
- `musicService.js` `playNext()` rewritten: `execFileAsync('yt-dlp', ['--get-url', ...])` resolves the direct audio URL first (async/await), then `spawn('ffmpeg', ['-i', audioUrl, '-f', 's16le', ...])` pipes raw PCM to `createAudioResource` with `inputType: StreamType.Raw, inlineVolume: true`.
- `play-dl` still used for search/metadata only (search + video_info still work fine).

**How to apply:** If music breaks again, first check if yt-dlp needs updating (`yt-dlp -U`). The `--get-url` approach is stable as long as yt-dlp is up to date.

**Why StreamType.Raw:** inlineVolume volume control works perfectly on raw PCM. StreamType.Arbitrary (the original approach) uses @discordjs/voice's internal ffmpeg which can have race conditions with piped streams.
