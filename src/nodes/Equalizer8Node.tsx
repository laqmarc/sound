import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps } from '../types';

const bandLabels = ['60', '170', '310', '600', '1k', '3k', '6k', '12k'];

const normalizeBands = (bands?: number[]) => {
  return Array.from({ length: 8 }, (_, index) => bands?.[index] ?? 0);
};

const Equalizer8Node = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const bands = normalizeBands(data.eqBands);

  const updateBand = (bandIndex: number, value: number) => {
    const nextBands = normalizeBands(bands);
    nextBands[bandIndex] = value;
    onDataChange(id, { eqBands: nextBands });
  };

  const stopDragPropagation = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="bg-slate-950/90 backdrop-blur-xl border border-cyan-400/20 p-4 rounded-2xl shadow-2xl min-w-[420px]">
      <div className="text-[10px] font-black tracking-widest text-cyan-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        Equalizer 8-Band
      </div>

      <div className="flex items-end justify-between gap-2 h-[210px]">
        {bands.map((band, index) => (
          <div key={`eq-band-${bandLabels[index]}`} className="flex flex-col items-center gap-2 flex-1">
            <div className="text-[9px] font-mono text-cyan-200">{band > 0 ? `+${band}` : band}dB</div>
            <input
              type="range"
              min={-24}
              max={24}
              step={1}
              value={band}
              onMouseDown={stopDragPropagation}
              onChange={(event) => updateBand(index, Number(event.target.value))}
              className="nodrag h-[140px] w-4 accent-cyan-300 [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
            />
            <div className="text-[9px] uppercase tracking-widest text-white/45">{bandLabels[index]}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Tone Shape</span>
        <div className="flex items-center gap-4">
          <span className="text-[8px] uppercase tracking-[0.2em] text-cyan-200/60">In</span>
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black"
          />
          <span className="text-[8px] uppercase tracking-[0.2em] text-cyan-200/60">Out</span>
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default Equalizer8Node;
