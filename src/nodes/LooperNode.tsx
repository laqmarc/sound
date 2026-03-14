import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const LooperNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const loopLength = data.loopLength ?? 0.5;
  const mix = data.mix ?? 0.8;
  const feedback = data.feedback ?? 0.2;
  const freeze = data.freeze ?? false;
  const sync = data.sync ?? true;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="bg-lime-950/80 backdrop-blur-xl border border-lime-400/20 p-4 rounded-2xl shadow-2xl min-w-[270px]">
      <div className="text-[10px] font-black tracking-widest text-lime-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-lime-300 rounded-full animate-pulse" />
        Looper
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`flex-1 text-[8px] py-2 rounded-md transition-all font-bold uppercase ${
            sync ? 'bg-lime-300 text-black shadow-lg' : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          {sync ? 'Sync' : 'Free'}
        </button>
        <button
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`flex-1 text-[8px] py-2 rounded-md transition-all font-bold uppercase ${
            freeze ? 'bg-lime-400 text-black shadow-lg' : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          {freeze ? 'Frozen' : 'Record'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sync ? (
          <div className="col-span-2">
            <label className="text-slate-400 text-[9px] uppercase block mb-1">Loop Size</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-lime-400/20 w-full outline-none focus:border-lime-300"
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
            label="Length"
            min={0.05}
            max={2}
            step={0.01}
            value={loopLength}
            onChange={(value) => onDataChange(id, { loopLength: value })}
            color="#bef264"
            unit="s"
            size={52}
          />
        )}
        <Knob
          label="Feed"
          min={0}
          max={0.95}
          step={0.01}
          value={feedback}
          onChange={(value) => onDataChange(id, { feedback: value })}
          color="#bef264"
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
          color="#bef264"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Capture Loop</span>
        <div className="flex items-center gap-4">
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-lime-300 !w-4 !h-4 !border-2 !border-black"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-lime-300 !w-4 !h-4 !border-2 !border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default LooperNode;
