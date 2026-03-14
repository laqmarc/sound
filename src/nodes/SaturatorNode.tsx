import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const SaturatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const drive = data.drive ?? 2.4;
  const makeup = data.makeup ?? 1;
  const mix = data.mix ?? 0.8;

  return (
    <div className="bg-red-950/80 backdrop-blur-xl border border-red-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-red-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" />
        Saturator
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Drive"
          min={1}
          max={10}
          step={0.01}
          value={drive}
          onChange={(value) => onDataChange(id, { drive: value })}
          color="#fca5a5"
          unit=""
          size={50}
        />
        <Knob
          label="Makeup"
          min={0.2}
          max={3}
          step={0.01}
          value={makeup}
          onChange={(value) => onDataChange(id, { makeup: value })}
          color="#fca5a5"
          unit="x"
          size={50}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#fca5a5"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Warm Damage</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-red-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-red-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default SaturatorNode;
