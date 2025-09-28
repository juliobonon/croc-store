import React, { useEffect, useState } from "react";
import {
  PanelSection,
  PanelSectionRow,
  Focusable,
  ScrollPanelGroup,
  ButtonItem,
  Dropdown,
} from "@decky/ui";
import { LocalROM } from "../types";
import { ROMCard } from "./ROMCard";

interface LocalROMsProps {
  localROMs: LocalROM[];
  onLoadLocalROMs: () => void;
  onLaunch: (romPath: string, platform: string) => void;
  isLoading: boolean;
}

export const LocalROMsView: React.FC<LocalROMsProps> = ({
  localROMs,
  onLoadLocalROMs,
  onLaunch,
  isLoading
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Load local ROMs on mount
  useEffect(() => {
    onLoadLocalROMs();
  }, [onLoadLocalROMs]);

  // Get unique platforms
  const platforms = Array.from(new Set(localROMs.map(rom => rom.platform))).sort();
  
  const platformOptions = [
    { data: "", label: "All Platforms" },
    ...platforms.map(platform => ({
      data: platform,
      label: platform
    }))
  ];

  const sortOptions = [
    { data: "name", label: "Name" },
    { data: "platform", label: "Platform" },
    { data: "modified", label: "Date Modified" },
    { data: "size", label: "File Size" }
  ];

  // Filter and sort ROMs
  const filteredROMs = localROMs
    .filter(rom => !selectedPlatform || rom.platform === selectedPlatform)
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "platform":
          return a.platform.localeCompare(b.platform);
        case "modified":
          return b.modified - a.modified; // Newest first
        case "size":
          return b.size - a.size; // Largest first
        default:
          return 0;
      }
    });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Convert LocalROM to ROM format for ROMCard
  const convertToROM = (localROM: LocalROM) => ({
    id: localROM.path,
    name: localROM.name,
    platform: localROM.platform,
    region: "Local",
    language: "Unknown",
    size: formatFileSize(localROM.size),
    description: `Modified: ${formatDate(localROM.modified)}`,
    download_url: "",
    image_url: ""
  });

  // Group ROMs by platform for better organization
  const groupedROMs = filteredROMs.reduce((groups, rom) => {
    const platform = rom.platform;
    if (!groups[platform]) {
      groups[platform] = [];
    }
    groups[platform].push(rom);
    return groups;
  }, {} as {[key: string]: LocalROM[]});

  return (
    <ScrollPanelGroup>
      <PanelSection title="My ROMs">
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={onLoadLocalROMs}
            disabled={isLoading}
          >
            {isLoading ? "Scanning..." : "Refresh"}
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <Dropdown
            rgOptions={platformOptions}
            selectedOption={selectedPlatform}
            onChange={(data) => setSelectedPlatform(data.data)}
            strDefaultLabel="All Platforms"
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <Dropdown
            rgOptions={sortOptions}
            selectedOption={sortBy}
            onChange={(data) => setSortBy(data.data)}
            strDefaultLabel="Sort by Name"
          />
        </PanelSectionRow>
      </PanelSection>

      {/* ROM Statistics */}
      <PanelSection title="Statistics">
        <PanelSectionRow>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-around", 
            fontSize: "12px",
            color: "#aaa" 
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#fff", fontWeight: "bold" }}>
                {filteredROMs.length}
              </div>
              <div>ROMs</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#fff", fontWeight: "bold" }}>
                {platforms.length}
              </div>
              <div>Platforms</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#fff", fontWeight: "bold" }}>
                {formatFileSize(filteredROMs.reduce((total, rom) => total + rom.size, 0))}
              </div>
              <div>Total Size</div>
            </div>
          </div>
        </PanelSectionRow>
      </PanelSection>

      {/* ROMs List */}
      {selectedPlatform ? (
        // Single platform view
        <PanelSection title={`${selectedPlatform} (${filteredROMs.length})`}>
          {filteredROMs.length === 0 ? (
            <PanelSectionRow>
              <div style={{ 
                textAlign: "center", 
                color: "#aaa", 
                padding: "20px",
                fontSize: "14px"
              }}>
                No ROMs found for {selectedPlatform}
              </div>
            </PanelSectionRow>
          ) : (
            <Focusable style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {filteredROMs.map((localROM) => (
                <ROMCard
                  key={localROM.path}
                  rom={convertToROM(localROM)}
                  onDownload={() => {}} // Not applicable for local ROMs
                  onLaunch={onLaunch}
                  isLocal={true}
                  localPath={localROM.path}
                />
              ))}
            </Focusable>
          )}
        </PanelSection>
      ) : (
        // Grouped by platform view
        Object.entries(groupedROMs).length === 0 ? (
          <PanelSection title="No ROMs Found">
            <PanelSectionRow>
              <div style={{ 
                textAlign: "center", 
                color: "#aaa", 
                padding: "40px 20px",
                fontSize: "14px"
              }}>
                No local ROMs found.<br />
                Download some ROMs from the Store or place ROM files in /home/deck/ROMs/
              </div>
            </PanelSectionRow>
          </PanelSection>
        ) : (
          Object.entries(groupedROMs)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([platform, roms]) => (
              <PanelSection key={platform} title={`${platform} (${roms.length})`}>
                <Focusable style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {roms.map((localROM) => (
                    <ROMCard
                      key={localROM.path}
                      rom={convertToROM(localROM)}
                      onDownload={() => {}} // Not applicable for local ROMs
                      onLaunch={onLaunch}
                      isLocal={true}
                      localPath={localROM.path}
                    />
                  ))}
                </Focusable>
              </PanelSection>
            ))
        )
      )}
    </ScrollPanelGroup>
  );
};