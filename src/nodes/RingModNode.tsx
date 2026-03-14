import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const RingModNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const modFrequency = data.modFrequency ?? 60;
  const depth = data.depth ?? 1;
  const mix = data.mix ?? 0.8;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '260px',
          '--rate-fx-accent': '#fda4af',
          '--rate-fx-bg': 'rgba(136, 19, 55, 0.8)',
          '--rate-fx-border': 'rgba(251, 113, 133, 0.2)',
          '--rate-fx-select-border': 'rgba(251, 113, 133, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        Ring Mod
      </div>

      <div className="rate-fx-node__toggle">
        <button type="button" onClick={() => onDataChange(id, { sync: false })} className={`rate-fx-node__toggle-button ${!sync ? 'rate-fx-node__toggle-button--active' : ''}`}>Free</button>
        <button type="button" onClick={() => onDataChange(id, { sync: true })} className={`rate-fx-node__toggle-button ${sync ? 'rate-fx-node__toggle-button--active' : ''}`}>Sync</button>
      </div>

      <div className="rate-fx-node__grid">
        {sync ? (
          <div className="rate-fx-node__division">
            <label className="rate-fx-node__label">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="rate-fx-node__select"
            >
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Knob label="Freq" min={0.1} max={1200} step={0.1} value={modFrequency} onChange={(value) => onDataChange(id, { modFrequency: value })} color="#fda4af" unit="Hz" size={52} />
        )}
        <Knob label="Depth" min={0} max={1} step={0.01} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#fda4af" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fda4af" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="rate-fx-node__footer-label">Metal AM</span>
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-rose" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-rose" />
        </div>
      </div>
    </div>
  );
};

export default RingModNode;
