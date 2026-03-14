import { useEffect } from 'react';

import type { PatchPreset } from '../../presetLibrary';

interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function PresetLibraryModal({
  isOpen,
  onClose,
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
}: PresetLibraryModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const activePresetHint = patchPresets.find((preset) => preset.id === activePresetId)?.hint;
  const activeUserPresetHint =
    userPatchPresets.find((preset) => preset.id === activeUserPresetId)?.hint ?? 'Guarda el graf actual al navegador';

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/65 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(7,10,20,0.98),rgba(16,20,32,0.96))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">Preset Library</div>
            <div className="mt-1 text-sm text-white/50">Carrega, guarda i exporta patches sense carregar el header.</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/40">Patch Presets</div>
            <div className="flex flex-col gap-3">
              <select
                value={activePresetId}
                onChange={(event) => onActivePresetIdChange(event.target.value)}
                className="bg-slate-950/80 text-white text-xs p-3 rounded-xl border border-white/10 outline-none focus:border-sky-400"
              >
                {patchPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <button
                onClick={onLoadPreset}
                className="rounded-xl border border-sky-500/30 bg-sky-500/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300 transition-colors hover:bg-sky-500/25"
                title={activePresetHint}
              >
                Load Patch
              </button>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] text-white/50">{activePresetHint}</div>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/40">My Patches</div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={userPresetName}
                onChange={(event) => onUserPresetNameChange(event.target.value)}
                placeholder="Nom del patch"
                className="bg-slate-950/80 text-white text-xs p-3 rounded-xl border border-white/10 outline-none focus:border-emerald-400"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={onSaveCurrent}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 transition-colors hover:bg-emerald-500/25"
                >
                  Save Current
                </button>
                <button
                  onClick={onExportPreset}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200 transition-colors hover:bg-amber-500/25"
                >
                  Export Preset
                </button>
              </div>
              <select
                value={activeUserPresetId}
                onChange={(event) => onActiveUserPresetIdChange(event.target.value)}
                className="bg-slate-950/80 text-white text-xs p-3 rounded-xl border border-white/10 outline-none focus:border-emerald-400"
              >
                <option value="">Tria un patch guardat</option>
                {userPatchPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={onLoadUserPreset}
                  disabled={!activeUserPresetId}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Load Saved
                </button>
                <button
                  onClick={onDeleteUserPreset}
                  disabled={!activeUserPresetId}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-rose-300 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] text-white/50">{activeUserPresetHint}</div>
            </div>
          </section>
        </div>

        {(exportPresetFeedback || exportedPresetCode) && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            {exportPresetFeedback && (
              <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-amber-200">{exportPresetFeedback}</div>
            )}
            {exportedPresetCode && (
              <details className="rounded-xl border border-white/10 bg-slate-950/60">
                <summary className="cursor-pointer px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                  Last Exported Preset Code
                </summary>
                <div className="p-3 pt-0">
                  <textarea
                    readOnly
                    value={exportedPresetCode}
                    className="mt-2 h-48 w-full resize-y rounded-xl border border-white/10 bg-slate-950/90 p-3 font-mono text-[10px] leading-relaxed text-white/80 outline-none"
                  />
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
