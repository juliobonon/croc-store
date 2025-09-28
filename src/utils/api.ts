import { callable } from "@decky/api";
import { ROM, Platform, DownloadProgress, LocalROM, Settings, EmulatorStatus } from "../types";

// Define callable functions that match the Python backend methods
export const searchROMs = callable<[query?: string, platform?: string, limit?: number], ROM[]>("search_roms");
export const getPlatforms = callable<[], Platform[]>("get_platforms");
export const downloadROM = callable<[romId: string, romInfo: ROM], boolean>("download_rom");
export const getDownloadProgress = callable<[romId: string], DownloadProgress | null>("get_download_progress");
export const getAllDownloads = callable<[], {[key: string]: DownloadProgress}>("get_all_downloads");
export const launchROM = callable<[romPath: string, platform?: string], boolean>("launch_rom");
export const getLocalROMs = callable<[], LocalROM[]>("get_local_roms");
export const getSettings = callable<[], Settings>("get_settings");
export const saveSettings = callable<[settings: Settings], boolean>("save_settings");
export const detectEmulators = callable<[], EmulatorStatus>("detect_emulators");

// Helper function to get default settings
export const getDefaultSettings = (): Settings => ({
  auto_organize: true,
  auto_launch: true,
  preferred_emulator: "retroarch",
  download_concurrent_limit: 3,
  regions: ["USA", "Europe", "Japan"],
  languages: ["English"]
});