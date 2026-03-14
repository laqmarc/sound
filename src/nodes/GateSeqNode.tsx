import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';

const divisions: SyncDivision[] = ['1/4', '1/8', '1/16'];

const defaultSteps = Array.from({ length: 16 }, (_, index) => index % 2 === 0);

const GateSeqNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = data.steps ?? defaultSteps;
  const syncDivision = data.syncDivision ?? '1/16';

  const toggleStep = (index: number) => {
    const next = Array.from({ length: 16 }, (_, stepIndex) => {
      if (stepIndex === index) {
        return !steps[stepIndex];
      }
      return steps[stepIndex] ?? false;
    });
    onDataChange(id, { steps: next });
  };

  return (
    <div className="bg-amber-950/80 backdrop-blur-xl border border-amber-400/20 p-4 rounded-2xl shadow-2xl min-w-[300px]">
      <div className="text-[10px] font-black tracking-widest text-amber-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" />
        Gate Seq
      </div>

      <div>
        <label className="text-slate-400 text-[9px] uppercase block mb-1">Clock</label>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-amber-400/20 w-full outline-none focus:border-amber-300"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-8 gap-1">
        {Array.from({ length: 16 }, (_, index) => {
          const active = steps[index] ?? false;
          return (
            <button
              key={index}
              onClick={() => toggleStep(index)}
              className={`h-8 rounded-md border text-[9px] font-bold transition-all ${
                active
                  ? 'bg-amber-300 text-black border-amber-200 shadow-[0_0_12px_rgba(252,211,77,0.45)]'
                  : 'bg-black/20 text-white/35 border-white/10 hover:border-amber-300/40'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Handle type="target" position={Position.Left} className="!bg-amber-300 !w-4 !h-4 !border-2 !border-black" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Chop Audio</span>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-amber-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default GateSeqNode;
