import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './SubOscNode.css';

const SubOscNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 110;
  const gain = data.gain ?? 0.4;
  const subOctave = data.subOctave ?? 1;
  const waveType = (data.type as OscillatorType | undefined) ?? 'square';

  return (
    <div className="node-chrome sub-osc-node">
      <div className="node-chrome__title sub-osc-node__title">
        <div className="node-chrome__dot sub-osc-node__dot" />
        Sub Osc
      </div>

      <div className="node-chrome__grid-2">
        <Knob
          label="Base"
          min={20}
          max={1000}
          step={1}
          value={frequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#93c5fd"
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
          color="#93c5fd"
          unit=""
          size={52}
        />
      </div>

      <div className="node-chrome__grid-2 node-chrome__grid-2--compact">
        <select
          value={subOctave}
          onChange={(event) => onDataChange(id, { subOctave: Number(event.target.value) })}
          className="node-chrome__select"
        >
          <option value={1}>-1 Oct</option>
          <option value={2}>-2 Oct</option>
        </select>
        <select
          value={waveType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="node-chrome__select"
        >
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Saw</option>
        </select>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="pitch"
        className="node-handle--pitch"
        style={{ top: '30%' }}
      />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--sub">
        Pitch
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="node-handle--source node-handle--source-blue"
      />
    </div>
  );
};

export default SubOscNode;
