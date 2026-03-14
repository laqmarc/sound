import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName } from '../types';
import './nodeChrome.css';
import './ChordGeneratorNode.css';

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
    <div className="node-chrome chord-generator-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Chord Generator
      </div>

      <div className="chord-generator-node__grid">
        <select
          value={note}
          onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
          className="node-chrome__select"
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
          className="node-chrome__select"
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
          className="node-chrome__select"
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
          className="node-chrome__select"
        >
          <option value="triangle">Triangle</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Saw</option>
          <option value="square">Square</option>
        </select>
      </div>

      <div className="node-chrome__grid-2">
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

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Chord Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-indigo" />
      </div>
    </div>
  );
};

export default ChordGeneratorNode;
