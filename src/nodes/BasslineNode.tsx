import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';
import './nodeChrome.css';
import './BasslineNode.css';

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
    <div className="node-chrome bassline-node">
      <div className="node-chrome__title bassline-node__title">
        <div className="node-chrome__dot bassline-node__dot" />
        Bassline
      </div>

      <div className="bassline-node__top-grid">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="bassline-node__select"
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
          className="bassline-node__select"
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
          className="bassline-node__select"
        >
          {divisions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="bassline-node__knobs">
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

      <div className="bassline-node__steps">
        {Array.from({ length: 16 }, (_, index) => {
          const active = steps[index] ?? false;
          return (
            <button
              type="button"
              key={index}
              onClick={() => toggleStep(index)}
              className={`bassline-node__step ${active ? 'bassline-node__step--active' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-green" />
    </div>
  );
};

export default BasslineNode;
