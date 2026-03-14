import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const PhaserNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 0.6;
  const depth = data.depth ?? 800;
  const feedback = data.feedback ?? 0.35;
  const mix = data.mix ?? 0.5;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '260px',
          '--rate-fx-accent': '#f0abfc',
          '--rate-fx-bg': 'rgba(112, 26, 117, 0.8)',
          '--rate-fx-border': 'rgba(232, 121, 249, 0.2)',
          '--rate-fx-select-border': 'rgba(232, 121, 249, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        Phaser
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
          <Knob label="Rate" min={0.05} max={6} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#f0abfc" unit="Hz" size={52} />
        )}
        <Knob label="Depth" min={50} max={2000} step={1} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#f0abfc" unit="" size={52} />
        <Knob label="Feedback" min={0} max={0.95} step={0.01} value={feedback} onChange={(value) => onDataChange(id, { feedback: value })} color="#f0abfc" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#f0abfc" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="rate-fx-node__footer-label">Phase Sweep</span>
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-fuchsia" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-fuchsia" />
        </div>
      </div>
    </div>
  );
};

export default PhaserNode;
