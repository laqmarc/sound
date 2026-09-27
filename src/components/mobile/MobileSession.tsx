import { useState } from 'react';
import type { PatchPreset } from '../../presetLibrary';

interface Props {
  presets: PatchPreset[];
  saved: PatchPreset[];
  onLoad: (id: string, saved: boolean) => Promise<void>;
  name: string;
  onName: (value: string) => void;
  onSave: () => void;
  onReset: () => Promise<void>;
  busy: boolean;
  started: boolean;
  recording: { isRecording: boolean; durationMs: number };
  onRecord: () => void;
  recordingName: string;
  onRecordingName: (value: string) => void;
  normalize: boolean;
  onNormalize: (value: boolean) => void;
  channelMode: 'stereo' | 'mono';
  onChannelMode: (value: 'stereo' | 'mono') => void;
  feedback: string;
}

export function MobileSession(props: Props) {
  const [preset, setPreset] = useState('');
  const [message, setMessage] = useState('');
  const [loadMessage, setLoadMessage] = useState('');
  const [resetPending, setResetPending] = useState(false);
  const clock = `${Math.floor(props.recording.durationMs / 60000)}:${String(Math.floor(props.recording.durationMs / 1000) % 60).padStart(2, '0')}`;
  return (
    <>
      <section className="mobile-card">
        <h2>Guarda el teu patch</h2>
        <p className="mobile-hint">
          Es desa en aquest navegador. Un mateix nom actualitza el patch
          guardat.
        </p>
        <label className="mobile-field">
          Nom del patch
          <input
            value={props.name}
            placeholder="El meu experiment"
            onChange={(event) => props.onName(event.target.value)}
          />
        </label>
        <button
          className="mobile-primary"
          disabled={props.busy}
          onClick={() => {
            try {
              props.onSave();
              setMessage('Patch guardat en aquest navegador.');
            } catch {
              setMessage('No s’ha pogut guardar. Comprova que el navegador permeti desar dades i que hi hagi espai.');
            }
          }}
        >
          Guardar patch
        </button>
        <p className="mobile-feedback" role="status">
          {message}
        </p>
      </section>
      <section className="mobile-card">
        <h2>Carrega un patch</h2>
        <label className="mobile-field">
          Biblioteca
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
          >
            <option value="">Tria un patch</option>
            <optgroup label="Els teus patches">
              {props.saved.map((entry) => (
                <option key={entry.id} value={`saved:${entry.id}`}>
                  {entry.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Patches preparats">
              {props.presets.map((entry) => (
                <option key={entry.id} value={`builtin:${entry.id}`}>
                  {entry.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <p className="mobile-hint">
          Substitueix les màquines actuals. Guarda primer el que vulguis
          conservar.
        </p>
        <button
          className="mobile-primary"
          disabled={!preset || props.busy}
          onClick={async () => {
            await props.onLoad(
              preset.slice(preset.indexOf(':') + 1),
              preset.startsWith('saved:'),
            );
            setLoadMessage('Patch carregat. Torna a Tocar per editar-lo.');
          }}
        >
          Carregar patch
        </button>
        <p className="mobile-feedback" role="status">{loadMessage}</p>
      </section>
      <section className="mobile-card">
        <h2>
          Grava el que sona <span aria-live="off">· {clock}</span>
        </h2>
        <label className="mobile-field">
          Nom de l’àudio
          <input
            value={props.recordingName}
            placeholder="quitus-session"
            disabled={props.recording.isRecording}
            onChange={(event) => props.onRecordingName(event.target.value)}
          />
        </label>
        <label className="mobile-field">
          Canals
          <select
            value={props.channelMode}
            disabled={props.recording.isRecording}
            onChange={(event) =>
              props.onChannelMode(event.target.value as 'mono' | 'stereo')
            }
          >
            <option value="stereo">Estèreo</option>
            <option value="mono">Mono</option>
          </select>
        </label>
        <label className="mobile-check">
          <input
            type="checkbox"
            checked={props.normalize}
            disabled={props.recording.isRecording}
            onChange={(event) => props.onNormalize(event.target.checked)}
          />{' '}
          Normalitzar el volum de l’exportació
        </label>
        <button
          className="mobile-primary mobile-record"
          disabled={!props.started || props.busy}
          onClick={props.onRecord}
        >
          {props.recording.isRecording
            ? 'Aturar i descarregar WAV'
            : 'Gravar la sessió'}
        </button>
        <p className="mobile-hint">
          {props.started
            ? 'En aturar la gravació es descarrega un fitxer WAV.'
            : 'Prem Play abans de gravar.'}
        </p>
        <p className="mobile-feedback" role="status">
          {props.feedback}
        </p>
      </section>
      <div className="mobile-delete">
        {resetPending ? (
          <>
            <p>
              Tornar al patch inicial? Guarda abans els canvis que vulguis
              conservar.
            </p>
            <div className="mobile-row">
              <button onClick={() => setResetPending(false)}>Conservar</button>
              <button
                className="mobile-danger"
                disabled={props.busy}
                onClick={async () => {
                  await props.onReset();
                  setResetPending(false);
                }}
              >
                Tornar a començar
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setResetPending(true)}>
            Tornar al patch inicial
          </button>
        )}
      </div>
    </>
  );
}
