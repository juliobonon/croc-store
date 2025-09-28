import {
  definePlugin
} from "@decky/api";
import { staticClasses } from "@decky/ui";
import { FaGamepad } from "react-icons/fa";
import App from "./components/App";

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
    // The function triggered when your plugin unloads
    onDismount() {
      console.log("Croc Store plugin dismissed");
    },
  };
});