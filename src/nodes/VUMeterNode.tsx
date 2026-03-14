import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';

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
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
        Agulla Boja
      </div>

      <div className="bg-black rounded-xl border border-white/5 p-3">
        <div className="relative h-4 rounded-full bg-white/5 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-400 transition-all"
            style={{ width: `${levelPercent}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ left: `calc(${peakPercent}% - 2px)` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] uppercase tracking-[0.2em] text-white/45">
          <span>RMS</span>
          <span className="font-mono text-emerald-300">{db.toFixed(1)} dB</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-emerald-300 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-emerald-300 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default VUMeterNode;
