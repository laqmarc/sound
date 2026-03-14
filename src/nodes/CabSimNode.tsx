import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const CabSimNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 2600;
  const q = data.Q ?? 0.8;
  const mix = data.mix ?? 1;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '240px',
          '--three-knob-accent': '#d6d3d1',
          '--three-knob-bg': 'rgba(41, 37, 36, 0.8)',
          '--three-knob-border': 'rgba(168, 162, 158, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Cab Sim
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Tone" min={800} max={6000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#d6d3d1" unit="Hz" size={50} />
        <Knob label="Reso" min={0.2} max={3} step={0.01} value={q} onChange={(value) => onDataChange(id, { Q: value })} color="#d6d3d1" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#d6d3d1" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-stone" />
          <span className="three-knob-fx-node__footer-label">Speaker Box</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-stone" />
      </div>
    </div>
  );
};

export default CabSimNode;
