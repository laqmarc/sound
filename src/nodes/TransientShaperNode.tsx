import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const TransientShaperNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.7;
  const sustain = data.sustain ?? 0;
  const mix = data.mix ?? 1;

  return (
    <div className="bg-fuchsia-950/80 backdrop-blur-xl border border-fuchsia-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-fuchsia-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-pulse" />
        Transient
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Attack"
          min={-1}
          max={1}
          step={0.01}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#f0abfc"
          unit=""
          size={50}
        />
        <Knob
          label="Sustain"
          min={-1}
          max={1}
          step={0.01}
          value={sustain}
          onChange={(value) => onDataChange(id, { sustain: value })}
          color="#f0abfc"
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
          color="#f0abfc"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-fuchsia-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Punch Box</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-fuchsia-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default TransientShaperNode;
