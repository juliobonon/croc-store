import React, { useState } from "react";
import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  Tabs,
  gamepadDialogClasses,
  showModal,
  ConfirmModal,
} from "decky-frontend-lib";
import { ServerAPI } from "decky-frontend-lib";
import { useCrocStore } from "../hooks/useCrocStore";
import { SearchView } from "./SearchView";
import { DownloadsView } from "./DownloadsView";
import { LocalROMsView } from "./LocalROMs";
import { SettingsView } from "./SettingsView";
import { ROM } from "../types";

interface AppProps {
  serverAPI: ServerAPI;
}

export const App: React.FC<AppProps> = ({ serverAPI }) => {
  const [activeTab, setActiveTab] = useState("store");
  
  const {
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
  } = useCrocStore(serverAPI);

  const handleDownload = async (rom: ROM) => {
    // Show confirmation modal
    showModal(
      <ConfirmModal
        strTitle="Download ROM"
        strDescription={`Do you want to download "${rom.name}" for ${rom.platform}?`}
        strOKButtonText="Download"
        strCancelButtonText="Cancel"
        onOK={async () => {
          const success = await downloadROM(rom.id, rom);
          if (success) {
            // Optional: Show success notification
            console.log(`Started downloading ${rom.name}`);
          }
        }}
        onCancel={() => {}}
      />
    );
  };

  const handleLaunch = async (romPath: string, platform: string) => {
    const success = await launchROM(romPath, platform);
    if (!success) {
      showModal(
        <ConfirmModal
          strTitle="Launch Failed"
          strDescription="Failed to launch the ROM. Make sure you have the appropriate emulator installed."
          strOKButtonText="OK"
          onOK={() => {}}
        />
      );
    }
  };

  const tabs = [
    {
      title: "Store",
      content: (
        <SearchView
          searchResults={searchResults}
          platforms={platforms}
          downloads={downloads}
          isSearching={isSearching}
          onSearch={searchROMs}
          onDownload={handleDownload}
          onLaunch={handleLaunch}
        />
      ),
      id: "store"
    },
    {
      title: "Downloads",
      content: (
        <DownloadsView
          downloads={downloads}
          onLaunch={handleLaunch}
        />
      ),
      id: "downloads"
    },
    {
      title: "My ROMs",
      content: (
        <LocalROMsView
          localROMs={localROMs}
          onLoadLocalROMs={loadLocalROMs}
          onLaunch={handleLaunch}
          isLoading={isLoadingLocalROMs}
        />
      ),
      id: "local"
    },
    {
      title: "Settings",
      content: (
        <SettingsView
          settings={settings}
          emulators={emulators}
          onSaveSettings={saveSettings}
          onDetectEmulators={detectEmulators}
          isLoading={isLoadingSettings}
        />
      ),
      id: "settings"
    }
  ];

  return (
    <div style={{ 
      height: "100%", 
      background: "var(--background)",
      color: "var(--foreground)"
    }}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onShowTab={setActiveTab}
      />
    </div>
  );
};

export default App;