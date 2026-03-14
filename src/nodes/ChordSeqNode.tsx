import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';
import './nodeChrome.css';
import './ChordGeneratorNode.css';

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
    <div className="node-chrome chord-seq-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Chord Seq
      </div>

      <div className="chord-seq-node__controls">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="node-chrome__select"
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
          className="node-chrome__select"
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
          className="node-chrome__select"
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
          className="node-chrome__select"
        >
          {divisions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="node-chrome__grid-2 chord-seq-node__knobs">
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

      <div className="chord-seq-node__steps">
        {Array.from({ length: 16 }, (_, index) => {
          const active = steps[index] ?? false;
          return (
            <button
              type="button"
              key={index}
              onClick={() => toggleStep(index)}
              className={`chord-seq-node__step ${active ? 'chord-seq-node__step--active' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Chord Seq Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-indigo" />
      </div>
    </div>
  );
};

export default ChordSeqNode;
