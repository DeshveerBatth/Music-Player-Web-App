# 🎵 Music Player Web App

A fully functional, responsive music player web application built using **HTML**, **CSS**, and **Vanilla JavaScript**. The app features a clean interface, playlist support, seekbar controls, and live track information.


---

## 🚀 Features

- 🎶 Dynamic playlists loaded from `JSON` files
- ⏯️ Playback controls: Play, Pause, Next, Previous, Repeat
- 📂 Playlist folders with cover art and descriptions
- 📊 Seekbar with real-time position update
- 🕒 Displays current time / total duration
- 🔊 Volume control with interactive icon + slider
- 📱 Responsive UI with support for mobile and desktop
- 📁 Supports multiple song folders (like `ncs`, `lofi`, `punjabi`, etc.)

---

## 🧠 How It Works

- Loads available playlists from `/songs/index.json`
- Renders song folders using their `info.json` (title, description, cover)
- Clicking a playlist dynamically loads its songs and initializes playback
- Playback UI syncs with the current song (seekbar, timer, icons)

---

## ✅ Usage

To run locally:

1. Clone this repo:
   ```bash
   git clone https://github.com/DeshveerBatth/music-player.git

## ✨ Live Demo

https://musicplayer-lilac-pi.vercel.app/
