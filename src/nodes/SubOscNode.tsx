import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const SubOscNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 110;
  const gain = data.gain ?? 0.4;
  const subOctave = data.subOctave ?? 1;
  const waveType = (data.type as OscillatorType | undefined) ?? 'square';

  return (
    <div className="bg-blue-950/80 backdrop-blur-xl border border-blue-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-blue-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
        Sub Osc
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
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

      <div className="grid grid-cols-2 gap-2">
        <select
          value={subOctave}
          onChange={(event) => onDataChange(id, { subOctave: Number(event.target.value) })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-blue-400/20 outline-none focus:border-blue-300"
        >
          <option value={1}>-1 Oct</option>
          <option value={2}>-2 Oct</option>
        </select>
        <select
          value={waveType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-blue-400/20 outline-none focus:border-blue-300"
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
        className="!bg-lime-400 !w-3 !h-3 !border-2 !border-white"
        style={{ top: '30%' }}
      />
      <div className="absolute left-[-38px] top-[25%] text-[8px] text-lime-400 font-bold uppercase pointer-events-none">
        Pitch
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-300 !w-4 !h-4 !border-2 !border-black"
      />
    </div>
  );
};

export default SubOscNode;
