import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const LagNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.02;
  const release = data.release ?? 0.08;
  const mix = data.mix ?? 1;

  return (
    <div className="bg-teal-950/80 backdrop-blur-xl border border-teal-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-teal-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
        Lag
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob label="Rise" min={0.001} max={0.2} step={0.001} value={attack} onChange={(value) => onDataChange(id, { attack: value })} color="#5eead4" unit="s" size={50} />
        <Knob label="Fall" min={0.001} max={0.5} step={0.001} value={release} onChange={(value) => onDataChange(id, { release: value })} color="#5eead4" unit="s" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#5eead4" unit="" size={50} />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-teal-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Slew Out</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-teal-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default LagNode;
