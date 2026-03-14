import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';

const EnvelopeFollowerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.03;
  const release = data.release ?? 0.18;
  const gain = data.gain ?? 200;

  return (
    <div
      className="node-chrome three-knob-fx-node"
      style={
        {
          '--three-knob-width': '250px',
          '--three-knob-accent': '#67e8f9',
          '--three-knob-bg': 'rgba(8, 47, 73, 0.8)',
          '--three-knob-border': 'rgba(34, 211, 238, 0.2)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Env Follow
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob
          label="Attack"
          min={0.001}
          max={0.2}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#67e8f9"
          unit="s"
          size={50}
        />
        <Knob
          label="Release"
          min={0.01}
          max={1}
          step={0.001}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#67e8f9"
          unit="s"
          size={50}
        />
        <Knob
          label="Gain"
          min={1}
          max={1000}
          step={1}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#67e8f9"
          unit=""
          size={50}
        />
      </div>

      <div className="node-chrome__footer">
        <div className="three-knob-fx-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-cyan" />
          <span className="three-knob-fx-node__footer-label">Audio In</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-cyan" />
      </div>
    </div>
  );
};

export default EnvelopeFollowerNode;
