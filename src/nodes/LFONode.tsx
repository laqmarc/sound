import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const LFONode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 1;
  const gain = data.gain ?? 100;
  const waveType = (data.type as OscillatorType | undefined) ?? 'sine';
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[190px]">
      <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        LFO (Modulator)
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: false })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            !sync ? 'bg-amber-500 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onDataChange(id, { sync: true })}
          className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
            sync ? 'bg-amber-500 text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Sync
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {sync ? (
          <div className="col-span-2">
            <label className="text-slate-400 text-[9px] uppercase block mb-1">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-amber-400"
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
            label="Freq"
            min={0.1}
            max={20}
            step={0.01}
            value={frequency}
            onChange={(value) => onDataChange(id, { frequency: value })}
            color="#fbbf24"
            size={50}
          />
        )}
        <Knob
          label="Amp"
          min={0}
          max={1000}
          step={1}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#fbbf24"
          size={50}
        />
      </div>

      <div className="flex bg-white/5 rounded-lg p-1 mb-2">
        {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onDataChange(id, { type })}
            className={`flex-1 text-[8px] py-1 rounded-md transition-all font-bold uppercase ${
              waveType === type ? 'bg-amber-500 text-black shadow-lg' : 'text-white/40 hover:text-white'
            }`}
          >
            {type.slice(0, 3)}
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
