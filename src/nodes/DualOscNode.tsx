import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const DualOscNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const gain = data.gain ?? 0.35;
  const detune = data.detune ?? 12;
  const blend = data.blend ?? 0.5;
  const waveA = (data.type as OscillatorType | undefined) ?? 'sawtooth';
  const waveB = data.modType ?? 'square';

  return (
    <div className="bg-cyan-950/80 backdrop-blur-xl border border-cyan-400/20 p-4 rounded-2xl shadow-2xl min-w-[290px]">
      <div className="text-[10px] font-black tracking-widest text-cyan-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        Dual Osc
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Osc A</label>
          <select
            value={waveA}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-cyan-400/20 w-full outline-none focus:border-cyan-300"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Osc B</label>
          <select
            value={waveB}
            onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-cyan-400/20 w-full outline-none focus:border-cyan-300"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
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
        className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black"
      />
    </div>
  );
};

export default DualOscNode;
