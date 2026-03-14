import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const MonoSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const gain = data.gain ?? 0.35;
  const cutoff = data.tone ?? 1800;
  const resonance = data.Q ?? 0.8;
  const waveType = (data.type as OscillatorType | undefined) ?? 'sawtooth';

  return (
    <div className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
        Mono Synth
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Knob
          label="Pitch"
          min={20}
          max={1200}
          step={1}
          value={frequency}
          onChange={(value) => onDataChange(id, { frequency: value })}
          color="#6ee7b7"
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
          color="#6ee7b7"
          unit=""
          size={52}
        />
        <Knob
          label="Cutoff"
          min={80}
          max={12000}
          step={10}
          value={cutoff}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#6ee7b7"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Reso"
          min={0.1}
          max={20}
          step={0.1}
          value={resonance}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#6ee7b7"
          unit=""
          size={52}
        />
      </div>

      <select
        value={waveType}
        onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
        className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
      >
        <option value="sawtooth">Saw</option>
        <option value="square">Square</option>
        <option value="triangle">Triangle</option>
        <option value="sine">Sine</option>
      </select>

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
        className="!bg-emerald-300 !w-4 !h-4 !border-2 !border-black"
      />
    </div>
  );
};

export default MonoSynthNode;
