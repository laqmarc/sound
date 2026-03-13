import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const DelayNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const delayTime = data.delayTime ?? 0.3;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[190px]">
      <div className="text-amber-400 font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-400 rounded-full" />
        Eco (Delay)
      </div>

      <div className="flex bg-slate-900 rounded p-0.5 mb-4">
        <button
          onClick={() => onDataChange(id, { sync: false })}
          className={`flex-1 px-2 py-1 text-[9px] rounded font-bold uppercase ${
            !sync ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onDataChange(id, { sync: true })}
          className={`flex-1 px-2 py-1 text-[9px] rounded font-bold uppercase ${
            sync ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sync
        </button>
      </div>

      {sync ? (
        <div>
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
        <div className="flex justify-center">
          <Knob
            label="Temps Eco"
            min={0}
            max={1}
            step={0.01}
            value={delayTime}
            onChange={(value) => onDataChange(id, { delayTime: value })}
            color="#fbbf24"
            unit="s"
            size={60}
          />
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default DelayNode;
