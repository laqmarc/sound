import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const HumanizerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 2;
  const depth = data.depth ?? 0.35;
  const mix = data.mix ?? 0.7;

  return (
    <div className="bg-orange-950/80 backdrop-blur-xl border border-orange-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-orange-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse" />
        Humanizer
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob label="Rate" min={0.1} max={10} step={0.01} value={rate} onChange={(value) => onDataChange(id, { rate: value })} color="#fdba74" unit="Hz" size={50} />
        <Knob label="Depth" min={0} max={1} step={0.01} value={depth} onChange={(value) => onDataChange(id, { depth: value })} color="#fdba74" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fdba74" unit="" size={50} />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-orange-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Loose Feel</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-orange-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default HumanizerNode;
