import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './ScopeNode.css';

const ScopeNode = ({ id }: SoundNodeProps) => {
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
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00d2ff';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 1) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

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
    <div className="node-chrome scope-node">
      <div className="node-chrome__title scope-node__title">
        <div className="node-chrome__dot scope-node__dot" />
        Oscilloscope
      </div>

      <div className="scope-node__screen">
        <canvas ref={canvasRef} width={200} height={100} className="scope-node__canvas" />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-sky" style={{ width: '0.75rem', height: '0.75rem' }} />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-sky" style={{ width: '0.75rem', height: '0.75rem' }} />
    </div>
  );
};

export default ScopeNode;
