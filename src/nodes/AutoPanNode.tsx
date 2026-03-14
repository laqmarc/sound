import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const AutoPanNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 0.5;
  const depth = data.depth ?? 1;
  const mix = data.mix ?? 1;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '260px',
          '--rate-fx-accent': '#f9a8d4',
          '--rate-fx-bg': 'rgba(131, 24, 67, 0.8)',
          '--rate-fx-border': 'rgba(244, 114, 182, 0.2)',
          '--rate-fx-select-border': 'rgba(244, 114, 182, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        AutoPan
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
          <Knob label="Rate" min={0.05} max={12} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#f9a8d4" unit="Hz" size={52} />
        )}
        <Knob label="Depth" min={0} max={1} step={0.01} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#f9a8d4" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#f9a8d4" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="rate-fx-node__footer-label">Stereo Sweep</span>
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-pink" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-pink" />
        </div>
      </div>
    </div>
  );
};

export default AutoPanNode;
