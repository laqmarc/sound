import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const RandomCVNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const minValue = data.minValue ?? -300;
  const maxValue = data.maxValue ?? 300;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
        Random CV
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Knob
          label="Min"
          min={-1200}
          max={1200}
          step={1}
          value={minValue}
          onChange={(value) => onDataChange(id, { minValue: value })}
          color="#86efac"
          unit=""
          size={52}
        />
        <Knob
          label="Max"
          min={-1200}
          max={1200}
          step={1}
          value={maxValue}
          onChange={(value) => onDataChange(id, { maxValue: value })}
          color="#86efac"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4">
        <label className="text-slate-400 text-[9px] uppercase block mb-1">Step Rate</label>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Chaos Out</span>
        <Handle type="source" position={Position.Right} className="!bg-emerald-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default RandomCVNode;
