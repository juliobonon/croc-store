import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Dropdown,
  ButtonItem,
  Spinner,
  Focusable,
  Navigation,
} from "@decky/ui";
import { ROM, Platform, DownloadProgress } from "../types";
import { ROMCard } from "../components/ROMCard";

interface FullSizeStorePageProps {
  searchResults: ROM[];
  platforms: Platform[];
  downloads: { [key: string]: DownloadProgress };
  isSearching: boolean;
  onSearch: (query: string, platform: string, limit: number) => void;
  onDownload: (rom: ROM) => void;
  onLaunch: (romPath: string, platform: string) => void;
  onClose?: () => void;
}

export const FullSizeStorePage: React.FC<FullSizeStorePageProps> = ({
  searchResults,
  platforms,
  downloads,
  isSearching,
  onSearch,
  onDownload,
  onLaunch,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [searchLimit, setSearchLimit] = useState(50);
  const firstCardRef = useRef<HTMLDivElement>(null);

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
    <Focusable style={{
      padding: "20px",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header section */}
      <Focusable style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          🐊 Croc Store - Full Size
        </h2>

        <ButtonItem onClick={onClose || (() => Navigation.NavigateBack())}>
          ← Back
        </ButtonItem>
      </Focusable>

      {/* Search section */}
      <Focusable style={{
        marginBottom: "20px",
        padding: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.05)"
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          fontWeight: "bold"
        }}>
          🔍 Search ROMs
        </h3>

        <Focusable style={{
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
        </Focusable>

        <ButtonItem
          layout="below"
          onClick={() => onSearch(searchQuery, selectedPlatform, searchLimit)}
          disabled={isSearching}
        >
          {isSearching ? "🔍 Searching..." : "🔍 Search ROMs"}
        </ButtonItem>
      </Focusable>

      {/* Results section */}
      <Focusable style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <Focusable style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "18px"
          }}>
            📚 ROM Store - {searchResults.length} Results
          </h3>
          {isSearching && (
            <Focusable style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Spinner />
              <span style={{ fontSize: "14px" }}>Loading...</span>
            </Focusable>
          )}
        </Focusable>

        {isSearching && searchResults.length === 0 ? (
          <Focusable style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px",
            fontSize: "18px"
          }}>
            <Spinner />
            <span style={{ marginLeft: "12px" }}>Searching for ROMs...</span>
          </Focusable>
        ) : searchResults.length === 0 ? (
          <Focusable style={{
            textAlign: "center",
            padding: "60px",
            fontSize: "16px"
          }}>
            {searchQuery || selectedPlatform
              ? "🚫 No ROMs found matching your search criteria. Try different keywords or select a different platform."
              : "🎮 Enter a search term above to discover ROMs from our extensive library!"
            }
          </Focusable>
        ) : (
          <Focusable style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            rowGap: "15px",
            columnGap: "15px"
          }}>
            {searchResults.map((rom, index) => (
              <div
                key={rom.id}
                ref={index === 0 ? firstCardRef : undefined}
                style={{
                  minWidth: "300px",
                  maxWidth: "350px",
                  flex: "1 1 auto"
                }}
              >
                <ROMCard
                  rom={rom}
                  onDownload={onDownload}
                  onLaunch={onLaunch}
                  downloadProgress={downloads[rom.id]}
                />
              </div>
            ))}
          </Focusable>
        )}
      </Focusable>
    </Focusable>
  );
};