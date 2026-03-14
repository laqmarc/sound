import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName } from '../types';

const noteOptions: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chordOptions: ChordType[] = ['major', 'minor', 'sus2', 'sus4', 'dim'];

const ChordGeneratorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const note = data.note ?? 'C';
  const octave = data.octave ?? 4;
  const chordType = data.chordType ?? 'major';
  const spread = data.spread ?? 10;
  const gain = data.gain ?? 0.22;
  const waveType = (data.type as OscillatorType | undefined) ?? 'triangle';

  return (
    <div className="bg-indigo-950/80 backdrop-blur-xl border border-indigo-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-indigo-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
        Chord Generator
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
        >
          {noteOptions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select
          value={octave}
          onChange={(event) => onDataChange(id, { octave: Number(event.target.value) })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
        >
          {[2, 3, 4, 5, 6].map((value) => (
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
          {chordOptions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select
          value={waveType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="bg-slate-900 text-white text-xs p-1.5 rounded border border-indigo-400/20 outline-none focus:border-indigo-300"
        >
          <option value="triangle">Triangle</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Saw</option>
          <option value="square">Square</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Knob
          label="Spread"
          min={0}
          max={30}
          step={0.5}
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

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Chord Out</span>
        <Handle type="source" position={Position.Right} className="!bg-indigo-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default ChordGeneratorNode;
