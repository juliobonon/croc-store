import React, { useState } from "react";
import {
  Tabs,
  showModal,
  ConfirmModal,
  ButtonItem,
} from "@decky/ui";
import { useCrocStore } from "../hooks/useCrocStore";
import { SearchView } from "./SearchView";
import { DownloadsView } from "./DownloadsView";
import { LocalROMsView } from "./LocalROMs";
import { SettingsView } from "./SettingsView";
import { StoreRouter } from "../pages/StoreRouter";
import { ROM } from "../types";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("store");
  const [showFullStore, setShowFullStore] = useState(false);
  
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
    isLoadingLocalROMs,
    isLoadingSettings,
    
    // Actions
    searchROMs,
    downloadROM,
    launchROM,
    loadLocalROMs,
    saveSettings,
    detectEmulators,
  } = useCrocStore();

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

  const handleOpenFullStore = () => {
    setShowFullStore(true);
  };

  const handleCloseFullStore = () => {
    setShowFullStore(false);
  };

  const tabs = [
    {
      title: "Store",
      content: (
        <div>
          <ButtonItem
            layout="below"
            onClick={handleOpenFullStore}
          >
            Open Full Store
          </ButtonItem>
          <SearchView
            searchResults={searchResults}
            platforms={platforms}
            downloads={downloads}
            isSearching={isSearching}
            onSearch={searchROMs}
            onDownload={handleDownload}
            onLaunch={handleLaunch}
          />
        </div>
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
    <>
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
      
      {/* Full Store Overlay */}
      {showFullStore && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#0e141b",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header with close button */}
          <div style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h2 style={{ 
              margin: 0, 
              color: "#fff", 
              fontSize: "18px" 
            }}>
              Croc Store - Full Size
            </h2>
            
            <ButtonItem onClick={handleCloseFullStore}>
              ✕ Close
            </ButtonItem>
          </div>
          
          {/* Store content */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <StoreRouter />
          </div>
        </div>
      )}
    </>
  );
};

export default App;