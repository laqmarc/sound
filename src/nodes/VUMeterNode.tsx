import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './DisplayNode.css';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const VUMeterNode = ({ id }: SoundNodeProps) => {
  const requestRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    const draw = () => {
      const analyser = getAnalyser(id);
      if (!analyser) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);

      let sumSquares = 0;
      let peakSample = 0;
      for (let index = 0; index < buffer.length; index += 1) {
        const sample = buffer[index] ?? 0;
        sumSquares += sample * sample;
        peakSample = Math.max(peakSample, Math.abs(sample));
      }

      const rms = Math.sqrt(sumSquares / buffer.length);
      setLevel(rms);
      setPeak((currentPeak) => Math.max(peakSample, currentPeak * 0.965));

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [id]);

  const levelPercent = clamp(level * 180, 0, 100);
  const peakPercent = clamp(peak * 180, 0, 100);
  const db = level > 0.00001 ? 20 * Math.log10(level) : -60;

  return (
    <div
      className="node-chrome display-node"
      style={{ '--display-width': '220px', '--display-accent': '#86efac' } as CSSProperties}
    >
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Agulla Boja
      </div>

      <div className="display-node__panel">
        <div className="display-node__meter display-node__meter--dark">
          <div
            className="display-node__meter-fill display-node__meter-fill--vu"
            style={{ width: `${levelPercent}%` }}
          />
          <div
            className="display-node__meter-marker"
            style={{ left: `calc(${peakPercent}% - 2px)` }}
          />
        </div>
        <div className="display-node__row">
          <span>RMS</span>
          <span className="display-node__value">{db.toFixed(1)} dB</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-emerald node-handle--small" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald node-handle--small" />
    </div>
  );
};

export default VUMeterNode;
