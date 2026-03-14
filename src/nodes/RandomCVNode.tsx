import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './ControlNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const RandomCVNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const minValue = data.minValue ?? -300;
  const maxValue = data.maxValue ?? 300;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div
      className="node-chrome control-node"
      style={
        {
          '--control-width': '250px',
          '--control-accent': '#86efac',
          '--control-bg': 'rgba(6, 78, 59, 0.8)',
          '--control-border': 'rgba(52, 211, 153, 0.2)',
          '--control-select-border': 'rgba(52, 211, 153, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title control-node__title">
        <div className="node-chrome__dot control-node__dot" />
        Random CV
      </div>

      <div className="control-node__grid-2">
        <Knob label="Min" min={-1200} max={1200} step={1} value={minValue} onChange={(value) => onDataChange(id, { minValue: value })} color="#86efac" unit="" size={52} />
        <Knob label="Max" min={-1200} max={1200} step={1} value={maxValue} onChange={(value) => onDataChange(id, { maxValue: value })} color="#86efac" unit="" size={52} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label className="control-node__label">Step Rate</label>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="control-node__select"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="node-chrome__footer">
        <span className="control-node__footer-title">Chaos Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald" />
      </div>
    </div>
  );
};

export default RandomCVNode;
