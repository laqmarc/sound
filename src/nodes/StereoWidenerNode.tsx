import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const StereoWidenerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delay = data.delay ?? 0.012;
  const spread = data.spread ?? 1;
  const mix = data.mix ?? 0.65;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '250px',
          '--three-knob-accent': '#93c5fd',
          '--three-knob-bg': 'rgba(30, 58, 138, 0.8)',
          '--three-knob-border': 'rgba(96, 165, 250, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Stereo Widener
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob label="Delay" min={0.001} max={0.03} step={0.001} value={delay} onChange={(value) => onDataChange(id, { delay: value })} color="#93c5fd" unit="s" size={50} />
        <Knob label="Width" min={0} max={2} step={0.01} value={spread} onChange={(value) => onDataChange(id, { spread: value })} color="#93c5fd" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#93c5fd" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Wide Beam</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-blue" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-blue" />
        </div>
      </div>
    </div>
  );
};

export default StereoWidenerNode;
