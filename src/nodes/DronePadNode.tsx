import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ChordType, ControllableSoundNodeProps, NoteName } from '../types';
import './nodeChrome.css';
import './DronePadNode.css';

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
    <div className="node-chrome drone-pad-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Drone Pad
      </div>

      <div className="drone-pad-node__top-grid">
        <div>
          <label className="node-chrome__field-label">Root</label>
          <select
            value={note}
            onChange={(event) => onDataChange(id, { note: event.target.value as NoteName })}
            className="node-chrome__select"
          >
            {notes.map((noteName) => (
              <option key={noteName} value={noteName}>
                {noteName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Oct</label>
          <select
            value={octave}
            onChange={(event) => onDataChange(id, { octave: Number(event.target.value) })}
            className="node-chrome__select"
          >
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Chord</label>
          <select
            value={chordType}
            onChange={(event) => onDataChange(id, { chordType: event.target.value as ChordType })}
            className="node-chrome__select"
          >
            {chordTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="drone-pad-node__bottom-grid">
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
          <label className="node-chrome__field-label">Wave</label>
          <select
            value={wave}
            onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
            className="node-chrome__select"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Saw</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Pad Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald" />
      </div>
    </div>
  );
};

export default DronePadNode;
