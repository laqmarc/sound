import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getStereoAnalysers } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './DisplayNode.css';

const PhaseCorrelatorNode = ({ id }: SoundNodeProps) => {
  const requestRef = useRef<number | null>(null);
  const [correlation, setCorrelation] = useState(0);

  useEffect(() => {
    const draw = () => {
      const stereo = getStereoAnalysers(id);
      if (!stereo) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const left = new Float32Array(stereo.left.fftSize);
      const right = new Float32Array(stereo.right.fftSize);
      stereo.left.getFloatTimeDomainData(left);
      stereo.right.getFloatTimeDomainData(right);

      let dot = 0;
      let leftEnergy = 0;
      let rightEnergy = 0;
      for (let index = 0; index < left.length; index += 1) {
        const l = left[index] ?? 0;
        const r = right[index] ?? 0;
        dot += l * r;
        leftEnergy += l * l;
        rightEnergy += r * r;
      }

      const denominator = Math.sqrt(leftEnergy * rightEnergy);
      setCorrelation(denominator > 0 ? dot / denominator : 0);
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [id]);

  const markerLeft = `${((correlation + 1) / 2) * 100}%`;
  const status =
    correlation < -0.2 ? 'Danger Mono' : correlation < 0.35 ? 'Wide Weird' : correlation < 0.8 ? 'Open' : 'Mono Safe';

  return (
    <div
      className="node-chrome display-node"
      style={{ '--display-width': '240px', '--display-accent': '#fda4af' } as CSSProperties}
    >
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Fase Mutant
      </div>

      <div className="display-node__panel">
        <div className="display-node__meter display-node__meter--phase">
          <div className="display-node__meter-center" />
          <div
            className="display-node__meter-marker"
            style={{ left: `calc(${markerLeft} - 2px)` }}
          />
        </div>
        <div className="display-node__row">
          <span>{status}</span>
          <span className="display-node__value">{correlation.toFixed(2)}</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-rose node-handle--small" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-rose node-handle--small" />
    </div>
  );
};

export default PhaseCorrelatorNode;
