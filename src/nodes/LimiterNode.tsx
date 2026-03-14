import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const LimiterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const threshold = data.threshold ?? -6;
  const release = data.release ?? 0.08;
  const makeup = data.makeup ?? 1;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '220px',
          '--three-knob-accent': '#fca5a5',
          '--three-knob-bg': 'rgba(127, 29, 29, 0.8)',
          '--three-knob-border': 'rgba(248, 113, 113, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Limiter
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Thresh" min={-24} max={0} step={0.5} value={threshold} onChange={(value) => onDataChange(id, { threshold: value })} color="#fca5a5" unit="dB" size={50} />
        <Knob label="Release" min={0.01} max={0.4} step={0.005} value={release} onChange={(value) => onDataChange(id, { release: value })} color="#fca5a5" unit="s" size={50} />
        <Knob label="Makeup" min={0.5} max={3} step={0.01} value={makeup} onChange={(value) => onDataChange(id, { makeup: value })} color="#fca5a5" unit="x" size={50} />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Brickwall</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-red" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-red" />
        </div>
      </div>
    </div>
  );
};

export default LimiterNode;
