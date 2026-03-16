import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './SpectralDelayNode.css';
const SpectralDelayNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delayTime = data.delayTime ?? 0.18;
  const spread = data.spread ?? 0.45;
  const texture = data.texture ?? 0.55;
  const feedback = data.feedback ?? 0.42;
  const mix = data.mix ?? 0.72;
  const tone = data.tone ?? 1600;
  return (
    <div
      className="node-chrome spectral-delay-node"
      style={
        {
          '--spectral-delay-accent': '#67e8f9',
          '--spectral-delay-bg': 'rgba(8, 47, 73, 0.82)',
          '--spectral-delay-border': 'rgba(103, 232, 249, 0.18)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title spectral-delay-node__title">
        <div className="node-chrome__dot spectral-delay-node__dot" />
        Spectral Delay
      </div>
      <div className="spectral-delay-node__description">
        Prism echoes split in bands and bounce around the stereo field.
      </div>
      <div className="spectral-delay-node__grid">
        <Knob
          label="Time"
          min={0.02}
          max={0.8}
          step={0.01}
          value={delayTime}
          onChange={(value) => onDataChange(id, { delayTime: value })}
          color="#67e8f9"
          unit="s"
          size={52}
        />
        <Knob
          label="Spread"
          min={0}
          max={1}
          step={0.01}
          value={spread}
          onChange={(value) => onDataChange(id, { spread: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
        <Knob
          label="Texture"
          min={0}
          max={1}
          step={0.01}
          value={texture}
          onChange={(value) => onDataChange(id, { texture: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
        <Knob
          label="Feedback"
          min={0}
          max={0.92}
          step={0.01}
          value={feedback}
          onChange={(value) => onDataChange(id, { feedback: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
        <Knob
          label="Tone"
          min={180}
          max={5200}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#67e8f9"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
      </div>
      <div className="node-chrome__footer">
        <div className="spectral-delay-node__handles">
          <Handle
            type="target"
            position={Position.Left}
            className="node-handle--source node-handle--source-cyan"
          />
          <span className="spectral-delay-node__footer-label">Prism Echo</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle--source node-handle--source-cyan"
        />
      </div>
    </div>
  );
};
export default SpectralDelayNode;