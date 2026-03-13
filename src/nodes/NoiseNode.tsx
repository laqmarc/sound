import React from 'react';
import { Handle, Position } from 'reactflow';

const NoiseNode = () => {
  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[150px]">
      <div className="text-slate-400 font-bold mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
        Soroll (Noise)
      </div>
      <p className="text-[10px] text-slate-500 italic">Soroll blanc pur</p>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-slate-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
    </div>
  );
};

export default NoiseNode;
