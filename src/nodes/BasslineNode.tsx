import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';

const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const divisions: SyncDivision[] = ['1/4', '1/8', '1/16'];

const BasslineNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const note = data.note ?? 'C';
  const octave = data.octave ?? 2;
  const tone = data.tone ?? 900;
  const gain = data.gain ?? 0.45;
  const syncDivision = data.syncDivision ?? '1/16';
  const steps = data.steps ?? Array.from({ length: 16 }, (_, index) => index % 4 === 0);

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
    <div className="bg-green-950/80 backdrop-blur-xl border border-green-400/20 p-4 rounded-2xl shadow-2xl min-w-[320px]">
      <div className="text-[10px] font-black tracking-widest text-green-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
        Bassline
      </div>

      <div className="grid grid-cols-3 gap-2">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-green-400/20 outline-none focus:border-green-300"
        >
          {notes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={octave}
          onChange={(event) => onDataChange(id, { octave: Number(event.target.value) })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-green-400/20 outline-none focus:border-green-300"
        >
          {[1, 2, 3, 4].map((value) => (
            <option key={value} value={value}>
              Oct {value}
            </option>
          ))}
        </select>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-green-400/20 outline-none focus:border-green-300"
        >
          {divisions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Knob
          label="Tone"
          min={120}
          max={3000}
          step={1}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#86efac"
          unit="Hz"
          size={52}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#86efac"
          unit=""
          size={52}
        />
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
                  ? 'bg-green-300 text-black border-green-200 shadow-[0_0_12px_rgba(134,239,172,0.45)]'
                  : 'bg-black/20 text-white/35 border-white/10 hover:border-green-300/40'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-green-300 !w-4 !h-4 !border-2 !border-black" />
    </div>
  );
};

export default BasslineNode;
