import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const GranularNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const grainSize = data.grainSize ?? 0.12;
  const spray = data.spray ?? 0.35;
  const mix = data.mix ?? 0.8;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div className="bg-indigo-950/80 backdrop-blur-xl border border-indigo-400/20 p-4 rounded-2xl shadow-2xl min-w-[260px]">
      <div className="text-[10px] font-black tracking-widest text-indigo-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
        Granular
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: false })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            !sync ? 'bg-indigo-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onDataChange(id, { sync: true })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            sync ? 'bg-indigo-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Sync
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sync ? (
          <div className="col-span-2">
            <label className="text-slate-400 text-[9px] uppercase block mb-1">Grain Clock</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 w-full outline-none focus:border-indigo-300"
            >
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Knob
            label="Size"
            min={0.02}
            max={0.5}
            step={0.01}
            value={grainSize}
            onChange={(value) => onDataChange(id, { grainSize: value })}
            color="#a5b4fc"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Spray"
          min={0}
          max={1}
          step={0.01}
          value={spray}
          onChange={(value) => onDataChange(id, { spray: value })}
          color="#a5b4fc"
          unit=""
          size={52}
        />
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#a5b4fc"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-indigo-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Grain Cloud</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-indigo-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default GranularNode;
