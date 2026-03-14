import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './FMSynthNode.css';

const FMSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const modFrequency = data.modFrequency ?? 220;
  const modAmount = data.modAmount ?? 180;
  const gain = data.gain ?? 0.35;
  const carrierType = (data.type as OscillatorType | undefined) ?? 'sine';
  const modType = data.modType ?? 'sine';

  return (
    <div className="node-chrome fm-synth-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        FM Synth
      </div>

      <div className="node-chrome__grid-2">
        <Knob
          label="Carrier"
          min={20}
          max={1200}
          step={1}
          value={frequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#5eead4"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Mod Freq"
          min={0.1}
          max={1200}
          step={0.1}
          value={modFrequency}
          onChange={(value) => onDataChange(id, { modFrequency: value })}
          color="#5eead4"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Index"
          min={0}
          max={1000}
          step={1}
          value={modAmount}
          onChange={(value) => onDataChange(id, { modAmount: value })}
          color="#5eead4"
          unit=""
          size={52}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#5eead4"
          unit=""
          size={52}
        />
      </div>

      <div className="node-chrome__grid-2 node-chrome__grid-2--compact">
        <select
          value={carrierType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="node-chrome__select"
        >
          <option value="sine">Carrier Sine</option>
          <option value="square">Carrier Square</option>
          <option value="sawtooth">Carrier Saw</option>
          <option value="triangle">Carrier Triangle</option>
        </select>
        <select
          value={modType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="node-chrome__select"
        >
          <option value="sine">Mod Sine</option>
          <option value="square">Mod Square</option>
          <option value="sawtooth">Mod Saw</option>
          <option value="triangle">Mod Triangle</option>
        </select>
      </div>

      <Handle type="target" position={Position.Left} id="pitch" className="node-handle--pitch" style={{ top: '30%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--osc">Pitch</div>
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-teal" />
    </div>
  );
};

export default FMSynthNode;
