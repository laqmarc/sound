import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const TiltEQNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 900;
  const tilt = data.tilt ?? 0;
  const mix = data.mix ?? 1;

  return (
    <div className="bg-lime-950/80 backdrop-blur-xl border border-lime-400/20 p-4 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-lime-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-lime-300 rounded-full animate-pulse" />
        Tilt EQ
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Pivot"
          min={120}
          max={4000}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#bef264"
          unit="Hz"
          size={50}
        />
        <Knob
          label="Tilt"
          min={-18}
          max={18}
          step={0.1}
          value={tilt}
          onChange={(value) => onDataChange(id, { tilt: value })}
          color="#bef264"
          unit="dB"
          size={50}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#bef264"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Balance Bar</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-lime-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-lime-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default TiltEQNode;
