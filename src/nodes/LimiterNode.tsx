import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const LimiterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const threshold = data.threshold ?? -6;
  const release = data.release ?? 0.08;
  const makeup = data.makeup ?? 1;

  return (
    <div className="bg-red-950/80 backdrop-blur-xl border border-red-400/20 p-4 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-red-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" />
        Limiter
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Thresh"
          min={-24}
          max={0}
          step={0.5}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#fca5a5"
          unit="dB"
          size={50}
        />
        <Knob
          label="Release"
          min={0.01}
          max={0.4}
          step={0.005}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#fca5a5"
          unit="s"
          size={50}
        />
        <Knob
          label="Makeup"
          min={0.5}
          max={3}
          step={0.01}
          value={makeup}
          onChange={(value) => onDataChange(id, { makeup: value })}
          color="#fca5a5"
          unit="x"
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Brickwall</span>
        <div className="flex items-center gap-4">
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-red-300 !w-4 !h-4 !border-2 !border-black"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-red-300 !w-4 !h-4 !border-2 !border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default LimiterNode;
