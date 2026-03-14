import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const CVOffsetNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const offset = data.offset ?? 0;
  const gain = data.gain ?? 1;

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-400/20 p-4 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-zinc-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" />
        CV Offset
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Knob
          label="Offset"
          min={-1200}
          max={1200}
          step={1}
          value={offset}
          onChange={(value) => onDataChange(id, { offset: value })}
          color="#d4d4d8"
          unit=""
          size={52}
        />
        <Knob
          label="Scale"
          min={0}
          max={4}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#d4d4d8"
          unit="x"
          size={52}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">CV Out</span>
        <Handle type="source" position={Position.Right} className="!bg-zinc-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default CVOffsetNode;
