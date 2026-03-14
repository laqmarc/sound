import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './BitcrusherNode.css';

const BitcrusherNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const bits = data.bits ?? 6;
  const normFreq = data.normFreq ?? 0.2;
  const mix = data.mix ?? 0.7;

  return (
    <div className="node-chrome bitcrusher-node">
      <div className="node-chrome__title bitcrusher-node__title">
        <div className="node-chrome__dot bitcrusher-node__dot" />
        Bitcrusher
      </div>

      <div className="bitcrusher-node__grid">
        <Knob label="Bits" min={1} max={16} step={1} value={bits} onChange={(value) => onDataChange(id, { bits: value })} color="#fdba74" unit="" size={50} />
        <Knob label="Rate" min={0.01} max={1} step={0.01} value={normFreq} onChange={(value) => onDataChange(id, { normFreq: value })} color="#fdba74" unit="" size={50} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#fdba74" unit="" size={50} />
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Digital Dirt</span>
        <div className="bitcrusher-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-orange" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-orange" />
        </div>
      </div>
    </div>
  );
};

export default BitcrusherNode;
