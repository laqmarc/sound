import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ThreeKnobFxNode.css';
import './NoiseLayerNode.css';

const NoiseLayerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const tone = data.tone ?? 2800;
  const Q = data.Q ?? 0.8;
  const gain = data.gain ?? 0.18;
  const filterType = (data.type as BiquadFilterType | undefined) ?? 'lowpass';

  return (
    <div className="node-chrome three-knob-fx-node noise-layer-node">
      <div className="node-chrome__title three-knob-fx-node__title">
        <div className="node-chrome__dot three-knob-fx-node__dot" />
        Noise Layer
      </div>

      <div className="three-knob-fx-node__grid">
        <Knob
          label="Tone"
          min={100}
          max={12000}
          step={10}
          value={tone}
          onChange={(value) => onDataChange(id, { tone: value })}
          color="#d6d3d1"
          unit="Hz"
          size={50}
        />
        <Knob
          label="Q"
          min={0.1}
          max={20}
          step={0.1}
          value={Q}
          onChange={(value) => onDataChange(id, { Q: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#d6d3d1"
          unit=""
          size={50}
        />
      </div>

      <div className="noise-layer-node__select-wrap">
        <label className="node-chrome__field-label">Filter</label>
        <select
          value={filterType}
          onChange={(event) => onDataChange(id, { type: event.target.value as BiquadFilterType })}
          className="node-chrome__select"
        >
          <option value="lowpass">Lowpass</option>
          <option value="bandpass">Bandpass</option>
          <option value="highpass">Highpass</option>
        </select>
      </div>

      <div className="node-chrome__footer">
        <span className="three-knob-fx-node__footer-label">Air Layer</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-stone" />
      </div>
    </div>
  );
};

export default NoiseLayerNode;
