import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const GainNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const gain = data.gain ?? 0.5;

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
        Gain
      </div>

      <div className="flex justify-center">
        <Knob
          label="Volum"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#10b981"
          unit=""
          size={60}
        />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-emerald-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="mod"
        className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-white hover:!scale-125 transition-transform"
        style={{ top: '70%' }}
      />
      <div className="absolute left-[-30px] top-[65%] text-[8px] text-emerald-400 font-bold uppercase pointer-events-none">
        Mod
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-emerald-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default GainNode;
