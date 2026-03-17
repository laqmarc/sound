import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './VocoderNode.css';

const VocoderNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const micEnabled = data.micEnabled ?? false;
  const gain = data.gain ?? 0.95;
  const mix = data.mix ?? 1;
  const tone = data.tone ?? 5200;
  const resonance = data.Q ?? 14;
  const attack = data.attack ?? 0.004;
  const release = data.release ?? 0.06;
  const bands = data.bands ?? 16;
  const statusText = micEnabled ? 'Mic Live' : 'Mic Armed';
  const detailText = micEnabled
    ? 'Parla al micro mentre un synth entra per Carrier.'
    : 'Activa el micro i connecta un synth al Carrier.';

  return (
    <div
      className="node-chrome vocoder-node"
      style={
        {
          '--vocoder-accent': '#a3e635',
          '--vocoder-bg': 'rgba(24, 39, 12, 0.94)',
          '--vocoder-border': 'rgba(163, 230, 53, 0.24)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title vocoder-node__title">
        <div className="node-chrome__dot vocoder-node__dot" />
        Vocoder
      </div>

      <div className="vocoder-node__status-row">
        <span className={`vocoder-node__status ${micEnabled ? 'vocoder-node__status--live' : ''}`}>
          {statusText}
        </span>
        <span className="vocoder-node__filename" title={detailText}>{detailText}</span>
      </div>

      <p className="vocoder-node__description">
        Classic vocoder: microphone inside, synth/audio coming into `Carrier`.
      </p>

      <div className="vocoder-node__toolbar">
        <div className="vocoder-node__actions">
          <button
            type="button"
            className={`vocoder-node__button ${micEnabled ? 'vocoder-node__button--live' : ''}`}
            onClick={() => onDataChange(id, { micEnabled: !micEnabled })}
          >
            {micEnabled ? 'Stop Mic' : 'Start Mic'}
          </button>
        </div>
      </div>

      <div className="vocoder-node__grid">
        <Knob
          label="Tone"
          min={1200}
          max={9000}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#a3e635"
          unit="Hz"
          size={48}
        />
        <Knob
          label="Q"
          min={4}
          max={24}
          step={0.1}
          value={resonance}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#a3e635"
          unit=""
          size={48}
        />
        <Knob
          label="Bands"
          min={8}
          max={18}
          step={1}
          value={bands}
          onChange={(value) => onDataChange(id, { bands: Math.round(value) })}
          color="#a3e635"
          unit=""
          size={48}
        />
        <Knob
          label="Attack"
          min={0.001}
          max={0.05}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#84cc16"
          unit="s"
          size={48}
        />
        <Knob
          label="Release"
          min={0.02}
          max={0.24}
          step={0.005}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#84cc16"
          unit="s"
          size={48}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#84cc16"
          unit=""
          size={48}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#84cc16"
          unit=""
          size={48}
        />
      </div>

      <Handle type="target" position={Position.Left} id="carrier" className="node-handle--pitch" style={{ top: '30%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--sub">Carrier</div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Classic Vocoder</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-lime" />
      </div>
    </div>
  );
};

export default VocoderNode;
