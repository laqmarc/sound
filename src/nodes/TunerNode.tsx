import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const detectPitch = (buffer: Float32Array, sampleRate: number) => {
  let rms = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    const sample = buffer[index] ?? 0;
    rms += sample * sample;
  }
  rms = Math.sqrt(rms / buffer.length);

  if (rms < 0.01) {
    return null;
  }

  let bestLag = -1;
  let bestCorrelation = 0;
  const minLag = Math.floor(sampleRate / 1200);
  const maxLag = Math.floor(sampleRate / 50);

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    for (let index = 0; index < buffer.length - lag; index += 1) {
      correlation += buffer[index] * buffer[index + lag];
    }
    correlation /= buffer.length - lag;

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag === -1 || bestCorrelation < 0.02) {
    return null;
  }

  return sampleRate / bestLag;
};

const TunerNode = ({ id }: SoundNodeProps) => {
  const requestRef = useRef<number | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);

  useEffect(() => {
    const draw = () => {
      const analyser = getAnalyser(id);
      if (!analyser) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);
      setFrequency(detectPitch(buffer, analyser.context.sampleRate));
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [id]);

  const midi = frequency ? Math.round(69 + 12 * Math.log2(frequency / 440)) : null;
  const note = midi !== null ? NOTE_NAMES[((midi % 12) + 12) % 12] : '--';
  const octave = midi !== null ? Math.floor(midi / 12) - 1 : null;
  const targetFrequency = midi !== null ? 440 * Math.pow(2, (midi - 69) / 12) : null;
  const cents = frequency && targetFrequency ? Math.round(1200 * Math.log2(frequency / targetFrequency)) : 0;

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[220px]">
      <div className="text-[10px] font-black tracking-widest text-indigo-300 uppercase mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
        Oracle Pitch
      </div>

      <div className="bg-black rounded-xl border border-white/5 p-4 text-center">
        <div className="text-4xl font-black tracking-tight text-indigo-300">
          {note}
          {octave !== null ? octave : ''}
        </div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
          {frequency ? `${frequency.toFixed(1)} Hz` : 'No Signal'}
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-white to-emerald-400 transition-all"
            style={{ width: `${Math.min(100, Math.abs(cents) * 2.5)}%`, marginLeft: cents >= 0 ? '50%' : `${50 - Math.min(50, Math.abs(cents) * 2.5)}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] font-mono text-white/55">{frequency ? `${cents > 0 ? '+' : ''}${cents} ct` : '--'}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-300 !w-3 !h-3 !border-2 !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-300 !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default TunerNode;
