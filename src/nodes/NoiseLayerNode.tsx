import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const NoiseLayerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 2800;
  const Q = data.Q ?? 0.8;
  const gain = data.gain ?? 0.18;
  const filterType = (data.type as BiquadFilterType | undefined) ?? 'lowpass';

  return (
    <div className="bg-stone-900/85 backdrop-blur-xl border border-stone-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-stone-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-pulse" />
        Noise Layer
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Knob
          label="Tone"
          min={100}
          max={12000}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#d6d3d1"
          unit="Hz"
          size={50}
        />
        <Knob
          label="Q"
          min={0.1}
          max={20}
          step={0.1}
          value={Q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
      </div>

      <select
        value={filterType}
        onChange={(event) => onDataChange(id, { type: event.target.value as BiquadFilterType })}
        className="bg-slate-900 text-white text-xs p-1.5 rounded border border-stone-400/20 w-full outline-none focus:border-stone-300"
      >
        <option value="lowpass">Lowpass</option>
        <option value="bandpass">Bandpass</option>
        <option value="highpass">Highpass</option>
      </select>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Air Layer</span>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-stone-300 !w-4 !h-4 !border-2 !border-black"
        />
      </div>
    </div>
  );
};

export default NoiseLayerNode;
