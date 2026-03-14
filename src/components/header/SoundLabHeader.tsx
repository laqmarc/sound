import { useState } from 'react';

import type { ComponentTabId, MachineSetTemplate } from '../../editorConfig';
import type { PatchPreset } from '../../presetLibrary';

import { HeaderBrand } from './HeaderBrand';
import { HeaderWorkspaceControls } from './HeaderWorkspaceControls';
import { PresetLibraryModal } from './PresetLibraryModal';

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
      <header className="px-4 sm:px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-wrap items-start gap-4 z-50">
        <div className="flex shrink-0 flex-col gap-2">
          <HeaderBrand onTestSound={props.onTestSound} />
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="w-fit rounded-xl border border-sky-500/30 bg-sky-500/15 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-sky-300 transition-all hover:bg-sky-500/25"
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
