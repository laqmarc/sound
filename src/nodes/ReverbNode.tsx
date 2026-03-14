import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const ReverbNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const decay = data.decay ?? 3;
  const roomSize = data.roomSize ?? 0.55;
  const preDelay = data.delayTime ?? 0.02;
  const tone = data.tone ?? 4800;
  const mix = data.mix ?? 0.55;

  return (
    <div className="min-w-[270px] rounded-[24px] border border-indigo-400/20 bg-[linear-gradient(145deg,rgba(12,16,38,0.98),rgba(26,16,54,0.94))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-indigo-300">
            <div className="h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_14px_rgba(165,180,252,0.9)]" />
            Reverb Chamber
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Space, tone and wet blend</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-mono text-indigo-200">
          {Math.round(mix * 100)}% wet
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 nodrag">
        <Knob
          label="Decay"
          min={0.1}
          max={10}
          step={0.1}
          value={decay}
          onChange={(value) => onDataChange(id, { decay: value })}
          color="#818cf8"
          size={56}
        />
        <Knob
          label="Size"
          min={0.2}
          max={1}
          step={0.01}
          value={roomSize}
          onChange={(value) => onDataChange(id, { roomSize: value })}
          color="#a78bfa"
          size={56}
        />
        <Knob
          label="Pre"
          min={0}
          max={0.4}
          step={0.001}
          value={preDelay}
          onChange={(value) => onDataChange(id, { delayTime: value })}
          color="#38bdf8"
          unit="s"
          size={56}
        />
        <Knob
          label="Tone"
          min={400}
          max={12000}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#22d3ee"
          unit="Hz"
          size={56}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#f472b6"
          size={56}
        />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-2 !border-white !bg-indigo-400 hover:!scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !border-2 !border-white !bg-indigo-400 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default ReverbNode;
