import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './LooperNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const LooperNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const loopLength = data.loopLength ?? 0.5;
  const mix = data.mix ?? 0.8;
  const feedback = data.feedback ?? 0.2;
  const freeze = data.freeze ?? false;
  const sync = data.sync ?? true;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="node-chrome looper-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Looper
      </div>

      <div className="looper-node__actions">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`looper-node__action ${sync ? 'looper-node__action--active' : ''}`}
        >
          {sync ? 'Sync' : 'Free'}
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`looper-node__action ${freeze ? 'looper-node__action--active' : ''}`}
        >
          {freeze ? 'Frozen' : 'Record'}
        </button>
      </div>

      <div className="looper-node__grid">
        {sync ? (
          <div className="looper-node__division">
            <label className="node-chrome__field-label">Loop Size</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="node-chrome__select"
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
            label="Length"
            min={0.05}
            max={2}
            step={0.01}
            value={loopLength}
            onChange={(value) => onDataChange(id, { loopLength: value })}
            color="#bef264"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Feed"
          min={0}
          max={0.95}
          step={0.01}
          value={feedback}
          onChange={(value) => onDataChange(id, { feedback: value })}
          color="#bef264"
          unit=""
          size={52}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#bef264"
          unit=""
          size={52}
        />
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Capture Loop</span>
        <div className="looper-node__footer-handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-lime" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-lime" />
        </div>
      </div>
    </div>
  );
};

export default LooperNode;
