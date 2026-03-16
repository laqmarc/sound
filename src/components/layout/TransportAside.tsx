import { Volume2, VolumeX } from 'lucide-react';

import Knob from '../Knob';
import './TransportAside.css';

type RecordingChannelMode = 'stereo' | 'mono';

interface TransportState {
  isPlaying: boolean;
  step: number;
  bpm: number;
  swing: number;
}

interface RecordingState {
  isRecording: boolean;
  durationMs: number;
}

interface TransportAsideProps {
  audioStarted: boolean;
  transport: TransportState;
  recording: RecordingState;
  recordingFeedback: string;
  recordingFileName: string;
  recordingNormalize: boolean;
  recordingChannelMode: RecordingChannelMode;
  onSetTransportBpm: (value: number) => void;
  onSetTransportSwing: (value: number) => void;
  onStartAudio: () => void;
  onStopAudio: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRecordingFileNameChange: (value: string) => void;
  onRecordingNormalizeChange: (value: boolean) => void;
  onRecordingChannelModeChange: (value: RecordingChannelMode) => void;
  onResetCanvas: () => void;
  onOpenTutorial: () => void;
}

export function TransportAside({
  audioStarted,
  transport,
  recording,
  recordingFeedback,
  recordingFileName,
  recordingNormalize,
  recordingChannelMode,
  onSetTransportBpm,
  onSetTransportSwing,
  onStartAudio,
  onStopAudio,
  onStartRecording,
  onStopRecording,
  onRecordingFileNameChange,
  onRecordingNormalizeChange,
  onRecordingChannelModeChange,
  onResetCanvas,
  onOpenTutorial,
}: TransportAsideProps) {
  const minutes = Math.floor(recording.durationMs / 60000);
  const seconds = Math.floor((recording.durationMs % 60000) / 1000);
  const recordingClock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <aside className="transport-aside" data-tutorial="transport">
      <section className="transport-aside__panel" data-tutorial="transport-panel">
        <div>
          <div className="transport-aside__title">Transport</div>
          <div className="transport-aside__steps">
            {Array.from({ length: 16 }, (_, step) => (
              <div
                key={`transport-step-${step}`}
                className={`transport-aside__step ${
                  transport.step % 16 === step && transport.isPlaying
                    ? 'transport-aside__step--active'
                    : ''
                } ${step % 4 === 0 ? 'transport-aside__step--accent' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="transport-aside__state">
          <div className="transport-aside__state-label">State</div>
          <div className="transport-aside__state-value">
            {transport.isPlaying ? 'Running' : 'Stopped'}
          </div>
        </div>

        <div className="transport-aside__controls">
          <Knob
            label="BPM"
            min={60}
            max={180}
            step={1}
            value={transport.bpm}
            onChange={onSetTransportBpm}
            color="#38bdf8"
            size={54}
          />

          <div className="transport-aside__swing" data-tutorial="transport-controls">
            <label className="transport-aside__swing-label">Swing</label>
            <input
              type="range"
              min={0}
              max={0.45}
              step={0.01}
              value={transport.swing}
              onChange={(event) => onSetTransportSwing(Number(event.target.value))}
              className="transport-aside__swing-range"
            />
            <div className="transport-aside__swing-value">
              {Math.round(transport.swing * 100)}%
            </div>
          </div>
        </div>

        <div
          className={`transport-aside__recording ${recording.isRecording ? 'transport-aside__recording--active' : ''}`}
          data-tutorial="recording-panel"
        >
          <div className="transport-aside__recording-head">
            <div className="transport-aside__recording-label">Recorder</div>
            {recording.isRecording ? <div className="transport-aside__recording-badge">REC</div> : null}
          </div>
          <div className="transport-aside__recording-status">
            {recording.isRecording ? 'Recording' : audioStarted ? 'Ready' : 'Start engine first'}
          </div>
          <div className="transport-aside__recording-time">{recordingClock}</div>
          <div className="transport-aside__recording-settings">
            <label className="transport-aside__field">
              <span className="transport-aside__field-label">File</span>
              <input
                type="text"
                value={recordingFileName}
                onChange={(event) => onRecordingFileNameChange(event.target.value)}
                className="transport-aside__input"
                placeholder="quitus-session"
                disabled={recording.isRecording}
              />
            </label>

            <label className="transport-aside__field">
              <span className="transport-aside__field-label">Channels</span>
              <select
                value={recordingChannelMode}
                onChange={(event) =>
                  onRecordingChannelModeChange(event.target.value as RecordingChannelMode)
                }
                className="transport-aside__select"
                disabled={recording.isRecording}
              >
                <option value="stereo">Stereo</option>
                <option value="mono">Mono</option>
              </select>
            </label>

            <label className="transport-aside__toggle">
              <input
                type="checkbox"
                checked={recordingNormalize}
                onChange={(event) => onRecordingNormalizeChange(event.target.checked)}
                disabled={recording.isRecording}
              />
              <span>Normalize export</span>
            </label>
          </div>
          {recordingFeedback ? (
            <div className="transport-aside__recording-feedback">{recordingFeedback}</div>
          ) : null}
        </div>
      </section>

      {!audioStarted ? (
        <div className="transport-aside__actions" data-tutorial="transport-actions">
          <button
            onClick={onStartAudio}
            className="transport-aside__button transport-aside__button--start"
            data-tutorial="start-engine"
          >
            <Volume2 className="transport-aside__icon" />
            START ENGINE
          </button>
          <button
            onClick={onStartRecording}
            className="transport-aside__button transport-aside__button--record"
            disabled
            data-tutorial="record-button"
          >
            REC
          </button>
          <button
            onClick={onResetCanvas}
            className="transport-aside__button transport-aside__button--reset"
            data-tutorial="reset-canvas"
          >
            RESET
          </button>
          <button
            onClick={onOpenTutorial}
            className="transport-aside__button transport-aside__button--tutorial"
            data-tutorial="tutorial-button"
          >
            TUTORIAL
          </button>
        </div>
      ) : (
        <div className="transport-aside__actions" data-tutorial="transport-actions">
          <button
            onClick={onStopAudio}
            className="transport-aside__button transport-aside__button--stop"
            data-tutorial="start-engine"
          >
            <VolumeX className="transport-aside__icon" />
            STOP
          </button>
          <button
            onClick={recording.isRecording ? onStopRecording : onStartRecording}
            className={`transport-aside__button ${
              recording.isRecording
                ? 'transport-aside__button--recording'
                : 'transport-aside__button--record'
            }`}
            data-tutorial="record-button"
          >
            {recording.isRecording ? `STOP REC ${recordingClock}` : 'REC'}
          </button>
          <button
            onClick={onResetCanvas}
            className="transport-aside__button transport-aside__button--reset"
            data-tutorial="reset-canvas"
          >
            RESET
          </button>
          <button
            onClick={onOpenTutorial}
            className="transport-aside__button transport-aside__button--tutorial"
            data-tutorial="tutorial-button"
          >
            TUTORIAL
          </button>
        </div>
      )}
    </aside>
  );
}
