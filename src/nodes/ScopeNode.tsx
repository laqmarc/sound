import React, { useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';

const ScopeNode = ({ id }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

      for (let i = 0; i < bufferLength; i++) {
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
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [id]);

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-sky-400 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
        Oscilloscope
      </div>
      
      <div className="bg-black rounded-xl border border-white/5 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={100} 
          className="w-full h-[100px] block"
        />
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-sky-400 !w-3 !h-3 !border-2 !border-black" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-sky-400 !w-3 !h-3 !border-2 !border-black" 
      />
    </div>
  );
};

export default ScopeNode;
