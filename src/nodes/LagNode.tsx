import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const LagNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.02;
  const release = data.release ?? 0.08;
  const mix = data.mix ?? 1;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#5eead4',
          '--three-knob-bg': 'rgba(19, 78, 74, 0.8)',
          '--three-knob-border': 'rgba(45, 212, 191, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Lag
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Rise" min={0.001} max={0.2} step={0.001} value={attack} onChange={(value) => onDataChange(id, { attack: value })} color="#5eead4" unit="s" size={50} />
        <Knob label="Fall" min={0.001} max={0.5} step={0.001} value={release} onChange={(value) => onDataChange(id, { release: value })} color="#5eead4" unit="s" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#5eead4" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-teal" />
          <span className="three-knob-fx-node__footer-label">Slew Out</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-teal" />
      </div>
    </div>
  );
};

export default LagNode;
