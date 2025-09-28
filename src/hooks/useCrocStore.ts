import { useState, useEffect, useCallback } from "react";
import { ServerAPI } from "decky-frontend-lib";
import { CrocStoreAPI } from "../utils/api";
import { ROM, Platform, DownloadProgress, LocalROM, Settings, EmulatorStatus } from "../types";

export const useCrocStore = (serverAPI: ServerAPI) => {
  const [api] = useState(() => new CrocStoreAPI(serverAPI));
  
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
      const results = await api.searchROMs(query, platform, limit);
      setSearchResults(results);
      return results;
    } finally {
      setIsSearching(false);
    }
  }, [api]);

  // Load platforms
  const loadPlatforms = useCallback(async () => {
    setIsLoadingPlatforms(true);
    try {
      const platformData = await api.getPlatforms();
      setPlatforms(platformData);
      return platformData;
    } finally {
      setIsLoadingPlatforms(false);
    }
  }, [api]);

  // Download ROM
  const downloadROM = useCallback(async (romId: string, romInfo: ROM) => {
    const success = await api.downloadROM(romId, romInfo);
    if (success) {
      // Start polling for download progress
      pollDownloadProgress(romId);
    }
    return success;
  }, [api]);

  // Poll download progress
  const pollDownloadProgress = useCallback(async (romId: string) => {
    const poll = async () => {
      const progress = await api.getDownloadProgress(romId);
      if (progress) {
        setDownloads(prev => ({
          ...prev,
          [romId]: progress
        }));
        
        // Continue polling if still downloading
        if (progress.status === 'downloading' || progress.status === 'starting') {
          setTimeout(poll, 1000); // Poll every second
        }
      }
    };
    poll();
  }, [api]);

  // Launch ROM
  const launchROM = useCallback(async (romPath: string, platform: string = "") => {
    return await api.launchROM(romPath, platform);
  }, [api]);

  // Load local ROMs
  const loadLocalROMs = useCallback(async () => {
    setIsLoadingLocalROMs(true);
    try {
      const roms = await api.getLocalROMs();
      setLocalROMs(roms);
      return roms;
    } finally {
      setIsLoadingLocalROMs(false);
    }
  }, [api]);

  // Load settings
  const loadSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    try {
      const settingsData = await api.getSettings();
      setSettings(settingsData);
      return settingsData;
    } finally {
      setIsLoadingSettings(false);
    }
  }, [api]);

  // Save settings
  const saveSettings = useCallback(async (newSettings: Settings) => {
    const success = await api.saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
    return success;
  }, [api]);

  // Detect emulators
  const detectEmulators = useCallback(async () => {
    const emulatorStatus = await api.detectEmulators();
    setEmulators(emulatorStatus);
    return emulatorStatus;
  }, [api]);

  // Update all downloads
  const updateAllDownloads = useCallback(async () => {
    const allDownloads = await api.getAllDownloads();
    setDownloads(allDownloads);
    return allDownloads;
  }, [api]);

  // Initialize data on mount
  useEffect(() => {
    loadPlatforms();
    loadSettings();
    detectEmulators();
    updateAllDownloads();
  }, [loadPlatforms, loadSettings, detectEmulators, updateAllDownloads]);

  // Periodic updates for downloads
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if any downloads are active
      const hasActiveDownloads = Object.values(downloads).some(
        download => download.status === 'downloading' || download.status === 'starting'
      );
      
      if (hasActiveDownloads) {
        updateAllDownloads();
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [downloads, updateAllDownloads]);

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
    updateAllDownloads,
    
    // Utilities
    api
  };
};