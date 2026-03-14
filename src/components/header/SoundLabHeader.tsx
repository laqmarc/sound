import { useState } from 'react';

import type { ComponentTabId, MachineSetTemplate } from '../../editorConfig';
import type { PatchPreset } from '../../presetLibrary';

import { HeaderBrand } from './HeaderBrand';
import { HeaderWorkspaceControls } from './HeaderWorkspaceControls';
import { PresetLibraryModal } from './PresetLibraryModal';
import './SoundLabHeader.css';

interface SoundLabHeaderProps {
  patchPresets: PatchPreset[];
  activePresetId: string;
  onActivePresetIdChange: (value: string) => void;
  onLoadPreset: () => void;
  userPresetName: string;
  onUserPresetNameChange: (value: string) => void;
  onSaveCurrent: () => void;
  onExportPreset: () => void;
  activeUserPresetId: string;
  onActiveUserPresetIdChange: (value: string) => void;
  userPatchPresets: PatchPreset[];
  onLoadUserPreset: () => void;
  onDeleteUserPreset: () => void;
  exportPresetFeedback: string;
  exportedPresetCode: string;
  activeComponentTab: ComponentTabId;
  onSelectComponentTab: (tabId: ComponentTabId) => void;
  visibleMachineSets: MachineSetTemplate[];
  onAddMachineSet: (setId: string) => void;
  onTestSound: () => void;
}

export function SoundLabHeader(props: SoundLabHeaderProps) {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  return (
    <>
      <header className="sound-lab-header">
        <div className="sound-lab-header__brand-column">
          <HeaderBrand onTestSound={props.onTestSound} />
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="sound-lab-header__presets-button"
          >
            Presets
          </button>
        </div>

        <HeaderWorkspaceControls
          activeComponentTab={props.activeComponentTab}
          onSelectComponentTab={props.onSelectComponentTab}
          visibleMachineSets={props.visibleMachineSets}
          onAddMachineSet={props.onAddMachineSet}
        />
      </header>

      <PresetLibraryModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        patchPresets={props.patchPresets}
        activePresetId={props.activePresetId}
        onActivePresetIdChange={props.onActivePresetIdChange}
        onLoadPreset={props.onLoadPreset}
        userPresetName={props.userPresetName}
        onUserPresetNameChange={props.onUserPresetNameChange}
        onSaveCurrent={props.onSaveCurrent}
        onExportPreset={props.onExportPreset}
        activeUserPresetId={props.activeUserPresetId}
        onActiveUserPresetIdChange={props.onActiveUserPresetIdChange}
        userPatchPresets={props.userPatchPresets}
        onLoadUserPreset={props.onLoadUserPreset}
        onDeleteUserPreset={props.onDeleteUserPreset}
        exportPresetFeedback={props.exportPresetFeedback}
        exportedPresetCode={props.exportedPresetCode}
      />
    </>
  );
}
