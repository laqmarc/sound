import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './LeadVoiceNode.css';

const LeadVoiceNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 330;
  const tone = data.tone ?? 2200;
  const q = data.Q ?? 0.8;
  const gain = data.gain ?? 0.3;
  const glide = data.glide ?? 0.04;
  const wave = (data.type as OscillatorType | undefined) ?? 'sawtooth';

  return (
    <div className="node-chrome lead-voice-node">
      <div className="node-chrome__title lead-voice-node__title">
        <div className="node-chrome__dot lead-voice-node__dot" />
        Lead Voice
      </div>

      <div className="node-chrome__grid-2">
        <Knob
          label="Pitch"
          min={20}
          max={2000}
          step={1}
          value={frequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#fda4af"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Tone"
          min={120}
          max={8000}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#fda4af"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Q"
          min={0.1}
          max={16}
          step={0.1}
          value={q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#fda4af"
          unit=""
          size={52}
        />
        <Knob
          label="Glide"
          min={0}
          max={0.2}
          step={0.001}
          value={glide}
          onChange={(value) => onDataChange(id, { glide: value })}
          color="#fda4af"
          unit="s"
          size={52}
        />
      </div>

      <div className="node-chrome__grid-2 node-chrome__grid-2--compact">
        <select
          value={wave}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="node-chrome__select"
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Saw</option>
          <option value="triangle">Triangle</option>
        </select>
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#fda4af"
          unit=""
          size={52}
        />
      </div>

      <Handle type="target" position={Position.Left} id="pitch" className="node-handle--pitch" style={{ top: '28%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--lead">Pitch</div>
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-rose" />
    </div>
  );
};

export default LeadVoiceNode;
