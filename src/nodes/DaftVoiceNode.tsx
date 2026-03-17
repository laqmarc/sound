import type { CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './VocoderNode.css';

const DaftVoiceNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const micEnabled = data.micEnabled ?? false;
  const gain = data.gain ?? 0.95;
  const mix = data.mix ?? 1;
  const tone = data.tone ?? 2600;
  const resonance = data.Q ?? 8;
  const robotFrequency = data.frequency ?? 96;
  const drive = data.drive ?? 2.4;
  const statusText = micEnabled ? 'Mic Live' : 'Mic Armed';
  const detailText = micEnabled
    ? 'Parla al micro. Aquest node fa veu robot híbrida.'
    : 'Activa el micro i parla directament al node.';

  return (
    <div
      className="node-chrome vocoder-node"
      style={
        {
          '--vocoder-accent': '#f97316',
          '--vocoder-bg': 'rgba(44, 24, 9, 0.96)',
          '--vocoder-border': 'rgba(249, 115, 22, 0.26)',
        } as CSSProperties
      }
    >
      <div className="node-chrome__title vocoder-node__title">
        <div className="node-chrome__dot vocoder-node__dot" />
        Daft Voice
      </div>

      <div className="vocoder-node__status-row">
        <span className={`vocoder-node__status ${micEnabled ? 'vocoder-node__status--live' : ''}`}>
          {statusText}
        </span>
        <span className="vocoder-node__filename" title={detailText}>{detailText}</span>
      </div>

      <p className="vocoder-node__description">
        Hybrid robot voice for microphone only. Fast to understand, very synthetic.
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
          label="Robot"
          min={40}
          max={220}
          step={1}
          value={robotFrequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#fb923c"
          unit="Hz"
          size={48}
        />
        <Knob
          label="Tone"
          min={900}
          max={7000}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#fb923c"
          unit="Hz"
          size={48}
        />
        <Knob
          label="Q"
          min={1}
          max={18}
          step={0.1}
          value={resonance}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#fb923c"
          unit=""
          size={48}
        />
        <Knob
          label="Drive"
          min={1}
          max={4.5}
          step={0.1}
          value={drive}
          onChange={(value) => onDataChange(id, { drive: value })}
          color="#fdba74"
          unit=""
          size={48}
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
          size={48}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#fdba74"
          unit=""
          size={48}
        />
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Mic Robot</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-lime" />
      </div>
    </div>
  );
};

export default DaftVoiceNode;
