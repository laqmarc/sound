import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const CompressorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const threshold = data.threshold ?? -24;
  const knee = data.knee ?? 18;
  const ratio = data.ratio ?? 6;
  const attack = data.attack ?? 0.01;
  const release = data.release ?? 0.25;
  const makeup = data.makeup ?? 1;

  return (
    <div className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
        Compressor
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Thresh"
          min={-60}
          max={0}
          step={1}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#6ee7b7"
          unit="dB"
          size={50}
        />
        <Knob
          label="Knee"
          min={0}
          max={40}
          step={1}
          value={knee}
          onChange={(value) => onDataChange(id, { knee: value })}
          color="#6ee7b7"
          unit=""
          size={50}
        />
        <Knob
          label="Ratio"
          min={1}
          max={20}
          step={0.1}
          value={ratio}
          onChange={(value) => onDataChange(id, { ratio: value })}
          color="#6ee7b7"
          unit=""
          size={50}
        />
        <Knob
          label="Attack"
          min={0}
          max={1}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#6ee7b7"
          unit="s"
          size={50}
        />
        <Knob
          label="Release"
          min={0.01}
          max={1}
          step={0.001}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#6ee7b7"
          unit="s"
          size={50}
        />
        <Knob
          label="Makeup"
          min={0}
          max={4}
          step={0.01}
          value={makeup}
          onChange={(value) => onDataChange(id, { makeup: value })}
          color="#6ee7b7"
          unit="x"
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Dynamics</span>
        <div className="flex items-center gap-4">
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-emerald-300 !w-4 !h-4 !border-2 !border-black"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-emerald-300 !w-4 !h-4 !border-2 !border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default CompressorNode;
