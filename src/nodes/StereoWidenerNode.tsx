import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const StereoWidenerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delay = data.delay ?? 0.012;
  const spread = data.spread ?? 1;
  const mix = data.mix ?? 0.65;

  return (
    <div className="bg-blue-950/80 backdrop-blur-xl border border-blue-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-blue-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
        Stereo Widener
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Delay"
          min={0.001}
          max={0.03}
          step={0.001}
          value={delay}
          onChange={(value) => onDataChange(id, { delay: value })}
          color="#93c5fd"
          unit="s"
          size={50}
        />
        <Knob
          label="Width"
          min={0}
          max={2}
          step={0.01}
          value={spread}
          onChange={(value) => onDataChange(id, { spread: value })}
          color="#93c5fd"
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
          color="#93c5fd"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Wide Beam</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-blue-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-blue-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default StereoWidenerNode;
