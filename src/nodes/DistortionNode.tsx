import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const DistortionNode = ({ id, data }: any) => {
  const [amount, setAmount] = useState(data.distortion || 400);

  useEffect(() => {
    updateNodeParam(id, 'distortion', amount);
  }, [id, amount]);

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-orange-500 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        Distorsió
      </div>

      <div className="flex justify-center">
        <Knob 
          label="Quantitat"
          min={0}
          max={1000}
          step={1}
          value={amount}
          onChange={setAmount}
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
