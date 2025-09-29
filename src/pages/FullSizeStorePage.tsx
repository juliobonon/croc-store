import React, { useState, useEffect } from "react";
import {
  TextField,
  Dropdown,
  ButtonItem,
  Spinner,
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
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Fixed search section at top */}
      <div style={{
        background: "var(--background)",
        padding: "20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}>
        <h3 style={{ 
          margin: "0 0 16px 0", 
          fontSize: "18px", 
          fontWeight: "bold",
          color: "var(--foreground)"
        }}>
          🔍 Search ROMs
        </h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "2fr 1fr 1fr", 
          gap: "16px", 
          marginBottom: "16px",
          alignItems: "end"
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
        
        <ButtonItem
          layout="below"
          onClick={() => onSearch(searchQuery, selectedPlatform, searchLimit)}
          disabled={isSearching}
        >
          {isSearching ? "🔍 Searching..." : "🔍 Search ROMs"}
        </ButtonItem>
      </div>

      {/* Scrollable results section */}
      <div style={{ 
        flex: 1, 
        overflow: "auto",
        padding: "20px"
      }}>
        <div style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: "16px",
            color: "var(--foreground)"
          }}>
            📚 ROM Store - {searchResults.length} Results
          </h3>
          {isSearching && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Spinner />
              <span style={{ fontSize: "14px", color: "#aaa" }}>Loading...</span>
            </div>
          )}
        </div>

        {isSearching && searchResults.length === 0 ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: "60px",
            fontSize: "18px",
            color: "#aaa"
          }}>
            <Spinner />
            <span style={{ marginLeft: "12px" }}>Searching for ROMs...</span>
          </div>
        ) : searchResults.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            color: "#aaa", 
            padding: "60px",
            fontSize: "16px"
          }}>
            {searchQuery || selectedPlatform 
              ? "🚫 No ROMs found matching your search criteria. Try different keywords or select a different platform."
              : "🎮 Enter a search term above to discover ROMs from our extensive library!"
            }
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
            gap: "20px",
            paddingBottom: "20px"
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
      </div>
    </div>
  );
};