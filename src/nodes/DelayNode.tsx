import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './DelayNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const DelayNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delayTime = data.delayTime ?? 0.3;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div className="node-chrome delay-node">
      <div className="node-chrome__title delay-node__title">
        <div className="node-chrome__dot delay-node__dot" />
        Eco (Delay)
      </div>

      <div className="delay-node__mode-toggle">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: false })}
          className={`delay-node__mode-button ${!sync ? 'delay-node__mode-button--active' : ''}`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: true })}
          className={`delay-node__mode-button ${sync ? 'delay-node__mode-button--active' : ''}`}
        >
          Sync
        </button>
      </div>

      {sync ? (
        <div>
          <label className="delay-node__label">Division</label>
          <select
            value={syncDivision}
            onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
            className="delay-node__select"
          >
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="delay-node__knob">
          <Knob
            label="Temps Eco"
            min={0}
            max={1}
            step={0.01}
            value={delayTime}
            onChange={(value) => onDataChange(id, { delayTime: value })}
            color="#fbbf24"
            unit="s"
            size={60}
          />
        </div>
      )}

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-amber" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
    </div>
  );
};

export default DelayNode;
