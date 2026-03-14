import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const ClockDividerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const syncDivision = data.syncDivision ?? '1/4';

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-400/20 p-4 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-zinc-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" />
        Clock Divider
      </div>

      <div>
        <label className="text-slate-400 text-[9px] uppercase block mb-1">Division</label>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-zinc-400/20 w-full outline-none focus:border-zinc-300"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Pulse Out</span>
        <Handle type="source" position={Position.Right} className="!bg-zinc-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default ClockDividerNode;
