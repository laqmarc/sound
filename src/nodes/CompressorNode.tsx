import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './CompressorNode.css';

const CompressorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const threshold = data.threshold ?? -24;
  const knee = data.knee ?? 18;
  const ratio = data.ratio ?? 6;
  const attack = data.attack ?? 0.01;
  const release = data.release ?? 0.25;
  const makeup = data.makeup ?? 1;

  return (
    <div className="node-chrome compressor-node">
      <div className="node-chrome__title compressor-node__title">
        <div className="node-chrome__dot compressor-node__dot" />
        Compressor
      </div>

      <div className="compressor-node__grid">
        <Knob
          label="Thresh"
          min={-60}
          max={0}
          step={1}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#6ee7b7"
          unit="dB"
          size={50}
        />
        <Knob
          label="Knee"
          min={0}
          max={40}
          step={1}
          value={knee}
          onChange={(value) => onDataChange(id, { knee: value })}
          color="#6ee7b7"
          unit=""
          size={50}
        />
        <Knob
          label="Ratio"
          min={1}
          max={20}
          step={0.1}
          value={ratio}
          onChange={(value) => onDataChange(id, { ratio: value })}
          color="#6ee7b7"
          unit=""
          size={50}
        />
        <Knob
          label="Attack"
          min={0}
          max={1}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#6ee7b7"
          unit="s"
          size={50}
        />
        <Knob
          label="Release"
          min={0.01}
          max={1}
          step={0.001}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#6ee7b7"
          unit="s"
          size={50}
        />
        <Knob
          label="Makeup"
          min={0}
          max={4}
          step={0.01}
          value={makeup}
          onChange={(value) => onDataChange(id, { makeup: value })}
          color="#6ee7b7"
          unit="x"
          size={50}
        />
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Dynamics</span>
        <div className="compressor-node__handles">
          <Handle
            type="target"
            position={Position.Left}
            className="node-handle--source node-handle--source-emerald"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="node-handle--source node-handle--source-emerald"
          />
        </div>
      </div>
    </div>
  );
};

export default CompressorNode;
