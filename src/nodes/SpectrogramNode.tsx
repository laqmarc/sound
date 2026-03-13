import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';

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
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
        Spectrum Analyzer
      </div>

      <div className="bg-black rounded-xl border border-white/5 overflow-hidden">
        <canvas ref={canvasRef} width={200} height={100} className="w-full h-[100px] block" />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default SpectrogramNode;
