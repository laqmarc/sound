import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const FMSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 220;
  const modFrequency = data.modFrequency ?? 220;
  const modAmount = data.modAmount ?? 180;
  const gain = data.gain ?? 0.35;
  const carrierType = (data.type as OscillatorType | undefined) ?? 'sine';
  const modType = data.modType ?? 'sine';

  return (
    <div className="bg-teal-950/80 backdrop-blur-xl border border-teal-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-teal-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
        FM Synth
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
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

      <div className="grid grid-cols-2 gap-2">
        <select
          value={carrierType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-teal-400/20 outline-none focus:border-teal-300"
        >
          <option value="sine">Carrier Sine</option>
          <option value="square">Carrier Square</option>
          <option value="sawtooth">Carrier Saw</option>
          <option value="triangle">Carrier Triangle</option>
        </select>
        <select
          value={modType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-teal-400/20 outline-none focus:border-teal-300"
        >
          <option value="sine">Mod Sine</option>
          <option value="square">Mod Square</option>
          <option value="sawtooth">Mod Saw</option>
          <option value="triangle">Mod Triangle</option>
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
        className="!bg-teal-300 !w-4 !h-4 !border-2 !border-black"
      />
    </div>
  );
};

export default FMSynthNode;
