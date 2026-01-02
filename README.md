# 🕹️ Pong Game (Web Version)

🎮 **Play the game live:**  
👉 https://leiwangamy.github.io/Pong-Game/

A modern browser-based **Pong game** built with **HTML**, **CSS**, and **Vanilla JavaScript**.  
Supports **1 Player (vs AI)** and **2 Player** modes, with full **mouse, keyboard, and touch** controls.

Optimized for both **desktop** and **mobile** browsers.

---

## 🎮 Features

- 🧱 Classic Pong mechanics
- 👤 **1 Player mode** (Mouse / Touch vs AI)
- 👥 **2 Player mode** (Keyboard vs Keyboard)
- 📱 Touchscreen support (mobile & tablet)
- 🎵 Background music (starts after user interaction)
- 🏠 Restart returns to **Home Menu** (mode can be re-selected)
- ⚡ Smooth animation with `requestAnimationFrame`
- 🎨 Clean, minimal UI

---

## 🕹️ Controls

### 1 Player Mode
- **Mouse / Touch** → Move **left paddle**
- Right paddle is controlled by AI

### 2 Player Mode
- **Player 1 (Left paddle)** → `W` / `S`
- **Player 2 (Right paddle)** → `↑` / `↓`

### Global
- **R** → Return to Home Menu (restart & reselect mode)

---

## 🚀 How to Play

1. Open the game in your browser
2. Choose **1 Player** or **2 Players** from the menu
3. First player to reach **5 points** wins
4. Press **R** anytime to return to the menu

---

## 🧪 Run Locally

### Option 1: Open directly
Simply double-click `index.html` in your browser.

### Option 2 (Recommended): VS Code Live Server
1. Install **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 3: Local HTTP server (Python)
```bash
python -m http.server 8000
