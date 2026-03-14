import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './LFONode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const LFONode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 1;
  const gain = data.gain ?? 100;
  const waveType = (data.type as OscillatorType | undefined) ?? 'sine';
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="node-chrome lfo-node">
      <div className="node-chrome__title lfo-node__title">
        <div className="node-chrome__dot lfo-node__dot" />
        LFO (Modulator)
      </div>

      <div className="lfo-node__toggle">
        <button type="button" onClick={() => onDataChange(id, { sync: false })} className={`lfo-node__toggle-button ${!sync ? 'lfo-node__toggle-button--active' : ''}`}>Free</button>
        <button type="button" onClick={() => onDataChange(id, { sync: true })} className={`lfo-node__toggle-button ${sync ? 'lfo-node__toggle-button--active' : ''}`}>Sync</button>
      </div>

      <div className="lfo-node__grid">
        {sync ? (
          <div className="lfo-node__division">
            <label className="control-node__label">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="control-node__select"
              style={{ ['--control-accent' as string]: '#fbbf24', ['--control-select-border' as string]: '#334155' }}
            >
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Knob
            label="Freq"
            min={0.1}
            max={20}
            step={0.01}
            value={frequency}
            onChange={(value) => onDataChange(id, { frequency: value })}
            color="#fbbf24"
            size={50}
          />
        )}
        <Knob
          label="Amp"
          min={0}
          max={1000}
          step={1}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#fbbf24"
          size={50}
        />
      </div>

      <div className="lfo-node__wave-toggle">
        {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((type) => (
          <button
            type="button"
            key={type}
            onClick={() => onDataChange(id, { type })}
            className={`lfo-node__wave-button ${waveType === type ? 'lfo-node__wave-button--active' : ''}`}
          >
            {type.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Mod Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
      </div>
    </div>
  );
};

export default LFONode;
