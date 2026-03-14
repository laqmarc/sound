import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ReverbNode.css';

const ReverbNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const decay = data.decay ?? 3;
  const roomSize = data.roomSize ?? 0.55;
  const preDelay = data.delayTime ?? 0.02;
  const tone = data.tone ?? 4800;
  const mix = data.mix ?? 0.55;

  return (
    <div className="node-chrome reverb-node">
      <div className="reverb-node__header">
        <div>
          <div className="node-chrome__title reverb-node__title">
            <div className="node-chrome__dot reverb-node__dot" />
            Reverb Chamber
          </div>
          <p className="node-chrome__description">Space, tone and wet blend</p>
        </div>
        <div className="reverb-node__badge">{Math.round(mix * 100)}% wet</div>
      </div>

      <div className="reverb-node__grid nodrag">
        <Knob label="Decay" min={0.1} max={10} step={0.1} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#818cf8" size={56} />
        <Knob label="Size" min={0.2} max={1} step={0.01} value={roomSize} onChange={(value) => onDataChange(id, { roomSize: value })} color="#a78bfa" size={56} />
        <Knob label="Pre" min={0} max={0.4} step={0.001} value={preDelay} onChange={(value) => onDataChange(id, { delayTime: value })} color="#38bdf8" unit="s" size={56} />
        <Knob label="Tone" min={400} max={12000} step={10} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#22d3ee" unit="Hz" size={56} />
        <Knob label="Mix" min={0} max={1} step={0.01} value={mix} onChange={(value) => onDataChange(id, { mix: value })} color="#f472b6" size={56} />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-indigo" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-indigo" />
    </div>
  );
};

export default ReverbNode;
