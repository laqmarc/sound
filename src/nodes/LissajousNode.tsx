import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { getStereoAnalysers } from '../AudioEngine';
import type { SoundNodeProps } from '../types';

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
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-sky-300 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-sky-300 rounded-full animate-pulse" />
        Mirall X/Y
      </div>

      <div className="bg-black rounded-xl border border-white/5 overflow-hidden">
        <canvas ref={canvasRef} width={200} height={120} className="w-full h-[120px] block" />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-sky-300 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-sky-300 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default LissajousNode;
