import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './DualOscNode.css';

const DualOscNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const gain = data.gain ?? 0.35;
  const detune = data.detune ?? 12;
  const blend = data.blend ?? 0.5;
  const waveA = (data.type as OscillatorType | undefined) ?? 'sawtooth';
  const waveB = data.modType ?? 'square';

  return (
    <div className="node-chrome dual-osc-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Dual Osc
      </div>

      <div className="node-chrome__grid-2">
        <Knob
          label="Pitch"
          min={20}
          max={2000}
          step={1}
          value={frequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#67e8f9"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
        <Knob
          label="Detune"
          min={0}
          max={50}
          step={0.1}
          value={detune}
          onChange={(value) => onDataChange(id, { detune: value })}
          color="#67e8f9"
          unit="ct"
          size={52}
        />
        <Knob
          label="Blend"
          min={0}
          max={1}
          step={0.01}
          value={blend}
          onChange={(value) => onDataChange(id, { blend: value })}
          color="#67e8f9"
          unit=""
          size={52}
        />
      </div>

      <div className="dual-osc-node__select-grid">
        <div>
          <label className="node-chrome__field-label">Osc A</label>
          <select
            value={waveA}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="node-chrome__select"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Osc B</label>
          <select
            value={waveB}
            onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
            className="node-chrome__select"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="pitch" className="node-handle--pitch" style={{ top: '30%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--osc">Pitch</div>
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-cyan" />
    </div>
  );
};

export default DualOscNode;
