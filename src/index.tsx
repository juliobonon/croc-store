import {
  definePlugin,
} from "@decky/api";
import { staticClasses } from "@decky/ui";
import { FaGamepad } from "react-icons/fa";
import App from "./components/App";
import { FullSizeStorePage } from "./pages/FullSizeStorePage";
import { useCrocStore } from "./hooks/useCrocStore";

function FullStoreWrapper() {
  const {
    searchResults,
    platforms,
    downloads,
    isSearching,
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
      console.log('Launch failed');
    }
  };

  return (
    <FullSizeStorePage
      searchResults={searchResults}
      platforms={platforms}
      downloads={downloads}
      isSearching={isSearching}
      onSearch={searchROMs}
      onDownload={handleDownload}
      onLaunch={handleLaunch}
    />
  );
}

export default definePlugin(() => {
  console.log("Croc Store plugin initializing...")

  return {
    // The name shown in various decky menus
    name: "Croc Store",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Croc Store</div>,
    // The content of your plugin's menu
    content: <App />,
    // The icon displayed in the plugin list
    icon: <FaGamepad />,
    // Route patches for full-page navigation
    routePatches: [
      {
        path: "/croc-store/full-store",
        component: FullStoreWrapper,
      }
    ],
    // The function triggered when your plugin unloads
    onDismount() {
      console.log("Croc Store plugin dismissed");
    },
  };
});