import { useState, useEffect, useCallback } from "react";
import { 
  searchROMs as apiSearchROMs,
  getPlatforms as apiGetPlatforms, 
  downloadROM as apiDownloadROM,
  getDownloadProgress as apiGetDownloadProgress,
  getAllDownloads as apiGetAllDownloads,
  launchROM as apiLaunchROM,
  getLocalROMs as apiGetLocalROMs,
  getSettings as apiGetSettings,
  saveSettings as apiSaveSettings,
  detectEmulators as apiDetectEmulators,
  getDefaultSettings
} from "../utils/api";
import { ROM, Platform, DownloadProgress, LocalROM, Settings, EmulatorStatus } from "../types";

export const useCrocStore = () => {
  // State
  const [searchResults, setSearchResults] = useState<ROM[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [downloads, setDownloads] = useState<{[key: string]: DownloadProgress}>({});
  const [localROMs, setLocalROMs] = useState<LocalROM[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [emulators, setEmulators] = useState<EmulatorStatus>({});
  
  // Loading states
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);
  const [isLoadingLocalROMs, setIsLoadingLocalROMs] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Search ROMs
  const searchROMs = useCallback(async (query: string = "", platform: string = "", limit: number = 50) => {
    setIsSearching(true);
    try {
      const results = await apiSearchROMs(query, platform, limit);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error("Error searching ROMs:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Load platforms
  const loadPlatforms = useCallback(async () => {
    setIsLoadingPlatforms(true);
    try {
      const platformList = await apiGetPlatforms();
      setPlatforms(platformList);
      return platformList;
    } catch (error) {
      console.error("Error loading platforms:", error);
      return [];
    } finally {
      setIsLoadingPlatforms(false);
    }
  }, []);

  // Download ROM
  const downloadROM = useCallback(async (romId: string, romInfo: ROM) => {
    try {
      const success = await apiDownloadROM(romId, romInfo);
      if (success) {
        // Refresh downloads list
        const updatedDownloads = await apiGetAllDownloads();
        setDownloads(updatedDownloads);
      }
      return success;
    } catch (error) {
      console.error("Error downloading ROM:", error);
      return false;
    }
  }, []);

  // Launch ROM
  const launchROM = useCallback(async (romPath: string, platform: string = "") => {
    try {
      return await apiLaunchROM(romPath, platform);
    } catch (error) {
      console.error("Error launching ROM:", error);
      return false;
    }
  }, []);

  // Load local ROMs
  const loadLocalROMs = useCallback(async () => {
    setIsLoadingLocalROMs(true);
    try {
      const roms = await apiGetLocalROMs();
      setLocalROMs(roms);
      return roms;
    } catch (error) {
      console.error("Error loading local ROMs:", error);
      return [];
    } finally {
      setIsLoadingLocalROMs(false);
    }
  }, []);

  // Load settings
  const loadSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    try {
      const userSettings = await apiGetSettings();
      setSettings(userSettings);
      return userSettings;
    } catch (error) {
      console.error("Error loading settings:", error);
      const defaultSettings = getDefaultSettings();
      setSettings(defaultSettings);
      return defaultSettings;
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Save settings
  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      const success = await apiSaveSettings(newSettings);
      if (success) {
        setSettings(newSettings);
      }
      return success;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  }, []);

  // Detect emulators
  const detectEmulators = useCallback(async () => {
    try {
      const detectedEmulators = await apiDetectEmulators();
      setEmulators(detectedEmulators);
      return detectedEmulators;
    } catch (error) {
      console.error("Error detecting emulators:", error);
      return {};
    }
  }, []);

  // Get download progress
  const getDownloadProgress = useCallback(async (romId: string) => {
    try {
      return await apiGetDownloadProgress(romId);
    } catch (error) {
      console.error("Error getting download progress:", error);
      return null;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadPlatforms();
    loadSettings();
    detectEmulators();
    
    // Load downloads
    apiGetAllDownloads().then(setDownloads).catch(console.error);
  }, [loadPlatforms, loadSettings, detectEmulators]);

  return {
    // Data
    searchResults,
    platforms,
    downloads,
    localROMs,
    settings,
    emulators,
    
    // Loading states
    isSearching,
    isLoadingPlatforms,
    isLoadingLocalROMs,
    isLoadingSettings,
    
    // Actions
    searchROMs,
    downloadROM,
    launchROM,
    loadLocalROMs,
    saveSettings,
    detectEmulators,
    getDownloadProgress,
  };
};