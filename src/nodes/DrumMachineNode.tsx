import { useEffect, useState, type CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, DrumPattern } from '../types';
import './nodeChrome.css';
import './DrumMachineNode.css';

const defaultPattern = (): DrumPattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
});

const normalizePattern = (pattern?: DrumPattern): DrumPattern => {
  const base = pattern ?? defaultPattern();

  return {
    kick: Array.from({ length: 16 }, (_, index) => base.kick[index] ?? false),
    snare: Array.from({ length: 16 }, (_, index) => base.snare[index] ?? false),
    hihat: Array.from({ length: 16 }, (_, index) => base.hihat[index] ?? false),
  };
};

const channels: Array<{ key: keyof DrumPattern; label: string; accent: string; glow: string }> = [
  { key: 'kick', label: 'Kick', accent: '#22d3ee', glow: 'rgba(34,211,238,0.45)' },
  { key: 'snare', label: 'Snare', accent: '#fb7185', glow: 'rgba(251,113,133,0.45)' },
  { key: 'hihat', label: 'Hi-Hat', accent: '#fcd34d', glow: 'rgba(252,211,77,0.45)' },
];

interface DrumMachineStepEventDetail {
  step?: number;
  bpm?: number;
}

const DrumMachineNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const [transportBpm, setTransportBpm] = useState(data.bpm ?? 120);
  const pattern = normalizePattern(data.drumPattern);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleStep = (event: Event) => {
      const customEvent = event as CustomEvent<DrumMachineStepEventDetail>;
      if (typeof customEvent.detail.step !== 'number') {
        return;
      }

      setCurrentStep(customEvent.detail.step);
    };

    window.addEventListener('transport-step', handleStep);
    return () => window.removeEventListener('transport-step', handleStep);
  }, []);

  useEffect(() => {
    const handleTransportState = (event: Event) => {
      const customEvent = event as CustomEvent<DrumMachineStepEventDetail>;
      if (typeof customEvent.detail.bpm === 'number') {
        setTransportBpm(customEvent.detail.bpm);
      }
    };

    window.addEventListener('transport-state', handleTransportState);
    return () => window.removeEventListener('transport-state', handleTransportState);
  }, []);

  const toggleStep = (channel: keyof DrumPattern, step: number) => {
    const nextPattern = normalizePattern(pattern);
    nextPattern[channel][step] = !nextPattern[channel][step];
    onDataChange(id, { drumPattern: nextPattern });
  };

  return (
    <div className="node-chrome drum-machine-node">
      <div className="drum-machine-node__header">
        <div>
          <div className="node-chrome__title drum-machine-node__title">
            <div className="node-chrome__dot drum-machine-node__dot" />
            Drum Machine
          </div>
          <p className="node-chrome__description">16-Step Loop Sequencer</p>
        </div>

        <div className="drum-machine-node__header-right">
          <div className="drum-machine-node__indicator-grid">
            {Array.from({ length: 16 }, (_, step) => (
              <div
                key={`indicator-${step}`}
                className={`drum-machine-node__indicator ${currentStep === step ? 'drum-machine-node__indicator--current' : ''}`}
              />
            ))}
          </div>

          <Knob
            label="BPM"
            min={60}
            max={180}
            step={1}
            value={transportBpm}
            onChange={(value) => onDataChange(id, { bpm: value })}
            color="#fb7185"
            size={56}
          />
        </div>
      </div>

      <div className="drum-machine-node__labels">
        <div />
        {Array.from({ length: 16 }, (_, step) => (
          <div
            key={`step-label-${step}`}
            className={[
              'drum-machine-node__step-label',
              currentStep === step ? 'drum-machine-node__step-label--current' : '',
              step % 4 === 0 ? 'drum-machine-node__step-label--quarter' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {step + 1}
          </div>
        ))}
      </div>

      <div className="drum-machine-node__rows">
        {channels.map((channel) => (
          <div key={channel.key} className="drum-machine-node__row">
            <div className="drum-machine-node__row-label">{channel.label}</div>
            {pattern[channel.key].map((isActive, step) => {
              const isCurrentStep = currentStep === step;
              const style = {
                background: isActive ? channel.accent : undefined,
                boxShadow: isActive && isCurrentStep ? `0 0 16px ${channel.glow}` : undefined,
              } as CSSProperties;

              return (
                <button
                  type="button"
                  key={`${channel.key}-${step}`}
                  onClick={() => toggleStep(channel.key, step)}
                  className={[
                    'drum-machine-node__step',
                    isActive ? 'drum-machine-node__step--active' : '',
                    step % 4 === 0 ? 'drum-machine-node__step--quarter' : '',
                    isCurrentStep ? 'drum-machine-node__step--current' : '',
                    isCurrentStep && !isActive ? 'drum-machine-node__step--current-idle' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={style}
                >
                  {isActive ? 'ON' : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Loop Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle--source node-handle--source-rose"
        />
      </div>
    </div>
  );
};

export default DrumMachineNode;
