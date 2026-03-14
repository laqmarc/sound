import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './OscillatorNode.css';

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
    <div className="node-chrome oscillator-node">
      <div className="oscillator-node__header">
        <div className="oscillator-node__title-row">
          <div className="node-chrome__dot oscillator-node__dot" />
          <div className="node-chrome__title oscillator-node__title">Oscillator</div>
        </div>
        <div className="oscillator-node__mode-toggle">
          <button type="button" onClick={() => setMode('note')} className={`oscillator-node__mode-button ${mode === 'note' ? 'oscillator-node__mode-button--active' : ''}`}>NOTE</button>
          <button type="button" onClick={() => setMode('freq')} className={`oscillator-node__mode-button ${mode === 'freq' ? 'oscillator-node__mode-button--active' : ''}`}>FREQ</button>
        </div>
      </div>

      <div className="oscillator-node__body">
        {mode === 'note' ? (
          <div className="oscillator-node__note-grid">
            <div>
              <label className="oscillator-node__label">Nota</label>
              <select
                value={note}
                onChange={(event) => handleNoteChange(event.target.value as keyof typeof NOTES)}
                className="oscillator-node__select"
              >
                {Object.keys(NOTES).map((noteName) => (
                  <option key={noteName} value={noteName}>
                    {noteName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="oscillator-node__label">Octava</label>
              <select
                value={octave}
                onChange={(event) => handleOctaveChange(Number(event.target.value))}
                className="oscillator-node__select"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((octaveValue) => (
                  <option key={octaveValue} value={octaveValue}>
                    {octaveValue}
                  </option>
                ))}
              </select>
            </div>
            <div className="oscillator-node__freq-readout">{frequency} Hz</div>
          </div>
        ) : (
          <div className="oscillator-node__knob">
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
          <label className="oscillator-node__label">Wave</label>
          <select
            value={waveType}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="oscillator-node__select"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="mod" className="node-handle--source node-handle--source-sky" style={{ top: '70%', width: '0.75rem', height: '0.75rem' }} />
      <div className="oscillator-node__mod-label">Mod</div>

      <Handle type="target" position={Position.Left} id="pitch" className="node-handle--pitch" style={{ top: '28%' }} />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--lead">Pitch</div>

      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-sky" />
    </div>
  );
};

export default OscillatorNode;
