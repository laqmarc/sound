import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const TiltEQNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 900;
  const tilt = data.tilt ?? 0;
  const mix = data.mix ?? 1;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#bef264',
          '--three-knob-bg': 'rgba(63, 98, 18, 0.8)',
          '--three-knob-border': 'rgba(163, 230, 53, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Tilt EQ
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Pivot" min={120} max={4000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#bef264" unit="Hz" size={50} />
        <Knob label="Tilt" min={-18} max={18} step={0.1} value={tilt} onChange={(value) => onDataChange(id, { tilt: value })} color="#bef264" unit="dB" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#bef264" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Balance Bar</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-lime" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-lime" />
        </div>
      </div>
    </div>
  );
};

export default TiltEQNode;
