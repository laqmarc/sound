import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const DistortionNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const amount = data.distortion ?? 400;

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-orange-500 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        Distortion
      </div>

      <div className="flex justify-center">
        <Knob
          label="Amount"
          min={0}
          max={1000}
          step={1}
          value={amount}
          onChange={(value) => onDataChange(id, { distortion: value })}
          color="#f97316"
          unit=""
          size={60}
        />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-orange-500 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-orange-500 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default DistortionNode;
