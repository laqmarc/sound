import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ControlNode.css';

const QuantizerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const divider = data.divider ?? 12;
  const mix = data.mix ?? 1;

  return (
    <div
      className="node-chrome control-node"
      style={
        {
          '--control-width': '220px',
          '--control-accent': '#e2e8f0',
          '--control-bg': 'rgba(2, 6, 23, 0.8)',
          '--control-border': 'rgba(148, 163, 184, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title control-node__title">
        <div className="node-chrome__dot control-node__dot" />
        Quantizer
      </div>

      <div className="control-node__grid-2">
        <Knob label="Steps" min={2} max={48} step={1} value={divider} onChange={(value) => onDataChange(id, { divider: value })} color="#e2e8f0" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#e2e8f0" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <div className="control-node__footer-left">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-slate" />
          <span className="control-node__footer-title">Stepped Out</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-slate" />
      </div>
    </div>
  );
};

export default QuantizerNode;
