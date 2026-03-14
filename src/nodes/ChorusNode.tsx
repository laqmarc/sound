import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './ChorusNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const ChorusNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 0.8;
  const depth = data.depth ?? 0.012;
  const delay = data.delay ?? 0.02;
  const mix = data.mix ?? 0.45;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="node-chrome chorus-node">
      <div className="node-chrome__title chorus-node__title">
        <div className="node-chrome__dot chorus-node__dot" />
        Chorus
      </div>

      <div className="chorus-node__toggle">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: false })}
          className={`chorus-node__toggle-button ${!sync ? 'chorus-node__toggle-button--active' : ''}`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: true })}
          className={`chorus-node__toggle-button ${sync ? 'chorus-node__toggle-button--active' : ''}`}
        >
          Sync
        </button>
      </div>

      <div className="chorus-node__grid">
        {sync ? (
          <div className="chorus-node__division">
            <label className="chorus-node__label">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="chorus-node__select"
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
            label="Rate"
            min={0.05}
            max={6}
            step={0.01}
            value={rate}
            onChange={(value) => onDataChange(id, { rate: value })}
            color="#7dd3fc"
            unit="Hz"
            size={52}
          />
        )}
        <Knob label="Depth" min={0.001} max={0.03} step={0.001} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#7dd3fc" unit="s" size={52} />
        <Knob label="Delay" min={0.003} max={0.04} step={0.001} value={delay} onChange={(value) => onDataChange(id, { delay: value })} color="#7dd3fc" unit="s" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#7dd3fc" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Wide Mod</span>
        <div className="chorus-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-sky" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-sky" />
        </div>
      </div>
    </div>
  );
};

export default ChorusNode;
