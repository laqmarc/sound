import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';

const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chords: ChordType[] = ['major', 'minor', 'sus2', 'sus4', 'dim'];
const divisions: SyncDivision[] = ['1/2', '1/4', '1/8'];

const ChordSeqNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const note = data.note ?? 'C';
  const octave = data.octave ?? 3;
  const chordType = data.chordType ?? 'major';
  const spread = data.spread ?? 10;
  const gain = data.gain ?? 0.22;
  const syncDivision = data.syncDivision ?? '1/4';
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
    <div className="bg-indigo-950/80 backdrop-blur-xl border border-indigo-400/20 p-4 rounded-2xl shadow-2xl min-w-[320px]">
      <div className="text-[10px] font-black tracking-widest text-indigo-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
        Chord Seq
      </div>

      <div className="grid grid-cols-4 gap-2">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
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
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
        >
          {[2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              Oct {value}
            </option>
          ))}
        </select>
        <select
          value={chordType}
          onChange={(event) => onDataChange(id, { chordType: event.target.value as ChordType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
        >
          {chords.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
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
          label="Spread"
          min={0}
          max={30}
          step={0.1}
          value={spread}
          onChange={(value) => onDataChange(id, { spread: value })}
          color="#a5b4fc"
          unit="ct"
          size={52}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#a5b4fc"
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
                  ? 'bg-indigo-300 text-black border-indigo-200 shadow-[0_0_12px_rgba(165,180,252,0.45)]'
                  : 'bg-black/20 text-white/35 border-white/10 hover:border-indigo-300/40'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-indigo-300 !w-4 !h-4 !border-2 !border-black" />
    </div>
  );
};

export default ChordSeqNode;
