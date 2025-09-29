import React, { useState, useEffect } from "react";
import {
  PanelSection,
  PanelSectionRow,
  TextField,
  Dropdown,
  ButtonItem,
  Spinner,
  ScrollPanelGroup,
} from "@decky/ui";
import { ROM, Platform, DownloadProgress } from "../types";
import { ROMCard } from "../components/ROMCard";

interface FullSizeStorePageProps {
  searchResults: ROM[];
  platforms: Platform[];
  downloads: {[key: string]: DownloadProgress};
  isSearching: boolean;
  onSearch: (query: string, platform: string, limit: number) => void;
  onDownload: (rom: ROM) => void;
  onLaunch: (romPath: string, platform: string) => void;
}

export const FullSizeStorePage: React.FC<FullSizeStorePageProps> = ({
  searchResults,
  platforms,
  downloads,
  isSearching,
  onSearch,
  onDownload,
  onLaunch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [searchLimit, setSearchLimit] = useState(50);

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() || selectedPlatform) {
        onSearch(searchQuery, selectedPlatform, searchLimit);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedPlatform, searchLimit, onSearch]);

  // Initial search with more results for fullsize page
  useEffect(() => {
    onSearch("", "", searchLimit);
  }, []);

  const platformOptions = [
    { data: "", label: "All Platforms" },
    ...platforms.map(platform => ({
      data: platform.id,
      label: platform.name
    }))
  ];

  const limitOptions = [
    { data: 25, label: "25 Results" },
    { data: 50, label: "50 Results" },
    { data: 100, label: "100 Results" },
    { data: 200, label: "200 Results" }
  ];

  return (
    <div style={{ 
      height: "100%", 
      background: "var(--background)",
      color: "var(--foreground)",
      padding: "20px"
    }}>
      <ScrollPanelGroup>
        <PanelSection title="Search ROMs">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr 1fr", 
            gap: "16px", 
            marginBottom: "16px" 
          }}>
            <TextField
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Dropdown
              rgOptions={platformOptions}
              selectedOption={selectedPlatform}
              onChange={(data) => setSelectedPlatform(data.data)}
              strDefaultLabel="All Platforms"
            />

            <Dropdown
              rgOptions={limitOptions}
              selectedOption={searchLimit}
              onChange={(data) => setSearchLimit(data.data)}
              strDefaultLabel="50 Results"
            />
          </div>
          
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => onSearch(searchQuery, selectedPlatform, searchLimit)}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search ROMs"}
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>

        <PanelSection 
          title={`ROM Store - ${searchResults.length} Results`}
          spinner={isSearching}
        >
          {isSearching && searchResults.length === 0 ? (
            <PanelSectionRow>
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                padding: "40px",
                fontSize: "16px"
              }}>
                <Spinner />
                <span style={{ marginLeft: "12px" }}>Loading ROMs...</span>
              </div>
            </PanelSectionRow>
          ) : searchResults.length === 0 ? (
            <PanelSectionRow>
              <div style={{ 
                textAlign: "center", 
                color: "#aaa", 
                padding: "40px",
                fontSize: "16px"
              }}>
                {searchQuery || selectedPlatform 
                  ? "No ROMs found matching your search criteria"
                  : "Enter a search term to discover ROMs"
                }
              </div>
            </PanelSectionRow>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "16px",
              padding: "8px"
            }}>
              {searchResults.map((rom) => (
                <ROMCard
                  key={rom.id}
                  rom={rom}
                  onDownload={onDownload}
                  onLaunch={onLaunch}
                  downloadProgress={downloads[rom.id]}
                />
              ))}
            </div>
          )}
        </PanelSection>
      </ScrollPanelGroup>
    </div>
  );
};