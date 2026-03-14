import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const EnvelopeFollowerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const attack = data.attack ?? 0.03;
  const release = data.release ?? 0.18;
  const gain = data.gain ?? 200;

  return (
    <div className="bg-cyan-950/80 backdrop-blur-xl border border-cyan-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-cyan-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        Env Follow
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Knob
          label="Attack"
          min={0.001}
          max={0.2}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#67e8f9"
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
          color="#67e8f9"
          unit="s"
          size={50}
        />
        <Knob
          label="Gain"
          min={1}
          max={1000}
          step={1}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#67e8f9"
          unit=""
          size={50}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Audio In</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default EnvelopeFollowerNode;
