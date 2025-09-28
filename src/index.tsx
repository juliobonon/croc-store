import React from "react";
import { ServerAPI } from "decky-frontend-lib";
import App from "./components/App";

export default function define(serverApi: ServerAPI) {
  return {
    title: <div className={"CrocStoreTitleContainer"}>Croc Store</div>,
    content: <App serverAPI={serverApi} />,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="20px"
        height="20px"
      >
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        <path d="M8,8V16H10V14H12V12H10V10H12V8H8M14,8V16H16V8H14Z" />
      </svg>
    ),
    onDismount() {
      // Cleanup when plugin is dismissed
      console.log("Croc Store plugin dismissed");
    },
  };
}