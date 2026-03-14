import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const FoldbackNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const drive = data.drive ?? 2.2;
  const threshold = data.threshold ?? 0.55;
  const mix = data.mix ?? 0.75;

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
        Foldback
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob
          label="Drive"
          min={1}
          max={8}
          step={0.01}
          value={drive}
          onChange={(value) => onDataChange(id, { drive: value })}
          color="#fdba74"
          unit=""
          size={50}
        />
        <Knob
          label="Fold"
          min={0.1}
          max={1}
          step={0.01}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#fdba74"
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
          color="#fdba74"
          unit=""
          size={50}
        />
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Crushed Mirror</span>
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-orange" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-orange" />
        </div>
      </div>
    </div>
  );
};

export default FoldbackNode;
