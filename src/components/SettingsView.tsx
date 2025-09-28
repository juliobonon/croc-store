import React, { useState, useEffect } from "react";
import {
  PanelSection,
  PanelSectionRow,
  ToggleField,
  SliderField,
  Dropdown,
  ButtonItem,
  ScrollPanelGroup,
} from "@decky/ui";
import { Settings, EmulatorStatus } from "../types";

interface SettingsViewProps {
  settings: Settings | null;
  emulators: EmulatorStatus;
  onSaveSettings: (settings: Settings) => Promise<boolean>;
  onDetectEmulators: () => void;
  isLoading: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  emulators,
  onSaveSettings,
  onDetectEmulators,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update local settings when prop changes
  useEffect(() => {
    if (settings && !hasChanges) {
      setLocalSettings(settings);
    }
  }, [settings, hasChanges]);

  // Check for changes
  useEffect(() => {
    if (settings && localSettings) {
      const changed = JSON.stringify(settings) !== JSON.stringify(localSettings);
      setHasChanges(changed);
    }
  }, [settings, localSettings]);

  const handleSave = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    try {
      const success = await onSaveSettings(localSettings);
      if (success) {
        setHasChanges(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setLocalSettings(settings);
      setHasChanges(false);
    }
  };

  if (!localSettings) {
    return (
      <PanelSection title="Settings">
        <PanelSectionRow>
          <div style={{ textAlign: "center", color: "#aaa", padding: "20px" }}>
            Loading settings...
          </div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const emulatorOptions = [
    { data: "retroarch", label: "RetroArch" },
    { data: "emudeck", label: "EmuDeck" },
    { data: "system", label: "System Default" }
  ];

  const regionOptions = [
    { data: "USA", label: "USA" },
    { data: "Europe", label: "Europe" },
    { data: "Japan", label: "Japan" },
    { data: "World", label: "World" }
  ];

  const languageOptions = [
    { data: "English", label: "English" },
    { data: "Japanese", label: "Japanese" },
    { data: "French", label: "French" },
    { data: "German", label: "German" },
    { data: "Spanish", label: "Spanish" }
  ];

  return (
    <ScrollPanelGroup>
      {/* Download Settings */}
      <PanelSection title="Download Settings">
        <PanelSectionRow>
          <ToggleField
            label="Auto-organize ROMs by platform"
            description="Automatically organize downloaded ROMs into platform-specific folders"
            checked={localSettings.auto_organize}
            onChange={(value) => 
              setLocalSettings({...localSettings, auto_organize: value})
            }
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <SliderField
            label="Concurrent Downloads"
            description="Maximum number of simultaneous downloads"
            value={localSettings.download_concurrent_limit}
            min={1}
            max={10}
            step={1}
            onChange={(value) => 
              setLocalSettings({...localSettings, download_concurrent_limit: value})
            }
          />
        </PanelSectionRow>
      </PanelSection>

      {/* Emulator Settings */}
      <PanelSection title="Emulator Settings">
        <PanelSectionRow>
          <ToggleField
            label="Auto-launch ROMs"
            description="Automatically launch ROMs after downloading"
            checked={localSettings.auto_launch}
            onChange={(value) => 
              setLocalSettings({...localSettings, auto_launch: value})
            }
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <Dropdown
            rgOptions={emulatorOptions}
            selectedOption={localSettings.preferred_emulator}
            onChange={(data) => 
              setLocalSettings({...localSettings, preferred_emulator: data.data})
            }
            strDefaultLabel="Select Emulator"
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={onDetectEmulators}
          >
            Detect Emulators
          </ButtonItem>
        </PanelSectionRow>

        {/* Emulator Status */}
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#aaa" }}>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Detected Emulators:</div>
            {Object.entries(emulators).map(([name, detected]) => (
              <div key={name} style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "4px" 
              }}>
                <span style={{ textTransform: "capitalize" }}>{name}:</span>
                <span style={{ 
                  color: detected ? "#4CAF50" : "#F44336",
                  fontWeight: "bold"
                }}>
                  {detected ? "✓ Found" : "✗ Not Found"}
                </span>
              </div>
            ))}
          </div>
        </PanelSectionRow>
      </PanelSection>

      {/* Filter Settings */}
      <PanelSection title="Content Filters">
        <PanelSectionRow>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>Preferred Regions:</div>
          {regionOptions.map((region) => (
            <ToggleField
              key={region.data}
              label={region.label}
              checked={localSettings.regions.includes(region.data)}
              onChange={(checked) => {
                const newRegions = checked
                  ? [...localSettings.regions, region.data]
                  : localSettings.regions.filter(r => r !== region.data);
                setLocalSettings({...localSettings, regions: newRegions});
              }}
            />
          ))}
        </PanelSectionRow>

        <PanelSectionRow>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>Preferred Languages:</div>
          {languageOptions.map((language) => (
            <ToggleField
              key={language.data}
              label={language.label}
              checked={localSettings.languages.includes(language.data)}
              onChange={(checked) => {
                const newLanguages = checked
                  ? [...localSettings.languages, language.data]
                  : localSettings.languages.filter(l => l !== language.data);
                setLocalSettings({...localSettings, languages: newLanguages});
              }}
            />
          ))}
        </PanelSectionRow>
      </PanelSection>

      {/* System Information */}
      <PanelSection title="System Information">
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#aaa" }}>
            <div><strong>ROMs Directory:</strong> /home/deck/ROMs/</div>
            <div><strong>Downloads Directory:</strong> /home/deck/Downloads/CrocStore/</div>
            <div><strong>Settings Directory:</strong> /home/deck/.config/croc-store/</div>
          </div>
        </PanelSectionRow>
      </PanelSection>

      {/* Action Buttons */}
      <PanelSection title="Actions">
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
          </ButtonItem>
        </PanelSectionRow>

        {hasChanges && (
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={handleReset}
            >
              Reset Changes
            </ButtonItem>
          </PanelSectionRow>
        )}
      </PanelSection>
    </ScrollPanelGroup>
  );
};