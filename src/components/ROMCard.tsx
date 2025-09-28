import React from "react";
import {
  Focusable,
  ButtonItem,
} from "@decky/ui";
import { ROM, DownloadProgress } from "../types";

interface ROMCardProps {
  rom: ROM;
  onDownload: (rom: ROM) => void;
  onLaunch?: (romPath: string, platform: string) => void;
  downloadProgress?: DownloadProgress;
  isLocal?: boolean;
  localPath?: string;
}

export const ROMCard: React.FC<ROMCardProps> = ({
  rom,
  onDownload,
  onLaunch,
  downloadProgress,
  isLocal = false,
  localPath
}) => {
  const isDownloading = downloadProgress?.status === 'downloading' || downloadProgress?.status === 'starting';
  const isCompleted = downloadProgress?.status === 'completed';
  const hasError = downloadProgress?.status === 'error';

  const handleAction = () => {
    if (isLocal && localPath && onLaunch) {
      onLaunch(localPath, rom.platform);
    } else if (isCompleted && downloadProgress?.final_path && onLaunch) {
      onLaunch(downloadProgress.final_path, rom.platform);
    } else if (!isDownloading && !isCompleted) {
      onDownload(rom);
    }
  };

  const getActionText = () => {
    if (isLocal) return "Play";
    if (isCompleted) return "Play";
    if (isDownloading) return `Downloading ${downloadProgress?.progress || 0}%`;
    if (hasError) return "Download Failed";
    return "Download";
  };

  const getStatusColor = () => {
    if (isLocal || isCompleted) return "#4CAF50"; // Green
    if (isDownloading) return "#2196F3"; // Blue
    if (hasError) return "#F44336"; // Red
    return "#757575"; // Gray
  };

  return (
    <Focusable
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        margin: "4px",
        background: "rgba(255, 255, 255, 0.04)",
        borderRadius: "4px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        minHeight: "120px"
      }}
    >
      <div style={{ display: "flex", gap: "8px", height: "100%" }}>
        {/* ROM Image */}
        <div style={{
          width: "60px",
          height: "60px",
          background: "#333",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          {rom.image_url ? (
            <img 
              src={rom.image_url} 
              alt={rom.name}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                borderRadius: "4px" 
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div style={{ color: "#666", fontSize: "12px" }}>ROM</div>
          )}
        </div>

        {/* ROM Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Title */}
          <div style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            lineHeight: "1.2",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {rom.name}
          </div>

          {/* Platform and Region */}
          <div style={{
            fontSize: "11px",
            color: "#aaa",
            display: "flex",
            gap: "8px"
          }}>
            <span style={{
              background: getStatusColor(),
              padding: "2px 6px",
              borderRadius: "2px",
              fontSize: "10px"
            }}>
              {rom.platform}
            </span>
            <span>{rom.region}</span>
            <span>{rom.size}</span>
          </div>

          {/* Description */}
          {rom.description && (
            <div style={{
              fontSize: "11px",
              color: "#ccc",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}>
              {rom.description}
            </div>
          )}

          {/* Progress Bar */}
          {isDownloading && downloadProgress && (
            <div style={{
              width: "100%",
              height: "4px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                background: "#2196F3",
                width: `${downloadProgress.progress}%`,
                transition: "width 0.3s ease"
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: "8px" }}>
        <ButtonItem
          layout="below"
          onClick={handleAction}
          disabled={isDownloading}
        >
          {getActionText()}
        </ButtonItem>
      </div>

      {/* Error Message */}
      {hasError && downloadProgress?.error && (
        <div style={{
          fontSize: "10px",
          color: "#F44336",
          marginTop: "4px",
          padding: "4px",
          background: "rgba(244, 67, 54, 0.1)",
          borderRadius: "2px"
        }}>
          Error: {downloadProgress.error}
        </div>
      )}
    </Focusable>
  );
};