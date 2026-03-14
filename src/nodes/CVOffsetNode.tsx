import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ControlNode.css';

const CVOffsetNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const offset = data.offset ?? 0;
  const gain = data.gain ?? 1;

  return (
    <div
      className="node-chrome control-node"
      style={
        {
          '--control-width': '220px',
          '--control-accent': '#d4d4d8',
          '--control-bg': 'rgba(9, 9, 11, 0.8)',
          '--control-border': 'rgba(161, 161, 170, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title control-node__title">
        <div className="node-chrome__dot control-node__dot" />
        CV Offset
      </div>

      <div className="control-node__grid-2">
        <Knob label="Offset" min={-1200} max={1200} step={1} value={offset} onChange={(value) => onDataChange(id, { offset: value })} color="#d4d4d8" unit="" size={52} />
        <Knob label="Scale" min={0} max={4} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#d4d4d8" unit="x" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="control-node__footer-title">CV Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-zinc" />
      </div>
    </div>
  );
};

export default CVOffsetNode;
