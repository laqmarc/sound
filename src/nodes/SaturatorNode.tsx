import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const SaturatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const drive = data.drive ?? 2.4;
  const makeup = data.makeup ?? 1;
  const mix = data.mix ?? 0.8;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#fca5a5',
          '--three-knob-bg': 'rgba(127, 29, 29, 0.8)',
          '--three-knob-border': 'rgba(248, 113, 113, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Saturator
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Drive" min={1} max={10} step={0.01} value={drive} onChange={(value) => onDataChange(id, { drive: value })} color="#fca5a5" unit="" size={50} />
        <Knob label="Makeup" min={0.2} max={3} step={0.01} value={makeup} onChange={(value) => onDataChange(id, { makeup: value })} color="#fca5a5" unit="x" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fca5a5" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Warm Damage</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-red" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-red" />
        </div>
      </div>
    </div>
  );
};

export default SaturatorNode;
