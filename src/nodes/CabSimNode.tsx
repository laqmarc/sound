import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const CabSimNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 2600;
  const q = data.Q ?? 0.8;
  const mix = data.mix ?? 1;

  return (
    <div className="bg-stone-950/80 backdrop-blur-xl border border-stone-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-stone-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-pulse" />
        Cab Sim
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Tone"
          min={800}
          max={6000}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#d6d3d1"
          unit="Hz"
          size={50}
        />
        <Knob
          label="Reso"
          min={0.2}
          max={3}
          step={0.01}
          value={q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-stone-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Speaker Box</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-stone-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default CabSimNode;
