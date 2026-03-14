import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const ResonatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 440;
  const Q = data.Q ?? 12;
  const spread = data.spread ?? 7;
  const mix = data.mix ?? 0.7;

  return (
    <div className="bg-teal-950/80 backdrop-blur-xl border border-teal-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-teal-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
        Resonator
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Knob
          label="Tune"
          min={80}
          max={2400}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#5eead4"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Q"
          min={0.5}
          max={24}
          step={0.1}
          value={Q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#5eead4"
          unit=""
          size={52}
        />
        <Knob
          label="Spread"
          min={1}
          max={24}
          step={0.1}
          value={spread}
          onChange={(value) => onDataChange(id, { spread: value })}
          color="#5eead4"
          unit="st"
          size={52}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#5eead4"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Metal Body</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-teal-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-teal-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default ResonatorNode;
