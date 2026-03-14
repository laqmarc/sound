import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName } from '../types';

const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chordTypes: ChordType[] = ['major', 'minor', 'sus2', 'sus4', 'dim'];

const DronePadNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const note = data.note ?? 'C';
  const octave = data.octave ?? 3;
  const chordType = data.chordType ?? 'minor';
  const spread = data.spread ?? 14;
  const gain = data.gain ?? 0.25;
  const wave = (data.type as OscillatorType | undefined) ?? 'sawtooth';

  return (
    <div className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/20 p-4 rounded-2xl shadow-2xl min-w-[280px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
        Drone Pad
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Root</label>
          <select
            value={note}
            onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
          >
            {notes.map((noteName) => (
              <option key={noteName} value={noteName}>
                {noteName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Oct</label>
          <select
            value={octave}
            onChange={(event) => onDataChange(id, { octave: Number(event.target.value) })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
          >
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Chord</label>
          <select
            value={chordType}
            onChange={(event) => onDataChange(id, { chordType: event.target.value as ChordType })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
          >
            {chordTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <Knob
          label="Spread"
          min={0}
          max={35}
          step={0.1}
          value={spread}
          onChange={(value) => onDataChange(id, { spread: value })}
          color="#86efac"
          unit="ct"
          size={50}
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
          size={50}
        />
        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Wave</label>
          <select
            value={wave}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-emerald-400/20 w-full outline-none focus:border-emerald-300"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-emerald-300 !w-4 !h-4 !border-2 !border-black" />
    </div>
  );
};

export default DronePadNode;
