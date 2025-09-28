# Croc Store - Steam Deck ROM Store Plugin

A comprehensive ROM store and management system for Steam Deck using Decky Loader. Browse, download, and organize ROMs with seamless emulator integration.

## Features

### 🎮 ROM Store
- **Browse & Search**: Discover ROMs from CrocDB API with advanced filtering
- **Platform Support**: Support for NES, SNES, GBA, N64, PlayStation, Genesis, and more
- **Smart Filters**: Filter by platform, region, and language preferences
- **ROM Details**: View ROM information, screenshots, and descriptions

### 📥 Download Management
- **Progress Tracking**: Real-time download progress with detailed status
- **Concurrent Downloads**: Configure multiple simultaneous downloads
- **Auto-Organization**: Automatically organize ROMs by platform in `/home/deck/ROMs/`
- **Resume Support**: Handle interrupted downloads gracefully

### 🚀 Emulator Integration
- **Auto-Launch**: Launch ROMs directly after download
- **Multi-Emulator Support**: RetroArch, EmuDeck, and system default integration
- **Core Detection**: Automatic core selection based on ROM platform
- **Emulator Detection**: Automatic detection of installed emulators

### 📱 Steam Deck Optimized
- **Touch Interface**: Optimized for Steam Deck's touch screen
- **Quick Access Menu**: Integrated into Steam's Quick Access Menu
- **Gamepad Navigation**: Full controller support with proper focus management
- **Performance Optimized**: Efficient rendering and memory usage

### ⚙️ Advanced Settings
- **Customizable Preferences**: Configure download limits, auto-launch, organization
- **Region/Language Filters**: Set preferred content regions and languages
- **Emulator Selection**: Choose preferred emulator for different platforms
- **Storage Management**: Monitor ROM collection size and organization

## Installation

### Requirements
- Steam Deck (or compatible Linux system)
- [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed
- Internet connection for ROM downloading

### Install from Decky Store
1. Open Decky Loader in Quick Access Menu
2. Navigate to the Decky Store
3. Search for "Croc Store"
4. Click Install

### Manual Installation
1. Download the latest release from GitHub
2. Extract to `~/homebrew/plugins/croc-store/`
3. Restart Steam or reload Decky plugins

## Usage

### First Setup
1. Open Quick Access Menu (... button)
2. Navigate to Croc Store plugin
3. Go to Settings tab and configure preferences
4. The plugin will auto-detect installed emulators

### Downloading ROMs
1. Use the Store tab to search for ROMs
2. Filter by platform or search by name
3. Click Download on desired ROMs
4. Monitor progress in Downloads tab
5. ROMs auto-organize to `/home/deck/ROMs/[Platform]/`

### Playing ROMs
1. Downloaded ROMs appear in Downloads tab with Play button
2. Local ROMs are visible in My ROMs tab
3. Click Play to launch with preferred emulator
4. ROMs launch automatically if auto-launch is enabled

### Managing Your Collection
- **My ROMs Tab**: View all locally stored ROMs
- **Organization**: ROMs organized by platform folders
- **Statistics**: View collection size and platform distribution
- **Search & Filter**: Find ROMs in your local collection

## Directory Structure

```
/home/deck/
├── ROMs/                          # ROM storage (auto-organized)
│   ├── NES/                       # Nintendo Entertainment System
│   ├── SNES/                      # Super Nintendo
│   ├── GBA/                       # Game Boy Advance
│   ├── N64/                       # Nintendo 64
│   ├── PSX/                       # PlayStation
│   └── Genesis/                   # Sega Genesis
├── Downloads/CrocStore/           # Temporary download location
└── .config/croc-store/            # Plugin settings and cache
    └── settings.json              # User preferences
```

## Configuration

### Settings Options
- **Auto-organize ROMs**: Automatically sort ROMs by platform
- **Auto-launch**: Launch ROMs immediately after download
- **Preferred Emulator**: Choose default emulator (RetroArch/EmuDeck)
- **Concurrent Downloads**: Set max simultaneous downloads (1-10)
- **Region Preferences**: Filter ROMs by region (USA/Europe/Japan)
- **Language Preferences**: Filter ROMs by language

### Emulator Configuration
The plugin automatically detects and integrates with:
- **RetroArch**: Full core support with automatic selection
- **EmuDeck**: Complete EmuDeck integration
- **System Default**: Fallback to system file associations

## Development

### Building from Source
```bash
# Install dependencies
npm install

# Build for development
npm run build

# Watch for changes
npm run watch
```

### Plugin Structure
```
croc-store/
├── main.py                    # Python backend
├── plugin.json               # Plugin manifest
├── package.json              # Frontend dependencies
├── src/                      # TypeScript/React frontend
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # API and utility functions
└── assets/                  # Plugin assets
```

### API Integration
The plugin uses a modular API system for ROM database integration:
- Mock data for development and testing
- Extensible for real CrocDB API integration
- Caching for offline functionality
- Error handling and retry logic

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-2.0-or-later License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This plugin is for educational and personal use only. Users are responsible for ensuring they have legal rights to any ROMs they download. The plugin developers do not provide or endorse any copyrighted content.

## Support

- **Issues**: [GitHub Issues](https://github.com/juliobonon/croc-store/issues)
- **Discussions**: [GitHub Discussions](https://github.com/juliobonon/croc-store/discussions)
- **Steam Deck Community**: [r/SteamDeck](https://reddit.com/r/SteamDeck)

## Acknowledgments

- [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) - Plugin framework
- [Steam Deck Homebrew](https://github.com/SteamDeckHomebrew) - Community and tools
- CrocDB - ROM database API
- RetroArch & EmuDeck - Emulation platforms