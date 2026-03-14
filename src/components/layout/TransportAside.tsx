import { Volume2, VolumeX } from 'lucide-react';

import Knob from '../Knob';
import './TransportAside.css';

interface TransportState {
  isPlaying: boolean;
  step: number;
  bpm: number;
  swing: number;
}

interface TransportAsideProps {
  audioStarted: boolean;
  transport: TransportState;
  onSetTransportBpm: (value: number) => void;
  onSetTransportSwing: (value: number) => void;
  onStartAudio: () => void;
  onStopAudio: () => void;
  onResetCanvas: () => void;
}

export function TransportAside({
  audioStarted,
  transport,
  onSetTransportBpm,
  onSetTransportSwing,
  onStartAudio,
  onStopAudio,
  onResetCanvas,
}: TransportAsideProps) {
  return (
    <aside className="transport-aside">
      <section className="transport-aside__panel">
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

          <div className="transport-aside__swing">
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
      </section>

      {!audioStarted ? (
        <div className="transport-aside__actions">
          <button
            onClick={onStartAudio}
            className="transport-aside__button transport-aside__button--start"
          >
            <Volume2 className="transport-aside__icon" />
            START ENGINE
          </button>
          <button
            onClick={onResetCanvas}
            className="transport-aside__button transport-aside__button--reset"
          >
            RESET
          </button>
        </div>
      ) : (
        <div className="transport-aside__actions">
          <button
            onClick={onStopAudio}
            className="transport-aside__button transport-aside__button--stop"
          >
            <VolumeX className="transport-aside__icon" />
            STOP
          </button>
          <button
            onClick={onResetCanvas}
            className="transport-aside__button transport-aside__button--reset"
          >
            RESET
          </button>
        </div>
      )}
    </aside>
  );
}
