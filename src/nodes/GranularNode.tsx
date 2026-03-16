import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/2.', '1/4', '1/4.', '1/8', '1/8.', '1/16', '1/16.'];

const GranularNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const grainSize = data.grainSize ?? 0.12;
  const spray = data.spray ?? 0.35;
  const mix = data.mix ?? 0.8;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '260px',
          '--rate-fx-accent': '#a5b4fc',
          '--rate-fx-bg': 'rgba(49, 46, 129, 0.8)',
          '--rate-fx-border': 'rgba(129, 140, 248, 0.2)',
          '--rate-fx-select-border': 'rgba(129, 140, 248, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        Granular
      </div>

      <div className="rate-fx-node__toggle">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: false })}
          className={`rate-fx-node__toggle-button ${!sync ? 'rate-fx-node__toggle-button--active' : ''}`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: true })}
          className={`rate-fx-node__toggle-button ${sync ? 'rate-fx-node__toggle-button--active' : ''}`}
        >
          Sync
        </button>
      </div>

      <div className="rate-fx-node__grid">
        {sync ? (
          <div className="rate-fx-node__division">
            <label className="rate-fx-node__label">Grain Clock</label>
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
          <Knob
            label="Size"
            min={0.02}
            max={0.5}
            step={0.01}
            value={grainSize}
            onChange={(value) => onDataChange(id, { grainSize: value })}
            color="#a5b4fc"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Spray"
          min={0}
          max={1}
          step={0.01}
          value={spray}
          onChange={(value) => onDataChange(id, { spray: value })}
          color="#a5b4fc"
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
          color="#a5b4fc"
          unit=""
          size={52}
        />
      </div>

      <div className="node-chrome__footer">
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-indigo" />
          <span className="rate-fx-node__footer-label">Grain Cloud</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-indigo" />
      </div>
    </div>
  );
};

export default GranularNode;
