import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './DistortionNode.css';

const DistortionNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const amount = data.distortion ?? 400;

  return (
    <div className="node-chrome distortion-node">
      <div className="node-chrome__title distortion-node__title">
        <div className="node-chrome__dot distortion-node__dot" />
        Distortion
      </div>

      <div className="distortion-node__knob">
        <Knob
          label="Amount"
          min={0}
          max={1000}
          step={1}
          value={amount}
          onChange={(value) => onDataChange(id, { distortion: value })}
          color="#f97316"
          unit=""
          size={60}
        />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-orange" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-orange" />
    </div>
  );
};

export default DistortionNode;
