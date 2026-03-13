import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const PannerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const pan = data.pan ?? 0;

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[150px]">
      <div className="text-[10px] font-black tracking-widest text-pink-400 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
        Stereo Panner
      </div>

      <div className="flex flex-col items-center">
        <Knob
          label={pan < 0 ? 'Esquerra' : pan > 0 ? 'Dreta' : 'Centre'}
          min={-1}
          max={1}
          step={0.01}
          value={pan}
          onChange={(value) => onDataChange(id, { pan: value })}
          color="#f472b6"
          size={60}
        />
        <div className="flex justify-between w-full px-2 mt-1 text-[8px] font-bold text-white/30 uppercase">
          <span>L</span>
          <span>R</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-pink-400 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-pink-400 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default PannerNode;
