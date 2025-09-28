import React from "react";
import {
  PanelSection,
  PanelSectionRow,
  Focusable,
  ScrollPanelGroup,
  ProgressBarWithInfo,
  ButtonItem,
} from "decky-frontend-lib";
import { DownloadProgress } from "../types";

interface DownloadsViewProps {
  downloads: {[key: string]: DownloadProgress};
  onLaunch: (romPath: string, platform: string) => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  downloads,
  onLaunch
}) => {
  const downloadEntries = Object.entries(downloads);
  
  const activeDownloads = downloadEntries.filter(([_, progress]) => 
    progress.status === 'downloading' || progress.status === 'starting'
  );
  
  const completedDownloads = downloadEntries.filter(([_, progress]) => 
    progress.status === 'completed'
  );
  
  const failedDownloads = downloadEntries.filter(([_, progress]) => 
    progress.status === 'error'
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const DownloadItem: React.FC<{
    romId: string;
    progress: DownloadProgress;
    showLaunchButton?: boolean;
  }> = ({ romId, progress, showLaunchButton = false }) => {
    const isActive = progress.status === 'downloading' || progress.status === 'starting';
    const isCompleted = progress.status === 'completed';
    const hasError = progress.status === 'error';

    const getStatusColor = () => {
      if (isCompleted) return "#4CAF50"; // Green
      if (isActive) return "#2196F3"; // Blue
      if (hasError) return "#F44336"; // Red
      return "#757575"; // Gray
    };

    const getStatusText = () => {
      switch (progress.status) {
        case 'starting': return 'Starting...';
        case 'downloading': return 'Downloading...';
        case 'completed': return 'Completed';
        case 'error': return 'Failed';
        default: return 'Unknown';
      }
    };

    return (
      <Focusable
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "12px",
          margin: "4px 0",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "4px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px"
        }}>
          <div style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1
          }}>
            {progress.filename}
          </div>
          <div style={{
            fontSize: "12px",
            color: getStatusColor(),
            fontWeight: "bold",
            marginLeft: "8px"
          }}>
            {getStatusText()}
          </div>
        </div>

        {/* Progress Info */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#aaa",
          marginBottom: "8px"
        }}>
          <span>
            {progress.downloaded_size > 0 
              ? `${formatFileSize(progress.downloaded_size)} / ${formatFileSize(progress.total_size)}`
              : formatFileSize(progress.total_size)
            }
          </span>
          <span>{progress.progress}%</span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: "6px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "8px"
        }}>
          <div style={{
            height: "100%",
            background: getStatusColor(),
            width: `${progress.progress}%`,
            transition: "width 0.3s ease"
          }} />
        </div>

        {/* Error Message */}
        {hasError && progress.error && (
          <div style={{
            fontSize: "11px",
            color: "#F44336",
            marginBottom: "8px",
            padding: "6px",
            background: "rgba(244, 67, 54, 0.1)",
            borderRadius: "3px"
          }}>
            Error: {progress.error}
          </div>
        )}

        {/* Launch Button */}
        {showLaunchButton && isCompleted && progress.final_path && (
          <ButtonItem
            layout="below"
            onClick={() => {
              // Extract platform from path or ROM ID
              const pathParts = progress.final_path!.split('/');
              const platform = pathParts.includes('ROMs') 
                ? pathParts[pathParts.indexOf('ROMs') + 1] 
                : '';
              onLaunch(progress.final_path!, platform);
            }}
            style={{
              minHeight: "32px",
              fontSize: "12px",
              background: "#4CAF50"
            }}
          >
            Play Now
          </ButtonItem>
        )}
      </Focusable>
    );
  };

  return (
    <ScrollPanelGroup>
      {/* Active Downloads */}
      {activeDownloads.length > 0 && (
        <PanelSection title={`Active Downloads (${activeDownloads.length})`}>
          <Focusable style={{ display: "flex", flexDirection: "column" }}>
            {activeDownloads.map(([romId, progress]) => (
              <DownloadItem
                key={romId}
                romId={romId}
                progress={progress}
              />
            ))}
          </Focusable>
        </PanelSection>
      )}

      {/* Completed Downloads */}
      {completedDownloads.length > 0 && (
        <PanelSection title={`Completed (${completedDownloads.length})`}>
          <Focusable style={{ display: "flex", flexDirection: "column" }}>
            {completedDownloads.map(([romId, progress]) => (
              <DownloadItem
                key={romId}
                romId={romId}
                progress={progress}
                showLaunchButton={true}
              />
            ))}
          </Focusable>
        </PanelSection>
      )}

      {/* Failed Downloads */}
      {failedDownloads.length > 0 && (
        <PanelSection title={`Failed Downloads (${failedDownloads.length})`}>
          <Focusable style={{ display: "flex", flexDirection: "column" }}>
            {failedDownloads.map(([romId, progress]) => (
              <DownloadItem
                key={romId}
                romId={romId}
                progress={progress}
              />
            ))}
          </Focusable>
        </PanelSection>
      )}

      {/* Empty State */}
      {downloadEntries.length === 0 && (
        <PanelSection title="Downloads">
          <PanelSectionRow>
            <div style={{ 
              textAlign: "center", 
              color: "#aaa", 
              padding: "40px 20px",
              fontSize: "14px"
            }}>
              No downloads yet.<br />
              Search for ROMs and start downloading to see progress here.
            </div>
          </PanelSectionRow>
        </PanelSection>
      )}
    </ScrollPanelGroup>
  );
};