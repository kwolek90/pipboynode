# Pipboy 3000 Terminal

A faithful recreation of the iconic Pipboy interface from the Fallout game series, built as a Node.js web application.

![Pipboy Screenshot](https://via.placeholder.com/800x600/000000/00ff00?text=PIPBOY+3000+TERMINAL)

## 🎮 Features

- **Authentic Pipboy Interface** - Classic green-on-black CRT terminal aesthetic
- **5 Functional Tabs:**
  - **STAT** - View your SPECIAL attributes and character stats
  - **INV** - Manage your inventory with authentic Fallout items
  - **DATA** - Browse mission logs and discovered locations
  - **MAP** - View local area with animated location markers
  - **RADIO** - Tune into various wasteland radio stations

- **Interactive Elements:**
  - Real-time clock display
  - Clickable inventory items with visual feedback
  - Radio station switching with static effects
  - Animated progress bars and glowing text

- **Atmospheric Effects:**
  - Continuous CRT scan line animation
  - Mouse cursor glow effects
  - Click feedback flashes
  - Console startup messages
  - Random data updates (radiation levels, hostiles)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Production

To run in production mode:
```bash
npm start
```

## ⌨️ Keyboard Shortcuts

- **1-5** - Switch between tabs (STAT, INV, DATA, MAP, RADIO)
- **Arrow Keys** - Change radio stations (when on RADIO tab)
- **Spacebar** - Play/Pause radio (when on RADIO tab)

## 📂 Project Structure

```
pipboynode/
├── public/
│   ├── index.html          # Main Pipboy interface
│   └── js/
│       └── pipboy.js       # Client-side JavaScript
├── server.js               # Express server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Fonts:** Google Fonts (Courier Prime)
- **Styling:** Custom CSS with CRT effects and animations

## 🎨 Design Features

- **CRT Monitor Effect** - Realistic terminal appearance with scan lines
- **Green Phosphor Display** - Authentic monospace terminal colors
- **Animated Elements** - Progress bars, glowing text, and pulsing markers
- **Responsive Layout** - Works on desktop and tablet devices
- **Fallout Theming** - Authentic Vault-Tec branding and terminology

## 📡 API Endpoints

The server includes a sample API endpoint for future expansion:

- `GET /api/status` - Returns current system status and random data

## 🔧 Customization

### Adding New Radio Stations
Edit the `stations` array in `public/js/pipboy.js`:

```javascript
const stations = [
    { freq: '105.7', name: 'DIAMOND CITY RADIO', song: 'Atom Bomb Baby' },
    // Add your stations here
];
```

### Modifying Character Stats
Update the SPECIAL attributes in the HTML file or make them dynamic via JavaScript.

### Styling Changes
All styles are contained in the main HTML file's `<style>` section for easy modification.

## 🎯 Future Enhancements

- [ ] Save/Load character profiles
- [ ] Real audio playback for radio stations
- [ ] More interactive inventory management
- [ ] Dynamic quest system
- [ ] Multiplayer integration
- [ ] Mobile responsiveness improvements

## 📜 License

This project is open source and available under the ISC License.

## 🙏 Credits

Inspired by the Pipboy interface from the Fallout series by Bethesda Game Studios.
Created as a tribute to the iconic post-apocalyptic franchise.

---

**Vault-Tec Industries © 2077** - "Building a Better Future, Underground"
