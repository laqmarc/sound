import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const LeadVoiceNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 330;
  const tone = data.tone ?? 2200;
  const q = data.Q ?? 0.8;
  const gain = data.gain ?? 0.3;
  const glide = data.glide ?? 0.04;
  const wave = (data.type as OscillatorType | undefined) ?? 'sawtooth';

  return (
    <div className="bg-rose-950/80 backdrop-blur-xl border border-rose-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-rose-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" />
        Lead Voice
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-2 mt-4">
        <select
          value={wave}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-rose-400/20 outline-none focus:border-rose-300"
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

      <Handle type="target" position={Position.Left} id="pitch" className="!bg-lime-400 !w-3 !h-3 !border-2 !border-white" style={{ top: '28%' }} />
      <div className="absolute left-[-38px] top-[23%] text-[8px] text-lime-400 font-bold uppercase pointer-events-none">Pitch</div>
      <Handle type="source" position={Position.Right} className="!bg-rose-300 !w-4 !h-4 !border-2 !border-black" />
    </div>
  );
};

export default LeadVoiceNode;
