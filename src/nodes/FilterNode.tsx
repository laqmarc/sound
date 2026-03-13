import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const FilterNode = ({ id, data }: any) => {
  const [freq, setFreq] = useState(data.frequency || 1000);
  const [type, setType] = useState(data.type || 'lowpass');
  const [q, setQ] = useState(data.Q || 1);

  useEffect(() => {
    updateNodeParam(id, 'frequency', freq);
    updateNodeParam(id, 'type', type);
    updateNodeParam(id, 'Q', q);
  }, [id, freq, type, q]);

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[200px]">
      <div className="text-purple-400 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full" />
        Filtre
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-around items-center">
          <Knob 
            label="Freq Tall"
            min={20}
            max={15000}
            value={freq}
            onChange={setFreq}
            color="#a855f7"
            unit="Hz"
            size={55}
          />
          <Knob 
            label="Ressonància (Q)"
            min={0}
            max={20}
            value={q}
            onChange={setQ}
            color="#a855f7"
            size={55}
            step={0.1}
          />
        </div>

        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Tipus</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-purple-400"
          >
            <option value="lowpass">Pas Baix (Lowpass)</option>
            <option value="highpass">Pas Alt (Highpass)</option>
            <option value="bandpass">Pas de Banda</option>
            <option value="notch">Filtre Rebuig (Notch)</option>
          </select>
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-purple-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="mod"
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white hover:!scale-125 transition-transform" 
        style={{ top: '70%' }}
      />
      <div className="absolute left-[-30px] top-[65%] text-[8px] text-purple-400 font-bold uppercase pointer-events-none">Mod</div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-purple-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
    </div>
  );
};

export default FilterNode;
