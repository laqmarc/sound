import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import {
  getAudioContextState,
  getDestinationAnalyser,
  getDestinationLimiterReduction,
} from '../AudioEngine';
import type { SoundNodeProps, SoundNodeData } from '../types';
import './DestinationNode.css';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const METER_MIN_DB = -72;
const METER_MAX_DB = 3;
const METER_MARKS = [-72, -48, -36, -24, -12, -6, 0, 3];

interface DestinationNodeProps extends SoundNodeProps {
  onDataChange: (id: string, patch: Partial<SoundNodeData>) => void;
}

const DestinationNode = ({ id, data, onDataChange }: DestinationNodeProps) => {
  const [isActive, setIsActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [clipHold, setClipHold] = useState(0);
  const [gainReduction, setGainReduction] = useState(0);
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
        setClipHold((current) => (peakSample >= 0.985 ? 14 : Math.max(0, current - 1)));
        setGainReduction(getDestinationLimiterReduction());
      } else {
        setGainReduction(0);
        setClipHold((current) => Math.max(0, current - 1));
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

  const masterGain = data.gain ?? 1;
  const mono = data.mono ?? false;
  const limiterEnabled = data.limiterEnabled ?? false;
  const threshold = data.threshold ?? -6;
  const release = data.release ?? 0.08;
  const db = level > 0.00001 ? 20 * Math.log10(level) : -60;
  const peakDb = peak > 0.00001 ? 20 * Math.log10(peak) : -60;
  const meter = clamp(Math.pow((db - METER_MIN_DB) / (METER_MAX_DB - METER_MIN_DB), 0.9), 0, 1);
  const peakMeter = clamp(Math.pow((peakDb - METER_MIN_DB) / (METER_MAX_DB - METER_MIN_DB), 0.9), 0, 1);
  const limiterMeter = clamp(gainReduction / 18, 0, 1);
  const isClipping = clipHold > 0;
  const bars = Array.from({ length: 28 }, (_, index) => {
    const thresholdBar = (index + 1) / 28;
    const isLit = meter >= thresholdBar;
    const isPeak = Math.abs(peakMeter - thresholdBar) < 0.045;
    const zone = index < 16 ? 'emerald' : index < 22 ? 'amber' : 'rose';

    return { zone, isLit, isPeak };
  });

  return (
    <div className={`destination-node ${isActive ? 'destination-node--active' : ''}`}>
      <div className="destination-node__header">
        <div>
          <div className={`destination-node__title ${isActive ? 'destination-node__title--active' : ''}`}>
            <div className={`destination-node__dot ${isActive ? 'destination-node__dot--active' : ''}`} />
            Master Bus
          </div>
          <p className="destination-node__description">
            {isActive ? 'Sortida final amb control global' : 'Motor aturat'}
          </p>
        </div>
        <div className="destination-node__badges">
          <div className={`destination-node__badge ${isClipping ? 'destination-node__badge--clip' : ''}`}>
            {isClipping ? 'CLIP' : `${db.toFixed(1)} dB`}
          </div>
          <div className="destination-node__badge">{mono ? 'Mono' : 'Stereo'}</div>
        </div>
      </div>

      <div className="destination-node__panel">
        <div className="destination-node__bars">
          {bars.map((bar, index) => (
            <div
              key={`dest-vu-${index}`}
              className={[
                'destination-node__bar',
                `destination-node__bar--${bar.zone}`,
                bar.isPeak ? 'destination-node__bar--peak' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                opacity: bar.isLit ? 1 : 0.18,
                transform: `scaleY(${bar.isLit ? 1 : 0.72})`,
                boxShadow: bar.isPeak ? undefined : bar.isLit ? '0 0 12px rgba(251,113,133,0.18)' : 'none',
              }}
            />
          ))}
        </div>

        <div className="destination-node__meter-shell">
          <div className="destination-node__meter-track">
            <div className="destination-node__meter-fill" style={{ width: `${meter * 100}%` }} />
            <div className="destination-node__meter-peak" style={{ left: `calc(${peakMeter * 100}% - 2px)` }} />
          </div>
          <div className="destination-node__meter-scale">
            {METER_MARKS.map((mark) => {
              const position = clamp(((mark - METER_MIN_DB) / (METER_MAX_DB - METER_MIN_DB)) * 100, 0, 100);
              return (
                <div
                  key={`meter-mark-${mark}`}
                  className="destination-node__meter-mark"
                  style={{ left: `calc(${position}% - 8px)` }}
                >
                  {mark}
                </div>
              );
            })}
          </div>
        </div>

        <div className="destination-node__stats">
          <div className="destination-node__stat">
            <span>Peak</span>
            <strong>{peakDb.toFixed(1)} dB</strong>
          </div>
          <div className="destination-node__stat">
            <span>GR</span>
            <strong>{limiterEnabled ? `${gainReduction.toFixed(1)} dB` : 'Bypass'}</strong>
          </div>
        </div>

        <div className="destination-node__reduction-track">
          <div className="destination-node__reduction-fill" style={{ width: `${limiterMeter * 100}%` }} />
        </div>
      </div>

      <div className="destination-node__controls nodrag">
        <Knob
          label="Gain"
          min={0}
          max={2}
          step={0.01}
          value={masterGain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#34d399"
          unit="x"
          size={50}
        />
        <Knob
          label="Thresh"
          min={-24}
          max={0}
          step={1}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#fb7185"
          unit="dB"
          size={50}
        />
        <Knob
          label="Release"
          min={0.02}
          max={1}
          step={0.01}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#fbbf24"
          unit="s"
          size={50}
        />
      </div>

      <div className="destination-node__switches nodrag">
        <button
          type="button"
          onClick={() => onDataChange(id, { mono: !mono })}
          className={`destination-node__switch ${mono ? 'destination-node__switch--active' : ''}`}
        >
          {mono ? 'Mono On' : 'Stereo'}
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { limiterEnabled: !limiterEnabled })}
          className={`destination-node__switch ${limiterEnabled ? 'destination-node__switch--active-rose' : ''}`}
        >
          {limiterEnabled ? 'Limiter On' : 'Limiter Bypass'}
        </button>
      </div>

      <div className="destination-node__footer">
        <span>Master</span>
        <span className="destination-node__glow-value">{Math.round(meter * 100)}%</span>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="destination-node__handle"
      />
    </div>
  );
};

export default DestinationNode;
