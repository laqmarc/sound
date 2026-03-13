import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

const NOTES = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
} as const;

const getFrequency = (note: keyof typeof NOTES, octave: number) => {
  const noteIndex = NOTES[note];
  return 440 * Math.pow(2, (noteIndex - 9 + (octave - 4) * 12) / 12);
};

const OscillatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 440;
  const waveType = (data.type as OscillatorType | undefined) ?? 'sine';
  const [note, setNote] = useState<keyof typeof NOTES>('A');
  const [octave, setOctave] = useState(4);
  const [mode, setMode] = useState<'freq' | 'note'>('note');

  const updateFrequencyFromNote = useCallback(
    (nextNote: keyof typeof NOTES, nextOctave: number) => {
      const nextFrequency = Math.round(getFrequency(nextNote, nextOctave) * 100) / 100;
      onDataChange(id, { frequency: nextFrequency });
    },
    [id, onDataChange],
  );

  const handleNoteChange = (nextNote: keyof typeof NOTES) => {
    setNote(nextNote);
    updateFrequencyFromNote(nextNote, octave);
  };

  const handleOctaveChange = (nextOctave: number) => {
    setOctave(nextOctave);
    updateFrequencyFromNote(note, nextOctave);
  };

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[220px]">
      <div className="text-sky-400 font-bold mb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
          Oscillator
        </div>
        <div className="flex bg-slate-900 rounded p-0.5">
          <button
            onClick={() => setMode('note')}
            className={`px-2 py-0.5 text-[9px] rounded ${mode === 'note' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            NOTE
          </button>
          <button
            onClick={() => setMode('freq')}
            className={`px-2 py-0.5 text-[9px] rounded ${mode === 'freq' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            FREQ
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {mode === 'note' ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[9px] uppercase block mb-1">Nota</label>
              <select
                value={note}
                onChange={(event) => handleNoteChange(event.target.value as keyof typeof NOTES)}
                className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
              >
                {Object.keys(NOTES).map((noteName) => (
                  <option key={noteName} value={noteName}>
                    {noteName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[9px] uppercase block mb-1">Octava</label>
              <select
                value={octave}
                onChange={(event) => handleOctaveChange(Number(event.target.value))}
                className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((octaveValue) => (
                  <option key={octaveValue} value={octaveValue}>
                    {octaveValue}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 text-center py-1 bg-slate-900/50 rounded text-sky-400 text-xs font-mono">
              {frequency} Hz
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Knob
              label="Frequency"
              min={20}
              max={2000}
              value={frequency}
              onChange={(value) => onDataChange(id, { frequency: value })}
              color="#38bdf8"
              unit="Hz"
              size={60}
            />
          </div>
        )}

        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Wave</label>
          <select
            value={waveType}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="mod"
        className="!bg-sky-400 !w-3 !h-3 !border-2 !border-white hover:!scale-125 transition-transform"
        style={{ top: '70%' }}
      />
      <div className="absolute left-[-30px] top-[65%] text-[8px] text-sky-400 font-bold uppercase pointer-events-none">
        Mod
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-sky-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default OscillatorNode;
