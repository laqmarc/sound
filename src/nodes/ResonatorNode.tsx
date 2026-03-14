import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const ResonatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 440;
  const Q = data.Q ?? 12;
  const spread = data.spread ?? 7;
  const mix = data.mix ?? 0.7;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '250px',
          '--three-knob-accent': '#5eead4',
          '--three-knob-bg': 'rgba(19, 78, 74, 0.8)',
          '--three-knob-border': 'rgba(45, 212, 191, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Resonator
      </div>

      <div className="three-knob-fx-node__grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <Knob label="Tune" min={80} max={2400} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#5eead4" unit="Hz" size={52} />
        <Knob label="Q" min={0.5} max={24} step={0.1} value={Q} onChange={(value) => onDataChange(id, { Q: value })} color="#5eead4" unit="" size={52} />
        <Knob label="Spread" min={1} max={24} step={0.1} value={spread} onChange={(value) => onDataChange(id, { spread: value })} color="#5eead4" unit="st" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#5eead4" unit="" size={52} />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Metal Body</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-teal" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-teal" />
        </div>
      </div>
    </div>
  );
};

export default ResonatorNode;
