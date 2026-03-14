import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const WahNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 1.5;
  const depth = data.depth ?? 900;
  const tone = data.tone ?? 700;
  const Q = data.Q ?? 8;
  const mix = data.mix ?? 0.75;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '260px',
          '--rate-fx-accent': '#fde68a',
          '--rate-fx-bg': 'rgba(113, 63, 18, 0.8)',
          '--rate-fx-border': 'rgba(250, 204, 21, 0.2)',
          '--rate-fx-select-border': 'rgba(250, 204, 21, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        Wah
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
          <Knob label="Rate" min={0.05} max={10} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#fde68a" unit="Hz" size={52} />
        )}
        <Knob label="Base" min={120} max={2000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fde68a" unit="Hz" size={52} />
        <Knob label="Sweep" min={50} max={3000} step={1} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#fde68a" unit="" size={52} />
        <Knob label="Q" min={0.5} max={18} step={0.1} value={Q} onChange={(value) => onDataChange(id, { Q: value })} color="#fde68a" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fde68a" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="rate-fx-node__footer-label">Talk Box</span>
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-amber" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
        </div>
      </div>
    </div>
  );
};

export default WahNode;
