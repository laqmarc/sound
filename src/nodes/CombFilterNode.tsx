import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const CombFilterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delay = data.delay ?? 0.015;
  const feedback = data.feedback ?? 0.65;
  const mix = data.mix ?? 0.7;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '250px',
          '--three-knob-accent': '#f0abfc',
          '--three-knob-bg': 'rgba(74, 4, 78, 0.8)',
          '--three-knob-border': 'rgba(232, 121, 249, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Comb Filter
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob
          label="Delay"
          min={0.001}
          max={0.05}
          step={0.0005}
          value={delay}
          onChange={(value) => onDataChange(id, { delay: value })}
          color="#f0abfc"
          unit="s"
          size={50}
        />
        <Knob
          label="Feed"
          min={0}
          max={0.95}
          step={0.01}
          value={feedback}
          onChange={(value) => onDataChange(id, { feedback: value })}
          color="#f0abfc"
          unit=""
          size={50}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#f0abfc"
          unit=""
          size={50}
        />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Resonant Teeth</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-fuchsia" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-fuchsia" />
        </div>
      </div>
    </div>
  );
};

export default CombFilterNode;
