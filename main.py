import asyncio
import aiohttp
import os
import json
from typing import Dict, List, Any, Optional
import zipfile
import subprocess
from pathlib import Path

# The decky plugin module is located at decky-loader/plugin
import decky

class Plugin:
    def __init__(self):
        self.session = None
        self.base_url = "https://api.crocdb.net"  # Placeholder - need actual CrocDB API endpoint
        self.roms_path = Path(decky.DECKY_USER_HOME) / "ROMs"
        self.downloads_path = Path(decky.DECKY_USER_HOME) / "Downloads" / "CrocStore"
        self.settings_path = Path(decky.DECKY_SETTINGS_DIR)
        
        # Ensure directories exist
        self.roms_path.mkdir(parents=True, exist_ok=True)
        self.downloads_path.mkdir(parents=True, exist_ok=True)
        self.settings_path.mkdir(parents=True, exist_ok=True)
        
        # Download progress tracking
        self.download_progress = {}
        
        # Emulator paths
        self.emulator_paths = {
            "retroarch": "/usr/bin/retroarch",
            "emudeck": "/home/deck/.local/share/Steam/steamapps/common/EmuDeck"
        }
    
    async def _get_session(self):
        """Get or create aiohttp session"""
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def close(self):
        """Clean up resources"""
        if self.session:
            await self.session.close()

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky.decky.logger.info("Croc Store plugin initializing...")

    # Function called first during the unload process
    async def _unload(self):
        decky.decky.logger.info("Croc Store plugin unloading...")
        await self.close()

    # Function called after `_unload` during uninstall
    async def _uninstall(self):
        decky.decky.logger.info("Croc Store plugin uninstalling...")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky.decky.logger.info("Croc Store plugin migrating...")
        # Migrate old settings and data if needed
        decky.migrate_settings(
            os.path.join("/home/deck/.config", "croc-store"),
        )
        decky.migrate_runtime(
            os.path.join("/home/deck/Downloads", "CrocStore"),
        )
    
    # Settings Management
    async def get_settings(self) -> Dict[str, Any]:
        """Get user settings"""
        settings_file = self.settings_path / "settings.json"
        default_settings = {
            "auto_organize": True,
            "auto_launch": True,
            "preferred_emulator": "retroarch",
            "download_concurrent_limit": 3,
            "regions": ["USA", "Europe", "Japan"],
            "languages": ["English"]
        }
        
        try:
            if settings_file.exists():
                with open(settings_file, 'r') as f:
                    settings = json.load(f)
                # Merge with defaults to handle new settings
                return {**default_settings, **settings}
            else:
                await self.save_settings(default_settings)
                return default_settings
        except Exception as e:
            decky.logger.error(f"Error loading settings: {e}")
            return default_settings
    
    async def save_settings(self, settings: Dict[str, Any]) -> bool:
        """Save user settings"""
        try:
            settings_file = self.settings_path / "settings.json"
            with open(settings_file, 'w') as f:
                json.dump(settings, f, indent=2)
            return True
        except Exception as e:
            decky.logger.error(f"Error saving settings: {e}")
            return False
    
    # ROM Search and Browse
    async def search_roms(self, query: str, platform: str = "", limit: int = 50) -> List[Dict[str, Any]]:
        """Search for ROMs using CrocDB API"""
        try:
            session = await self._get_session()
            
            # Build search parameters
            params = {
                "q": query,
                "limit": limit
            }
            if platform:
                params["platform"] = platform
            
            # For now, return mock data until we have the actual CrocDB API
            # TODO: Replace with actual API call
            mock_roms = [
                {
                    "id": f"rom_{i}",
                    "name": f"Super Mario Bros {i}",
                    "platform": "NES",
                    "region": "USA",
                    "language": "English",
                    "size": "32KB",
                    "description": f"Classic platformer game {i}",
                    "download_url": f"https://example.com/roms/smb{i}.zip",
                    "image_url": f"https://example.com/images/smb{i}.png"
                }
                for i in range(1, min(limit + 1, 6))
                if query.lower() in f"super mario bros {i}".lower()
            ]
            
            return mock_roms
            
        except Exception as e:
            decky.logger.error(f"Error searching ROMs: {e}")
            return []
    
    async def get_platforms(self) -> List[Dict[str, Any]]:
        """Get available platforms"""
        # Mock data for now
        return [
            {"id": "nes", "name": "Nintendo Entertainment System", "short_name": "NES"},
            {"id": "snes", "name": "Super Nintendo Entertainment System", "short_name": "SNES"},
            {"id": "gba", "name": "Game Boy Advance", "short_name": "GBA"},
            {"id": "n64", "name": "Nintendo 64", "short_name": "N64"},
            {"id": "psx", "name": "PlayStation", "short_name": "PSX"},
            {"id": "genesis", "name": "Sega Genesis", "short_name": "Genesis"}
        ]
    
    # Download Management
    async def download_rom(self, rom_id: str, rom_info: Dict[str, Any]) -> bool:
        """Download a ROM with progress tracking"""
        try:
            session = await self._get_session()
            
            # Initialize progress tracking
            self.download_progress[rom_id] = {
                "status": "starting",
                "progress": 0,
                "total_size": 0,
                "downloaded_size": 0,
                "filename": rom_info.get("name", "unknown")
            }
            
            # Create platform-specific directory
            platform_dir = self.roms_path / rom_info.get("platform", "Unknown")
            platform_dir.mkdir(exist_ok=True)
            
            # Determine file extension and path
            filename = f"{rom_info.get('name', rom_id)}.zip"
            download_path = self.downloads_path / filename
            final_path = platform_dir / filename
            
            # Mock download for now (replace with actual download)
            await asyncio.sleep(0.1)  # Simulate download start delay
            
            self.download_progress[rom_id]["status"] = "downloading"
            
            # Simulate download progress
            total_size = 1024 * 1024  # 1MB mock size
            self.download_progress[rom_id]["total_size"] = total_size
            
            for i in range(11):  # 0% to 100% in 10% increments
                await asyncio.sleep(0.2)  # Simulate download time
                downloaded = int(total_size * (i / 10))
                self.download_progress[rom_id]["downloaded_size"] = downloaded
                self.download_progress[rom_id]["progress"] = i * 10
            
            # Create a dummy file for now
            with open(download_path, 'w') as f:
                f.write(f"Mock ROM file for {rom_info.get('name', rom_id)}")
            
            # Move to final location if auto-organize is enabled
            settings = await self.get_settings()
            if settings.get("auto_organize", True):
                download_path.rename(final_path)
                self.download_progress[rom_id]["final_path"] = str(final_path)
            else:
                self.download_progress[rom_id]["final_path"] = str(download_path)
            
            self.download_progress[rom_id]["status"] = "completed"
            self.download_progress[rom_id]["progress"] = 100
            
            return True
            
        except Exception as e:
            decky.logger.error(f"Error downloading ROM {rom_id}: {e}")
            if rom_id in self.download_progress:
                self.download_progress[rom_id]["status"] = "error"
                self.download_progress[rom_id]["error"] = str(e)
            return False
    
    async def get_download_progress(self, rom_id: str) -> Dict[str, Any]:
        """Get download progress for a ROM"""
        return self.download_progress.get(rom_id, {})
    
    async def get_all_downloads(self) -> Dict[str, Dict[str, Any]]:
        """Get all download progress"""
        return self.download_progress
    
    # Emulator Integration
    async def detect_emulators(self) -> Dict[str, bool]:
        """Detect available emulators"""
        emulators = {}
        
        for name, path in self.emulator_paths.items():
            if isinstance(path, str):
                emulators[name] = os.path.exists(path)
            else:
                # Check if any of the paths exist
                emulators[name] = any(os.path.exists(p) for p in path)
        
        return emulators
    
    async def launch_rom(self, rom_path: str, platform: str = "") -> bool:
        """Launch ROM with appropriate emulator"""
        try:
            settings = await self.get_settings()
            preferred_emulator = settings.get("preferred_emulator", "retroarch")
            
            # Check if ROM file exists
            if not os.path.exists(rom_path):
                decky.logger.error(f"ROM file not found: {rom_path}")
                return False
            
            # Try to launch with preferred emulator
            if preferred_emulator == "retroarch" and os.path.exists(self.emulator_paths["retroarch"]):
                # Launch with RetroArch
                # Core selection based on platform would be implemented here
                core_map = {
                    "NES": "nestopia_libretro.so",
                    "SNES": "snes9x_libretro.so",
                    "GBA": "mgba_libretro.so",
                    "N64": "mupen64plus_next_libretro.so",
                    "PSX": "swanstation_libretro.so",
                    "Genesis": "genesis_plus_gx_libretro.so"
                }
                
                core = core_map.get(platform, "")
                if core:
                    cmd = [self.emulator_paths["retroarch"], "-L", f"/usr/lib/libretro/{core}", rom_path]
                else:
                    cmd = [self.emulator_paths["retroarch"], rom_path]
                
                # Launch in background
                subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                return True
            
            # Fallback to system default
            subprocess.Popen(["xdg-open", rom_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
            
        except Exception as e:
            decky.logger.error(f"Error launching ROM {rom_path}: {e}")
            return False
    
    # Local ROM Management
    async def get_local_roms(self) -> List[Dict[str, Any]]:
        """Get list of locally stored ROMs"""
        roms = []
        
        try:
            for platform_dir in self.roms_path.iterdir():
                if platform_dir.is_dir():
                    platform_name = platform_dir.name
                    
                    for rom_file in platform_dir.iterdir():
                        if rom_file.is_file() and rom_file.suffix.lower() in ['.zip', '.nes', '.smc', '.gba', '.n64', '.iso', '.bin', '.md']:
                            rom_info = {
                                "name": rom_file.stem,
                                "platform": platform_name,
                                "path": str(rom_file),
                                "size": rom_file.stat().st_size,
                                "modified": rom_file.stat().st_mtime
                            }
                            roms.append(rom_info)
            
        except Exception as e:
            decky.logger.error(f"Error getting local ROMs: {e}")
        
        return roms