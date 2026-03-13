import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const LFONode = ({ id, data }: any) => {
  const [freq, setFreq] = useState(data.frequency || 1);
  const [gain, setGain] = useState(data.gain || 100);
  const [type, setType] = useState(data.type || 'sine');

  useEffect(() => {
    updateNodeParam(id, 'frequency', freq);
    updateNodeParam(id, 'type', type);
    updateNodeParam(`${id}_gain`, 'gain', gain);
  }, [id, freq, gain, type]);

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[180px]">
      <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        LFO (Modulator)
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Knob 
          label="Freq"
          min={0.1}
          max={20}
          step={0.01}
          value={freq}
          onChange={setFreq}
          color="#fbbf24"
          size={50}
        />
        <Knob 
          label="Amp"
          min={0}
          max={1000}
          step={1}
          value={gain}
          onChange={setGain}
          color="#fbbf24"
          size={50}
        />
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-2">
        {['sine', 'square', 'sawtooth', 'triangle'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t as any)}
            className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
              type === t ? 'bg-amber-500 text-black shadow-lg' : 'text-white/40 hover:text-white'
            }`}
          >
            {t.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] text-white/30 uppercase font-bold tracking-tighter">Mod Out</span>
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!bg-amber-400 !w-4 !h-4 !border-2 !border-black" 
        />
      </div>
    </div>
  );
};

export default LFONode;
