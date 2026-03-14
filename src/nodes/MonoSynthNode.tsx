import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './MonoSynthNode.css';

const MonoSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const gain = data.gain ?? 0.35;
  const cutoff = data.tone ?? 1800;
  const resonance = data.Q ?? 0.8;
  const waveType = (data.type as OscillatorType | undefined) ?? 'sawtooth';

  return (
    <div className="node-chrome mono-synth-node">
      <div className="node-chrome__title mono-synth-node__title">
        <div className="node-chrome__dot mono-synth-node__dot" />
        Mono Synth
      </div>

      <div className="mono-synth-node__grid">
        <Knob label="Pitch" min={20} max={1200} step={1} value={frequency} onChange={(value) => onDataChange(id, { frequency: value })} color="#6ee7b7" unit="Hz" size={52} />
        <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#6ee7b7" unit="" size={52} />
        <Knob label="Cutoff" min={80} max={12000} step={10} value={cutoff} onChange={(value) => onDataChange(id, { tone: value })} color="#6ee7b7" unit="Hz" size={52} />
        <Knob label="Reso" min={0.1} max={20} step={0.1} value={resonance} onChange={(value) => onDataChange(id, { Q: value })} color="#6ee7b7" unit="" size={52} />
      </div>

      <select
        value={waveType}
        onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
        className="mono-synth-node__select"
      >
        <option value="sawtooth">Saw</option>
        <option value="square">Square</option>
        <option value="triangle">Triangle</option>
        <option value="sine">Sine</option>
      </select>

      <Handle type="target" position={Position.Left} id="pitch" className="node-handle--pitch" style={{ top: '30%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--sub">Pitch</div>

      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald" />
    </div>
  );
};

export default MonoSynthNode;
