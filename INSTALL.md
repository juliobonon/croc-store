# Installation Guide

## Prerequisites

1. **Steam Deck** (or compatible Linux system)
2. **Decky Loader** installed and running
3. Internet connection for downloading ROMs
4. At least 1GB free space for ROM storage

## Installation Methods

### Method 1: From Decky Store (Recommended)
1. Open Steam Quick Access Menu (... button)
2. Navigate to Decky Loader section
3. Open Decky Store
4. Search for "Croc Store"
5. Click Install
6. Restart Steam or reload plugins

### Method 2: Manual Installation
1. Download the latest release from GitHub
2. Extract files to `~/homebrew/plugins/croc-store/`
3. Restart Steam or reload Decky plugins

### Method 3: Development Installation
```bash
# Clone repository
git clone https://github.com/juliobonon/croc-store.git
cd croc-store

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Copy to Decky plugins directory
cp -r . ~/homebrew/plugins/croc-store/

# Restart Steam or reload plugins
```

## First Setup

1. Open Quick Access Menu
2. Find "Croc Store" in the plugins section
3. Go to Settings tab
4. Configure your preferences:
   - Set preferred emulator (RetroArch/EmuDeck)
   - Choose regions and languages
   - Set download concurrency
5. The plugin will automatically detect installed emulators

## Directory Structure

The plugin creates these directories automatically:
- `/home/deck/ROMs/` - ROM storage (organized by platform)
- `/home/deck/Downloads/CrocStore/` - Temporary downloads
- `/home/deck/.config/croc-store/` - Settings and cache

## Troubleshooting

### Plugin Not Loading
- Ensure Decky Loader is running
- Check Steam Deck is in Desktop Mode for initial setup
- Restart Steam completely
- Check plugin logs in Decky Loader

### Downloads Not Working
- Check internet connection
- Verify available disk space
- Check permissions on ROMs directory
- Review error messages in Downloads tab

### Emulator Integration Issues
- Ensure RetroArch or EmuDeck is properly installed
- Update emulator paths in Settings
- Try launching ROMs manually first
- Check core availability for specific platforms

### Performance Issues
- Reduce concurrent download limit
- Clear cache in Settings
- Ensure sufficient RAM available
- Close other Steam Deck applications

## Uninstallation

1. Open Decky Loader
2. Find Croc Store in installed plugins
3. Click Uninstall
4. Optionally remove ROM directories if desired

## Support

- Issues: [GitHub Issues](https://github.com/juliobonon/croc-store/issues)
- Discussions: [GitHub Discussions](https://github.com/juliobonon/croc-store/discussions)
- Steam Deck Community: r/SteamDeck