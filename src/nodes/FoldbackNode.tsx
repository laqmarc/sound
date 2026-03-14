import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const FoldbackNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const drive = data.drive ?? 2.2;
  const threshold = data.threshold ?? 0.55;
  const mix = data.mix ?? 0.75;

  return (
    <div className="bg-orange-950/80 backdrop-blur-xl border border-orange-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-orange-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse" />
        Foldback
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Drive"
          min={1}
          max={8}
          step={0.01}
          value={drive}
          onChange={(value) => onDataChange(id, { drive: value })}
          color="#fdba74"
          unit=""
          size={50}
        />
        <Knob
          label="Fold"
          min={0.1}
          max={1}
          step={0.01}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#fdba74"
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
          color="#fdba74"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Crushed Mirror</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-orange-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-orange-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default FoldbackNode;
