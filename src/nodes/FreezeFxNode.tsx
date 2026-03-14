import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const FreezeFxNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const loopLength = data.loopLength ?? 0.35;
  const mix = data.mix ?? 0.9;
  const freeze = data.freeze ?? false;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="bg-sky-950/80 backdrop-blur-xl border border-sky-400/20 p-4 rounded-2xl shadow-2xl min-w-[250px]">
      <div className="text-[10px] font-black tracking-widest text-sky-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-sky-300 rounded-full animate-pulse" />
        Freeze
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-4">
        <button
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            freeze ? 'bg-sky-300 text-black shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          {freeze ? 'Frozen' : 'Live'}
        </button>
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: false })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            !sync ? 'bg-sky-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onDataChange(id, { sync: true })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            sync ? 'bg-sky-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Sync
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sync ? (
          <div className="col-span-2">
            <label className="text-slate-400 text-[9px] uppercase block mb-1">Window</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-sky-400/20 w-full outline-none focus:border-sky-300"
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
            label="Window"
            min={0.05}
            max={1}
            step={0.01}
            value={loopLength}
            onChange={(value) => onDataChange(id, { loopLength: value })}
            color="#7dd3fc"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Mix"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(value) => onDataChange(id, { mix: value })}
          color="#7dd3fc"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-sky-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Frozen Slice</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-sky-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default FreezeFxNode;
