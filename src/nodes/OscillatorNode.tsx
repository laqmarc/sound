import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { updateNodeParam } from '../AudioEngine';
import Knob from '../components/Knob';

const NOTES = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

const getFrequency = (note: string, octave: number) => {
  const noteIndex = NOTES[note as keyof typeof NOTES];
  return 440 * Math.pow(2, (noteIndex - 9 + (octave - 4) * 12) / 12);
};

const OscillatorNode = ({ id, data }: any) => {
  const [freq, setFreq] = useState(data.frequency || 440);
  const [type, setType] = useState(data.type || 'sine');
  const [note, setNote] = useState('A');
  const [octave, setOctave] = useState(4);
  const [mode, setMode] = useState<'freq' | 'note'>('note');

  const updateFreqFromNote = useCallback((n: string, o: number) => {
    const f = Math.round(getFrequency(n, o) * 100) / 100;
    setFreq(f);
  }, []);

  useEffect(() => {
    updateNodeParam(id, 'frequency', freq);
    updateNodeParam(id, 'type', type);
  }, [id, freq, type]);

  const handleNoteChange = (n: string) => {
    setNote(n);
    updateFreqFromNote(n, octave);
  };

  const handleOctaveChange = (o: number) => {
    setOctave(o);
    updateFreqFromNote(note, o);
  };

  return (
    <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl min-w-[220px]">
      <div className="text-sky-400 font-bold mb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
          Oscil·lador
        </div>
        <div className="flex bg-slate-900 rounded p-0.5">
          <button 
            onClick={() => setMode('note')}
            className={`px-2 py-0.5 text-[9px] rounded ${mode === 'note' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            NOTA
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
                onChange={(e) => handleNoteChange(e.target.value)}
                className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
              >
                {Object.keys(NOTES).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[9px] uppercase block mb-1">Octava</label>
              <select 
                value={octave} 
                onChange={(e) => handleOctaveChange(Number(e.target.value))}
                className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
              >
                {[0,1,2,3,4,5,6,7,8].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-span-2 text-center py-1 bg-slate-900/50 rounded text-sky-400 text-xs font-mono">
              {freq} Hz
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Knob 
              label="Freqüència"
              min={20}
              max={2000}
              value={freq}
              onChange={setFreq}
              color="#38bdf8"
              unit="Hz"
              size={60}
            />
          </div>
        )}

        <div>
          <label className="text-slate-400 text-[9px] uppercase block mb-1">Tipus d'Ona</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-sky-400"
          >
            <option value="sine">Sinusoïdal</option>
            <option value="square">Quadrada</option>
            <option value="sawtooth">Dent de serra</option>
            <option value="triangle">Triangular</option>
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
      <div className="absolute left-[-30px] top-[65%] text-[8px] text-sky-400 font-bold uppercase pointer-events-none">Mod</div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-sky-400 !w-4 !h-4 !border-2 !border-white hover:!scale-125 transition-transform" 
      />
    </div>
  );
};

export default OscillatorNode;
