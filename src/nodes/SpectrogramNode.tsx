import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './DisplayNode.css';

const SpectrogramNode = ({ id }: SoundNodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const draw = () => {
      const analyser = getAnalyser(id);
      if (!analyser) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 1) {
        const barHeight = dataArray[i] / 2;
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [id]);

  return (
    <div
      className="node-chrome display-node"
      style={{ '--display-width': '220px', '--display-accent': '#c084fc' } as CSSProperties}
    >
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Spectrum Analyzer
      </div>

      <div className="display-node__screen">
        <canvas ref={canvasRef} width={200} height={100} className="display-node__canvas" />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-purple node-handle--small" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-purple node-handle--small" />
    </div>
  );
};

export default SpectrogramNode;
