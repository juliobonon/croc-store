import { useState } from "react";
import { Tabs } from "@decky/ui";
import { useCrocStore } from "../hooks/useCrocStore";
import { FullSizeStorePage } from "./FullSizeStorePage";

export function StoreRouter() {
  const [currentTab, setCurrentTab] = useState("store");
  
  const {
    // Data
    searchResults,
    platforms,
    downloads,
    
    // Loading states
    isSearching,
    
    // Actions
    searchROMs,
    downloadROM,
    launchROM,
  } = useCrocStore();

  const handleDownload = async (rom: any) => {
    const success = await downloadROM(rom.id, rom);
    if (success) {
      console.log(`Started downloading ${rom.name}`);
    }
  };

  const handleLaunch = async (romPath: string, platform: string) => {
    const success = await launchROM(romPath, platform);
    if (!success) {
      console.error("Failed to launch ROM");
    }
  };

  return (
    <div
      style={{
        height: "100%",
        background: "#0e141b",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Tabs
        activeTab={currentTab}
        onShowTab={(tabID: string) => {
          setCurrentTab(tabID);
        }}
        tabs={[
          {
            title: "ROM Store",
            content: (
              <FullSizeStorePage
                searchResults={searchResults}
                platforms={platforms}
                downloads={downloads}
                isSearching={isSearching}
                onSearch={searchROMs}
                onDownload={handleDownload}
                onLaunch={handleLaunch}
              />
            ),
            id: "store",
          },
        ]}
      />
    </div>
  );
}