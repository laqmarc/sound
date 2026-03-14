import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './GainNode.css';

const GainNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const gain = data.gain ?? 0.5;

  return (
    <div className="node-chrome gain-node">
      <div className="node-chrome__title gain-node__title">
        <div className="node-chrome__dot gain-node__dot" />
        Gain
      </div>

      <div className="gain-node__knob">
        <Knob
          label="Volum"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#10b981"
          unit=""
          size={60}
        />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-emerald" />
      <Handle
        type="target"
        position={Position.Left}
        id="mod"
        className="node-handle--source node-handle--source-emerald"
        style={{ top: '70%', width: '0.75rem', height: '0.75rem' }}
      />
      <div className="gain-node__mod-label">Mod</div>

      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald" />
    </div>
  );
};

export default GainNode;
