import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAudioContextState, getDestinationAnalyser } from '../AudioEngine';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const DestinationNode = () => {
  const [isActive, setIsActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const running = getAudioContextState() === 'running';
      setIsActive(running);

      const analyser = running ? getDestinationAnalyser() : null;
      if (analyser) {
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
        setPeak((currentPeak) => Math.max(peakSample, currentPeak * 0.95));
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const meter = clamp(level * 220, 0, 1);
  const peakMeter = clamp(peak * 220, 0, 1);
  const db = level > 0.00001 ? 20 * Math.log10(level) : -60;
  const bars = Array.from({ length: 18 }, (_, index) => {
    const threshold = (index + 1) / 18;
    const isLit = meter >= threshold;
    const isPeak = Math.abs(peakMeter - threshold) < 0.06;
    const hue =
      index < 10 ? 'from-emerald-400 to-emerald-300' : index < 14 ? 'from-amber-400 to-yellow-300' : 'from-rose-500 to-orange-400';

    return { hue, isLit, isPeak };
  });

  return (
    <div
      className={`min-w-[260px] rounded-[24px] border p-4 transition-all duration-300 ${
        isActive
          ? 'border-rose-400/30 bg-[linear-gradient(145deg,rgba(9,12,24,0.98),rgba(50,10,24,0.94))] shadow-[0_0_34px_rgba(244,63,94,0.22)]'
          : 'border-slate-800 bg-[linear-gradient(145deg,rgba(6,8,18,0.98),rgba(16,20,28,0.96))]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className={`mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-rose-300' : 'text-slate-500'}`}>
            <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.9)] animate-pulse' : 'bg-slate-600'}`} />
            Master Out
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            {isActive ? "Sortida viva i fent llum" : "Motor aturat"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-mono text-cyan-200">
          {db.toFixed(1)} dB
        </div>
      </div>

      <div className="rounded-[20px] border border-white/10 bg-black/28 p-3">
        <div className="mb-3 flex items-end gap-1">
          {bars.map((bar, index) => (
            <div
              key={`dest-vu-${index}`}
              className={`h-14 flex-1 rounded-[10px] border border-white/8 bg-white/5 transition-all ${
                bar.isLit ? `bg-gradient-to-t ${bar.hue}` : ''
              }`}
              style={{
                opacity: bar.isLit ? 1 : 0.18,
                transform: `scaleY(${bar.isLit ? 1 : 0.72})`,
                boxShadow: bar.isPeak
                  ? '0 0 14px rgba(255,255,255,0.75), 0 0 22px rgba(251,113,133,0.55)'
                  : bar.isLit
                    ? '0 0 12px rgba(251,113,133,0.18)'
                    : 'none',
              }}
            />
          ))}
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-400 transition-all"
            style={{ width: `${meter * 100}%` }}
          />
          <div
            className="absolute inset-y-0 w-1 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
            style={{ left: `calc(${peakMeter * 100}% - 2px)` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>Glow</span>
          <span className="text-emerald-300">{Math.round(meter * 100)}%</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-5 !w-5 !border-2 !border-white !bg-rose-500 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default DestinationNode;
