import type { ComponentTabId, MachineSetTemplate } from '../../editorConfig';
import type { PatchPreset } from '../../presetLibrary';

import { HeaderBrand } from './HeaderBrand';
import { HeaderTransportControls } from './HeaderTransportControls';
import { HeaderWorkspaceControls } from './HeaderWorkspaceControls';

interface TransportState {
  isPlaying: boolean;
  step: number;
  bpm: number;
  swing: number;
}

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
  transport: TransportState;
  audioStarted: boolean;
  onSetTransportBpm: (value: number) => void;
  onSetTransportSwing: (value: number) => void;
  onStartAudio: () => void;
  onStopAudio: () => void;
  onTestSound: () => void;
}

export function SoundLabHeader(props: SoundLabHeaderProps) {
  return (
    <header className="px-4 sm:px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-wrap items-center justify-between z-50 gap-4">
      <HeaderBrand onTestSound={props.onTestSound} />
      <HeaderWorkspaceControls
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
        activeComponentTab={props.activeComponentTab}
        onSelectComponentTab={props.onSelectComponentTab}
        visibleMachineSets={props.visibleMachineSets}
        onAddMachineSet={props.onAddMachineSet}
      />
      <HeaderTransportControls
        audioStarted={props.audioStarted}
        transport={props.transport}
        onSetTransportBpm={props.onSetTransportBpm}
        onSetTransportSwing={props.onSetTransportSwing}
        onStartAudio={props.onStartAudio}
        onStopAudio={props.onStopAudio}
      />
    </header>
  );
}
