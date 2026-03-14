import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './RateFxNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const FreezeFxNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const loopLength = data.loopLength ?? 0.35;
  const mix = data.mix ?? 0.9;
  const freeze = data.freeze ?? false;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div
      className="node-chrome rate-fx-node"
      style={
        {
          '--rate-fx-width': '250px',
          '--rate-fx-accent': '#7dd3fc',
          '--rate-fx-bg': 'rgba(8, 47, 73, 0.8)',
          '--rate-fx-border': 'rgba(56, 189, 248, 0.2)',
          '--rate-fx-select-border': 'rgba(56, 189, 248, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title rate-fx-node__title">
        <div className="node-chrome__dot rate-fx-node__dot" />
        Freeze
      </div>

      <div className="rate-fx-node__toggle">
        <button
          type="button"
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`rate-fx-node__toggle-button ${freeze ? 'rate-fx-node__toggle-button--active' : ''}`}
        >
          {freeze ? 'Frozen' : 'Live'}
        </button>
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
            <label className="rate-fx-node__label">Window</label>
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
            label="Window"
            min={0.05}
            max={1}
            step={0.01}
            value={loopLength}
            onChange={(value) => onDataChange(id, { loopLength: value })}
            color="#7dd3fc"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#7dd3fc"
          unit=""
          size={52}
        />
      </div>

      <div className="node-chrome__footer">
        <div className="rate-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-sky" />
          <span className="rate-fx-node__footer-label">Frozen Slice</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-sky" />
      </div>
    </div>
  );
};

export default FreezeFxNode;
