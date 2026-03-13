import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAudioContext } from '../AudioEngine';

const DestinationNode = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const ctx = getAudioContext();
        setIsActive(ctx.state === 'running');
      } catch (e) {
        setIsActive(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-4 border-2 rounded-lg transition-all duration-500 min-w-[200px] ${
      isActive 
        ? 'bg-slate-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
        : 'bg-slate-950 border-slate-800 shadow-none'
    }`}>
      <div className={`font-black mb-2 flex items-center gap-2 ${isActive ? 'text-rose-500' : 'text-slate-600'}`}>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
        SORTIDA (Audio Out)
      </div>
      <p className="text-slate-500 text-[10px] leading-tight">
        {isActive ? 'El motor d\'àudio està ACTIU' : 'El motor d\'àudio està ATURAT'}
      </p>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-rose-500 !w-5 !h-5 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
    </div>
  );
};

export default DestinationNode;
