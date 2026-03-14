import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { getStereoAnalysers } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './DisplayNode.css';

const LissajousNode = ({ id }: SoundNodeProps) => {
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
      const stereo = getStereoAnalysers(id);
      if (!stereo) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const left = new Float32Array(512);
      const right = new Float32Array(512);
      stereo.left.getFloatTimeDomainData(left);
      stereo.right.getFloatTimeDomainData(right);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1.5;

      for (let index = 0; index < left.length; index += 1) {
        const x = (left[index] * 0.46 + 0.5) * canvas.width;
        const y = (right[index] * 0.46 + 0.5) * canvas.height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

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
    <div
      className="node-chrome display-node"
      style={{ '--display-width': '220px', '--display-accent': '#7dd3fc' } as CSSProperties}
    >
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Mirall X/Y
      </div>

      <div className="display-node__screen">
        <canvas ref={canvasRef} width={200} height={120} className="display-node__canvas" />
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-sky node-handle--small" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-sky node-handle--small" />
    </div>
  );
};

export default LissajousNode;
