import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ControlNode.css';

const ComparatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const threshold = data.threshold ?? 0;

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
        Comparator
      </div>

      <div className="control-node__knob">
        <Knob label="Thresh" min={-1} max={1} step={0.01} value={threshold} onChange={(value) => onDataChange(id, { threshold: value })} color="#d4d4d8" unit="" size={56} />
      </div>

      <div className="node-chrome__footer">
        <div className="control-node__footer-left">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-zinc" />
          <span className="control-node__footer-title">Gate Out</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-zinc" />
      </div>
    </div>
  );
};

export default ComparatorNode;
