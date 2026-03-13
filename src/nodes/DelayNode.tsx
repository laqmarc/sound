import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const DelayNode = ({ id, data }: any) => {
  const [delayTime, setDelayTime] = useState(data.delayTime || 0.3);

  useEffect(() => {
    updateNodeParam(id, 'delayTime', delayTime);
  }, [id, delayTime]);

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-amber-400 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-400 rounded-full" />
        Eco (Delay)
      </div>

      <div className="flex justify-center">
        <Knob 
          label="Temps Eco"
          min={0}
          max={1}
          step={0.01}
          value={delayTime}
          onChange={setDelayTime}
          color="#fbbf24"
          unit="s"
          size={60}
        />
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-amber-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-amber-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
    </div>
  );
};

export default DelayNode;
