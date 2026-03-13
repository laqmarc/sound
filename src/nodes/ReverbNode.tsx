import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const ReverbNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const decay = data.decay ?? 3;

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
        Reverb
      </div>

      <div className="flex justify-center">
        <Knob
          label="Decay"
          min={0.1}
          max={10}
          step={0.1}
          value={decay}
          onChange={(value) => onDataChange(id, { decay: value })}
          color="#818cf8"
          unit=""
          size={60}
        />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default ReverbNode;
