import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const TransientShaperNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.7;
  const sustain = data.sustain ?? 0;
  const mix = data.mix ?? 1;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#f0abfc',
          '--three-knob-bg': 'rgba(112, 26, 117, 0.8)',
          '--three-knob-border': 'rgba(232, 121, 249, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Transient
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Attack" min={-1} max={1} step={0.01} value={attack} onChange={(value) => onDataChange(id, { attack: value })} color="#f0abfc" unit="" size={50} />
        <Knob label="Sustain" min={-1} max={1} step={0.01} value={sustain} onChange={(value) => onDataChange(id, { sustain: value })} color="#f0abfc" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#f0abfc" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-fuchsia" />
          <span className="three-knob-fx-node__footer-label">Punch Box</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-fuchsia" />
      </div>
    </div>
  );
};

export default TransientShaperNode;
