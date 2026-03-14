import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const HumanizerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 2;
  const depth = data.depth ?? 0.35;
  const mix = data.mix ?? 0.7;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#fdba74',
          '--three-knob-bg': 'rgba(124, 45, 18, 0.8)',
          '--three-knob-border': 'rgba(251, 146, 60, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Humanizer
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Rate" min={0.1} max={10} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#fdba74" unit="Hz" size={50} />
        <Knob label="Depth" min={0} max={1} step={0.01} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#fdba74" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fdba74" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-orange" />
          <span className="three-knob-fx-node__footer-label">Loose Feel</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-orange" />
      </div>
    </div>
  );
};

export default HumanizerNode;
