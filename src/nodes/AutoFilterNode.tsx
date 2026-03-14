import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const AutoFilterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 0.8;
  const depth = data.depth ?? 2200;
  const tone = data.tone ?? 800;
  const q = data.Q ?? 1.2;
  const mix = data.mix ?? 0.85;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';
  const filterType = (data.type as BiquadFilterType | undefined) ?? 'lowpass';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '280px',
          '--rate-fx-accent': '#c4b5fd',
          '--rate-fx-bg': 'rgba(76, 29, 149, 0.8)',
          '--rate-fx-border': 'rgba(167, 139, 250, 0.2)',
          '--rate-fx-select-border': 'rgba(167, 139, 250, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        AutoFilter
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
          <Knob label="Rate" min={0.05} max={12} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#c4b5fd" unit="Hz" size={52} />
        )}
        <Knob label="Base" min={60} max={8000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#c4b5fd" unit="Hz" size={52} />
        <Knob label="Sweep" min={50} max={6000} step={1} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#c4b5fd" unit="" size={52} />
        <Knob label="Q" min={0.2} max={18} step={0.1} value={q} onChange={(value) => onDataChange(id, { Q: value })} color="#c4b5fd" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#c4b5fd" unit="" size={52} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label className="rate-fx-node__label">Filter</label>
        <select
          value={filterType}
          onChange={(event) => onDataChange(id, { type: event.target.value as BiquadFilterType })}
          className="rate-fx-node__select"
        >
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
          <option value="notch">Notch</option>
        </select>
      </div>

      <div className="node-chrome__footer">
        <span className="rate-fx-node__footer-label">Sweep Core</span>
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-violet" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-violet" />
        </div>
      </div>
    </div>
  );
};

export default AutoFilterNode;
