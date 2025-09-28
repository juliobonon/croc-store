import React, { useState, useEffect } from "react";
import {
  PanelSection,
  PanelSectionRow,
  TextField,
  Dropdown,
  ButtonItem,
  Spinner,
  Focusable,
  ScrollPanelGroup,
  gamepadDialogClasses,
} from "decky-frontend-lib";
import { ROM, Platform, DownloadProgress } from "../types";
import { ROMCard } from "./ROMCard";

interface SearchViewProps {
  searchResults: ROM[];
  platforms: Platform[];
  downloads: {[key: string]: DownloadProgress};
  isSearching: boolean;
  onSearch: (query: string, platform: string, limit: number) => void;
  onDownload: (rom: ROM) => void;
  onLaunch: (romPath: string, platform: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
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
  const [searchLimit, setSearchLimit] = useState(20);

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() || selectedPlatform) {
        onSearch(searchQuery, selectedPlatform, searchLimit);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedPlatform, searchLimit, onSearch]);

  // Initial search
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
    { data: 10, label: "10 Results" },
    { data: 20, label: "20 Results" },
    { data: 50, label: "50 Results" },
    { data: 100, label: "100 Results" }
  ];

  return (
    <ScrollPanelGroup>
      <PanelSection title="Search ROMs">
        <PanelSectionRow>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter ROM name..."
          />
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
            rgOptions={limitOptions}
            selectedOption={searchLimit}
            onChange={(data) => setSearchLimit(data.data)}
            strDefaultLabel="20 Results"
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => onSearch(searchQuery, selectedPlatform, searchLimit)}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection 
        title={`Results (${searchResults.length})`}
        spinner={isSearching}
      >
        {isSearching && searchResults.length === 0 ? (
          <PanelSectionRow>
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              padding: "20px" 
            }}>
              <Spinner />
            </div>
          </PanelSectionRow>
        ) : searchResults.length === 0 ? (
          <PanelSectionRow>
            <div style={{ 
              textAlign: "center", 
              color: "#aaa", 
              padding: "20px",
              fontSize: "14px"
            }}>
              {searchQuery || selectedPlatform 
                ? "No ROMs found matching your search criteria"
                : "Enter a search term to find ROMs"
              }
            </div>
          </PanelSectionRow>
        ) : (
          <Focusable style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {searchResults.map((rom) => (
              <ROMCard
                key={rom.id}
                rom={rom}
                onDownload={onDownload}
                onLaunch={onLaunch}
                downloadProgress={downloads[rom.id]}
              />
            ))}
          </Focusable>
        )}
      </PanelSection>
    </ScrollPanelGroup>
  );
};