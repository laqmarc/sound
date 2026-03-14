import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getAudioContextState, getDestinationAnalyser } from '../AudioEngine';
import './DestinationNode.css';

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

  const db = level > 0.00001 ? 20 * Math.log10(level) : -60;
  const peakDb = peak > 0.00001 ? 20 * Math.log10(peak) : -60;
  const meter = clamp(Math.pow((db + 54) / 48, 0.72), 0, 1);
  const peakMeter = clamp(Math.pow((peakDb + 54) / 48, 0.72), 0, 1);
  const bars = Array.from({ length: 18 }, (_, index) => {
    const threshold = (index + 1) / 18;
    const isLit = meter >= threshold;
    const isPeak = Math.abs(peakMeter - threshold) < 0.06;
    const zone = index < 10 ? 'emerald' : index < 14 ? 'amber' : 'rose';

    return { zone, isLit, isPeak };
  });

  return (
    <div className={`destination-node ${isActive ? 'destination-node--active' : ''}`}>
      <div className="destination-node__header">
        <div>
          <div className={`destination-node__title ${isActive ? 'destination-node__title--active' : ''}`}>
            <div className={`destination-node__dot ${isActive ? 'destination-node__dot--active' : ''}`} />
            Master Out
          </div>
          <p className="destination-node__description">
            {isActive ? 'Sortida viva i fent llum' : 'Motor aturat'}
          </p>
        </div>
        <div className="destination-node__badge">{db.toFixed(1)} dB</div>
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

        <div className="destination-node__meter-track">
          <div
            className="destination-node__meter-fill"
            style={{ width: `${meter * 100}%` }}
          />
          <div
            className="destination-node__meter-peak"
            style={{ left: `calc(${peakMeter * 100}% - 2px)` }}
          />
        </div>

        <div className="destination-node__footer">
          <span>Glow</span>
          <span className="destination-node__glow-value">{Math.round(meter * 100)}%</span>
        </div>
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
