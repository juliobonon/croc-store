import { ServerAPI } from "decky-frontend-lib";
import { ROM, Platform, DownloadProgress, LocalROM, Settings, EmulatorStatus } from "../types";

export class CrocStoreAPI {
  private serverAPI: ServerAPI;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  async searchROMs(query: string = "", platform: string = "", limit: number = 50): Promise<ROM[]> {
    try {
      const result = await this.serverAPI.callPluginMethod("search_roms", {
        query,
        platform,
        limit
      });
      
      if (result.success) {
        return result.result as ROM[];
      } else {
        console.error("Error searching ROMs:", result.result);
        return [];
      }
    } catch (error) {
      console.error("API Error - searchROMs:", error);
      return [];
    }
  }

  async getPlatforms(): Promise<Platform[]> {
    try {
      const result = await this.serverAPI.callPluginMethod("get_platforms", {});
      
      if (result.success) {
        return result.result as Platform[];
      } else {
        console.error("Error getting platforms:", result.result);
        return [];
      }
    } catch (error) {
      console.error("API Error - getPlatforms:", error);
      return [];
    }
  }

  async downloadROM(romId: string, romInfo: ROM): Promise<boolean> {
    try {
      const result = await this.serverAPI.callPluginMethod("download_rom", {
        rom_id: romId,
        rom_info: romInfo
      });
      
      if (result.success) {
        return result.result as boolean;
      } else {
        console.error("Error downloading ROM:", result.result);
        return false;
      }
    } catch (error) {
      console.error("API Error - downloadROM:", error);
      return false;
    }
  }

  async getDownloadProgress(romId: string): Promise<DownloadProgress | null> {
    try {
      const result = await this.serverAPI.callPluginMethod("get_download_progress", {
        rom_id: romId
      });
      
      if (result.success) {
        return result.result as DownloadProgress;
      } else {
        console.error("Error getting download progress:", result.result);
        return null;
      }
    } catch (error) {
      console.error("API Error - getDownloadProgress:", error);
      return null;
    }
  }

  async getAllDownloads(): Promise<{[key: string]: DownloadProgress}> {
    try {
      const result = await this.serverAPI.callPluginMethod("get_all_downloads", {});
      
      if (result.success) {
        return result.result as {[key: string]: DownloadProgress};
      } else {
        console.error("Error getting all downloads:", result.result);
        return {};
      }
    } catch (error) {
      console.error("API Error - getAllDownloads:", error);
      return {};
    }
  }

  async launchROM(romPath: string, platform: string = ""): Promise<boolean> {
    try {
      const result = await this.serverAPI.callPluginMethod("launch_rom", {
        rom_path: romPath,
        platform
      });
      
      if (result.success) {
        return result.result as boolean;
      } else {
        console.error("Error launching ROM:", result.result);
        return false;
      }
    } catch (error) {
      console.error("API Error - launchROM:", error);
      return false;
    }
  }

  async getLocalROMs(): Promise<LocalROM[]> {
    try {
      const result = await this.serverAPI.callPluginMethod("get_local_roms", {});
      
      if (result.success) {
        return result.result as LocalROM[];
      } else {
        console.error("Error getting local ROMs:", result.result);
        return [];
      }
    } catch (error) {
      console.error("API Error - getLocalROMs:", error);
      return [];
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const result = await this.serverAPI.callPluginMethod("get_settings", {});
      
      if (result.success) {
        return result.result as Settings;
      } else {
        console.error("Error getting settings:", result.result);
        return this.getDefaultSettings();
      }
    } catch (error) {
      console.error("API Error - getSettings:", error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings: Settings): Promise<boolean> {
    try {
      const result = await this.serverAPI.callPluginMethod("save_settings", {
        settings
      });
      
      if (result.success) {
        return result.result as boolean;
      } else {
        console.error("Error saving settings:", result.result);
        return false;
      }
    } catch (error) {
      console.error("API Error - saveSettings:", error);
      return false;
    }
  }

  async detectEmulators(): Promise<EmulatorStatus> {
    try {
      const result = await this.serverAPI.callPluginMethod("detect_emulators", {});
      
      if (result.success) {
        return result.result as EmulatorStatus;
      } else {
        console.error("Error detecting emulators:", result.result);
        return {};
      }
    } catch (error) {
      console.error("API Error - detectEmulators:", error);
      return {};
    }
  }

  private getDefaultSettings(): Settings {
    return {
      auto_organize: true,
      auto_launch: true,
      preferred_emulator: "retroarch",
      download_concurrent_limit: 3,
      regions: ["USA", "Europe", "Japan"],
      languages: ["English"]
    };
  }
}