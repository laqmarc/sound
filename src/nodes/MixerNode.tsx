import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const MixerNode = ({ id, data }: any) => {
  const [ch1, setCh1] = useState(0.5);
  const [ch2, setCh2] = useState(0.5);
  const [ch3, setCh3] = useState(0.5);
  const [ch4, setCh4] = useState(0.5);

  useEffect(() => {
    updateNodeParam(`${id}_ch1`, 'gain', ch1);
  }, [id, ch1]);

  useEffect(() => {
    updateNodeParam(`${id}_ch2`, 'gain', ch2);
  }, [id, ch2]);

  useEffect(() => {
    updateNodeParam(`${id}_ch3`, 'gain', ch3);
  }, [id, ch3]);

  useEffect(() => {
    updateNodeParam(`${id}_ch4`, 'gain', ch4);
  }, [id, ch4]);

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-400 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        4-Channel Mixer
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="flex flex-col items-center relative">
          <Handle 
            type="target" 
            position={Position.Left} 
            id="ch1"
            style={{ top: '50%', left: '-12px' }}
            className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-black" 
          />
          <Knob 
            label="CH 1"
            min={0}
            max={1}
            step={0.01}
            value={ch1}
            onChange={setCh1}
            color="#10b981"
            size={45}
          />
          <div className="text-[7px] text-white/40 font-bold uppercase mt-1 h-2">
            {data.label_ch1 || ''}
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <Handle 
            type="target" 
            position={Position.Left} 
            id="ch2"
            style={{ top: '50%', left: '-12px' }}
            className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-black" 
          />
          <Knob 
            label="CH 2"
            min={0}
            max={1}
            step={0.01}
            value={ch2}
            onChange={setCh2}
            color="#10b981"
            size={45}
          />
          <div className="text-[7px] text-white/40 font-bold uppercase mt-1 h-2">
            {data.label_ch2 || ''}
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <Handle 
            type="target" 
            position={Position.Left} 
            id="ch3"
            style={{ top: '50%', left: '-12px' }}
            className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-black" 
          />
          <Knob 
            label="CH 3"
            min={0}
            max={1}
            step={0.01}
            value={ch3}
            onChange={setCh3}
            color="#10b981"
            size={45}
          />
          <div className="text-[7px] text-white/40 font-bold uppercase mt-1 h-2">
            {data.label_ch3 || ''}
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <Handle 
            type="target" 
            position={Position.Left} 
            id="ch4"
            style={{ top: '50%', left: '-12px' }}
            className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-black" 
          />
          <Knob 
            label="CH 4"
            min={0}
            max={1}
            step={0.01}
            value={ch4}
            onChange={setCh4}
            color="#10b981"
            size={45}
          />
          <div className="text-[7px] text-white/40 font-bold uppercase mt-1 h-2">
            {data.label_ch4 || ''}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] text-white/30 uppercase font-bold tracking-tighter">Master Out</span>
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!bg-white !w-4 !h-4 !border-2 !border-black" 
        />
      </div>
    </div>
  );
};

export default MixerNode;
