import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './PannerNode.css';

const PannerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const pan = data.pan ?? 0;

  return (
    <div className="node-chrome panner-node">
      <div className="node-chrome__title panner-node__title">
        <div className="node-chrome__dot panner-node__dot" />
        Stereo Panner
      </div>

      <div className="panner-node__body">
        <Knob
          label={pan < 0 ? 'Esquerra' : pan > 0 ? 'Dreta' : 'Centre'}
          min={-1}
          max={1}
          step={0.01}
          value={pan}
          onChange={(value) => onDataChange(id, { pan: value })}
          color="#f472b6"
          size={60}
        />
        <div className="panner-node__labels">
          <span>L</span>
          <span>R</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-pink" style={{ width: '0.75rem', height: '0.75rem' }} />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-pink" style={{ width: '0.75rem', height: '0.75rem' }} />
    </div>
  );
};

export default PannerNode;
