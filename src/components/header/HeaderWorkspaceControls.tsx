import { componentTabs, type ComponentTabId, type MachineSetTemplate } from '../../editorConfig';
import type { PatchPreset } from '../../presetLibrary';

interface HeaderWorkspaceControlsProps {
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
}

export function HeaderWorkspaceControls({
  patchPresets,
  activePresetId,
  onActivePresetIdChange,
  onLoadPreset,
  userPresetName,
  onUserPresetNameChange,
  onSaveCurrent,
  onExportPreset,
  activeUserPresetId,
  onActiveUserPresetIdChange,
  userPatchPresets,
  onLoadUserPreset,
  onDeleteUserPreset,
  exportPresetFeedback,
  exportedPresetCode,
  activeComponentTab,
  onSelectComponentTab,
  visibleMachineSets,
  onAddMachineSet,
}: HeaderWorkspaceControlsProps) {
  const activePresetHint = patchPresets.find((preset) => preset.id === activePresetId)?.hint;
  const activeUserPresetHint =
    userPatchPresets.find((preset) => preset.id === activeUserPresetId)?.hint ?? 'Guarda el graf actual al navegador';

  return (
    <div className="flex-1 min-w-0 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner">
      <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/40">Patch Presets</div>
        <select
          value={activePresetId}
          onChange={(event) => onActivePresetIdChange(event.target.value)}
          className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-sky-400 min-w-[180px]"
        >
          {patchPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onLoadPreset();
          }}
          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25 transition-all"
          title={activePresetHint}
        >
          Load Patch
        </button>
        <div className="text-[10px] text-white/40 truncate">{activePresetHint}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/40">My Patches</div>
        <input
          type="text"
          value={userPresetName}
          onChange={(event) => onUserPresetNameChange(event.target.value)}
          onMouseDown={(event) => event.stopPropagation()}
          placeholder="Nom del patch"
          className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-emerald-400 min-w-[170px]"
        />
        <button
          onClick={(event) => {
            event.stopPropagation();
            onSaveCurrent();
          }}
          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
        >
          Save Current
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onExportPreset();
          }}
          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-amber-500/15 text-amber-200 border-amber-500/30 hover:bg-amber-500/25 transition-all"
        >
          Export Preset
        </button>
        <select
          value={activeUserPresetId}
          onChange={(event) => onActiveUserPresetIdChange(event.target.value)}
          className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-emerald-400 min-w-[180px]"
        >
          <option value="">Tria un patch guardat</option>
          {userPatchPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onLoadUserPreset();
          }}
          disabled={!activeUserPresetId}
          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-white/5 text-white/75 border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Load Saved
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDeleteUserPreset();
          }}
          disabled={!activeUserPresetId}
          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Delete
        </button>
        <div className="text-[10px] text-white/40 truncate">{activeUserPresetHint}</div>
      </div>

      {(exportPresetFeedback || exportedPresetCode) && (
        <div className="mt-3 px-1">
          {exportPresetFeedback && (
            <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-amber-200">{exportPresetFeedback}</div>
          )}
          {exportedPresetCode && (
            <details className="rounded-xl border border-white/10 bg-black/20">
              <summary className="cursor-pointer px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                Last Exported Preset Code
              </summary>
              <div className="p-3 pt-0">
                <textarea
                  readOnly
                  value={exportedPresetCode}
                  onMouseDown={(event) => event.stopPropagation()}
                  className="mt-2 h-48 w-full resize-y rounded-xl border border-white/10 bg-slate-950/90 p-3 font-mono text-[10px] leading-relaxed text-white/80 outline-none"
                />
              </div>
            </details>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 px-1 pt-3 mt-3 border-t border-white/10">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/40 mr-2">Families</div>
        {componentTabs.map((tab) => {
          const isActive = activeComponentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelectComponentTab(tab.id);
              }}
              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border transition-all ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-white/5 text-white/55 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title={tab.hint}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visibleMachineSets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 pt-3 mt-3 border-t border-white/10">
          <div className="text-[9px] uppercase tracking-[0.22em] text-white/40 mr-2">Sets</div>
          {visibleMachineSets.map((setTemplate) => (
            <button
              key={setTemplate.id}
              onClick={(event) => {
                event.stopPropagation();
                onAddMachineSet(setTemplate.id);
              }}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-500/25 hover:bg-fuchsia-500/20 transition-all"
              title={setTemplate.hint}
            >
              + {setTemplate.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
