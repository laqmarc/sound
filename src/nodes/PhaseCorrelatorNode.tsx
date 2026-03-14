import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getStereoAnalysers } from '../AudioEngine';
import type { SoundNodeProps } from '../types';

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
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[240px]">
      <div className="text-[10px] font-black tracking-widest text-rose-300 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" />
        Fase Mutant
      </div>

      <div className="bg-black rounded-xl border border-white/5 p-3">
        <div className="relative h-4 rounded-full bg-gradient-to-r from-rose-500/30 via-white/10 to-emerald-500/30">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ left: `calc(${markerLeft} - 2px)` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] uppercase tracking-[0.2em] text-white/45">
          <span>{status}</span>
          <span className="font-mono text-rose-300">{correlation.toFixed(2)}</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-rose-300 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-rose-300 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default PhaseCorrelatorNode;
