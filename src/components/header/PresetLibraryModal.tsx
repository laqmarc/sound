import { useEffect } from 'react';

import type { PatchPreset } from '../../presetLibrary';
import './PresetLibraryModal.css';

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
    <div className="preset-library-modal" onClick={onClose}>
      <div
        className="preset-library-modal__card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="preset-library-modal__header">
          <div>
            <div className="preset-library-modal__eyebrow">Preset Library</div>
            <div className="preset-library-modal__description">Carrega, guarda i exporta patches sense carregar el header.</div>
          </div>
          <button
            onClick={onClose}
            className="preset-library-modal__close"
          >
            Close
          </button>
        </div>

        <div className="preset-library-modal__grid">
          <section className="preset-library-modal__section preset-library-modal__section--presets">
            <div className="preset-library-modal__section-title">Patch Presets</div>
            <div className="preset-library-modal__stack">
              <select
                value={activePresetId}
                onChange={(event) => onActivePresetIdChange(event.target.value)}
                className="preset-library-modal__field"
              >
                {patchPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <button
                onClick={onLoadPreset}
                className="preset-library-modal__button preset-library-modal__button--load"
                title={activePresetHint}
              >
                Load Patch
              </button>
              <div className="preset-library-modal__hint">{activePresetHint}</div>
            </div>
          </section>

          <section className="preset-library-modal__section preset-library-modal__section--saved">
            <div className="preset-library-modal__section-title">My Patches</div>
            <div className="preset-library-modal__stack">
              <input
                type="text"
                value={userPresetName}
                onChange={(event) => onUserPresetNameChange(event.target.value)}
                placeholder="Nom del patch"
                className="preset-library-modal__field preset-library-modal__field--saved"
              />
              <div className="preset-library-modal__actions">
                <button
                  onClick={onSaveCurrent}
                  className="preset-library-modal__button preset-library-modal__button--save"
                >
                  Save Current
                </button>
                <button
                  onClick={onExportPreset}
                  className="preset-library-modal__button preset-library-modal__button--export"
                >
                  Export Preset
                </button>
              </div>
              <select
                value={activeUserPresetId}
                onChange={(event) => onActiveUserPresetIdChange(event.target.value)}
                className="preset-library-modal__field preset-library-modal__field--saved"
              >
                <option value="">Tria un patch guardat</option>
                {userPatchPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <div className="preset-library-modal__actions">
                <button
                  onClick={onLoadUserPreset}
                  disabled={!activeUserPresetId}
                  className="preset-library-modal__button preset-library-modal__button--ghost"
                >
                  Load Saved
                </button>
                <button
                  onClick={onDeleteUserPreset}
                  disabled={!activeUserPresetId}
                  className="preset-library-modal__button preset-library-modal__button--danger"
                >
                  Delete
                </button>
              </div>
              <div className="preset-library-modal__hint">{activeUserPresetHint}</div>
            </div>
          </section>
        </div>

        {(exportPresetFeedback || exportedPresetCode) && (
          <div className="preset-library-modal__export">
            {exportPresetFeedback && (
              <div className="preset-library-modal__feedback">{exportPresetFeedback}</div>
            )}
            {exportedPresetCode && (
              <details className="preset-library-modal__details">
                <summary className="preset-library-modal__summary">
                  Last Exported Preset Code
                </summary>
                <div className="preset-library-modal__details-body">
                  <textarea
                    readOnly
                    value={exportedPresetCode}
                    className="preset-library-modal__textarea"
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
