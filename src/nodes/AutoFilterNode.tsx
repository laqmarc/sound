import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const AutoFilterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const rate = data.rate ?? 0.8;
  const depth = data.depth ?? 2200;
  const tone = data.tone ?? 800;
  const q = data.Q ?? 1.2;
  const mix = data.mix ?? 0.85;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';
  const filterType = (data.type as BiquadFilterType | undefined) ?? 'lowpass';

  return (
    <div className="bg-violet-950/80 backdrop-blur-xl border border-violet-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-violet-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse" />
        AutoFilter
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: false })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            !sync ? 'bg-violet-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onDataChange(id, { sync: true })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            sync ? 'bg-violet-300 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Sync
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sync ? (
          <div className="col-span-2">
            <label className="text-slate-400 text-[9px] uppercase block mb-1">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-violet-400/20 w-full outline-none focus:border-violet-300"
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
            label="Rate"
            min={0.05}
            max={12}
            step={0.01}
            value={rate}
            onChange={(value) => onDataChange(id, { rate: value })}
            color="#c4b5fd"
            unit="Hz"
            size={52}
          />
        )}
        <Knob
          label="Base"
          min={60}
          max={8000}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#c4b5fd"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Sweep"
          min={50}
          max={6000}
          step={1}
          value={depth}
          onChange={(value) => onDataChange(id, { depth: value })}
          color="#c4b5fd"
          unit=""
          size={52}
        />
        <Knob
          label="Q"
          min={0.2}
          max={18}
          step={0.1}
          value={q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#c4b5fd"
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
          color="#c4b5fd"
          unit=""
          size={52}
        />
      </div>

      <div className="mt-4">
        <label className="text-slate-400 text-[9px] uppercase block mb-1">Filter</label>
        <select
          value={filterType}
          onChange={(event) => onDataChange(id, { type: event.target.value as BiquadFilterType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-violet-400/20 w-full outline-none focus:border-violet-300"
        >
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
          <option value="notch">Notch</option>
        </select>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Sweep Core</span>
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-violet-300 !w-4 !h-4 !border-2 !border-black" />
          <Handle type="source" position={Position.Right} className="!bg-violet-300 !w-4 !h-4 !border-2 !border-black" />
        </div>
      </div>
    </div>
  );
};

export default AutoFilterNode;
