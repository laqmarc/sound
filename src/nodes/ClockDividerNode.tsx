import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './ControlNode.css';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const ClockDividerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div
      className="node-chrome control-node"
      style={
        {
          '--control-width': '220px',
          '--control-accent': '#d4d4d8',
          '--control-bg': 'rgba(9, 9, 11, 0.8)',
          '--control-border': 'rgba(161, 161, 170, 0.2)',
          '--control-select-border': 'rgba(161, 161, 170, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title control-node__title">
        <div className="node-chrome__dot control-node__dot" />
        Clock Divider
      </div>

      <div>
        <label className="control-node__label">Division</label>
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
        <span className="control-node__footer-title">Pulse Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-zinc" />
      </div>
    </div>
  );
};

export default ClockDividerNode;
