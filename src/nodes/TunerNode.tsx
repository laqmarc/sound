import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAnalyser } from '../AudioEngine';
import type { SoundNodeProps } from '../types';
import './nodeChrome.css';
import './DisplayNode.css';

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
    <div
      className="node-chrome display-node"
      style={{ '--display-width': '220px', '--display-accent': '#a5b4fc' } as CSSProperties}
    >
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Oracle Pitch
      </div>

      <div className="display-node__panel">
        <div className="display-node__big-value">
          {note}
          {octave !== null ? octave : ''}
        </div>
        <div className="display-node__subvalue">
          {frequency ? `${frequency.toFixed(1)} Hz` : 'No Signal'}
        </div>
        <div className="display-node__meter display-node__meter--dark" style={{ height: '0.5rem', marginTop: '0.75rem' }}>
          <div
            className="display-node__meter-fill display-node__meter-fill--tuner"
            style={{ width: `${Math.min(100, Math.abs(cents) * 2.5)}%`, marginLeft: cents >= 0 ? '50%' : `${50 - Math.min(50, Math.abs(cents) * 2.5)}%` }}
          />
        </div>
        <div className="display-node__cents">{frequency ? `${cents > 0 ? '+' : ''}${cents} ct` : '--'}</div>
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-indigo node-handle--small" />
      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-indigo node-handle--small" />
    </div>
  );
};

export default TunerNode;
