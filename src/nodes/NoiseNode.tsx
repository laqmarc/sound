import { Handle, Position } from 'reactflow';
import './nodeChrome.css';
import './NoiseNode.css';

const NoiseNode = () => {
  return (
    <div className="node-chrome noise-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Soroll (Noise)
      </div>
      <p className="noise-node__description">Soroll blanc pur</p>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Pure Noise</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-slate" />
      </div>
    </div>
  );
};

export default NoiseNode;
