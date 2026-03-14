import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const QuantizerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const divider = data.divider ?? 12;
  const mix = data.mix ?? 1;

  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-400/20 p-4 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-slate-200 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse" />
        Quantizer
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Knob label="Steps" min={2} max={48} step={1} value={divider} onChange={(value) => onDataChange(id, { divider: value })} color="#e2e8f0" unit="" size={52} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#e2e8f0" unit="" size={52} />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-slate-200 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Stepped Out</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-slate-200 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default QuantizerNode;
