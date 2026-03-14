import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './StepSynthNode.css';

const defaultSteps = () => [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
const normalizeSteps = (steps?: boolean[]) => Array.from({ length: 16 }, (_, index) => steps?.[index] ?? defaultSteps()[index] ?? false);

const SnareSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.steps);
  const [currentStep, setCurrentStep] = useState(0);
  const gain = data.gain ?? 0.65;
  const tone = data.tone ?? 180;
  const decay = data.decay ?? 0.16;

  useEffect(() => {
    const handleStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ step?: number }>;
      if (typeof customEvent.detail.step === 'number') {
        setCurrentStep(customEvent.detail.step);
      }
    };

    window.addEventListener('transport-step', handleStep);
    return () => window.removeEventListener('transport-step', handleStep);
  }, []);

  const toggleStep = (step: number) => {
    const next = normalizeSteps(steps);
    next[step] = !next[step];
    onDataChange(id, { steps: next });
  };

  return (
    <div
      className="node-chrome step-synth-node"
      style={
        {
          '--step-synth-accent': '#fda4af',
          '--step-synth-bg': 'rgba(76, 5, 25, 0.8)',
          '--step-synth-border': 'rgba(251, 113, 133, 0.2)',
          '--step-synth-step-bg': '#fda4af',
          '--step-synth-step-border': '#fecdd3',
          '--step-synth-current-shadow': '0 0 18px rgba(253, 164, 175, 0.8)',
        } as CSSProperties
      }
    >
      <div className="step-synth-node__header">
        <div>
          <div className="node-chrome__title">
            <div className="node-chrome__dot" />
            Snare Synth
          </div>
          <p className="step-synth-node__description">16-Step Snare Voice</p>
        </div>
        <div className="step-synth-node__knobs">
          <Knob label="Tone" min={120} max={600} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fda4af" unit="Hz" size={52} />
          <Knob label="Decay" min={0.05} max={0.5} step={0.01} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#fda4af" unit="s" size={52} />
          <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#fda4af" unit="" size={52} />
        </div>
      </div>

      <div className="step-synth-node__grid">
        {steps.map((isActive, step) => {
          const isCurrent = currentStep === step;
          return (
            <button
              type="button"
              key={`snare-step-${step}`}
              onClick={() => toggleStep(step)}
              className={`step-synth-node__step ${isActive ? 'step-synth-node__step--active' : ''} ${isCurrent ? 'step-synth-node__step--current' : ''} ${step % 4 === 0 ? 'step-synth-node__step--quarter' : ''}`}
            >
              {step + 1}
            </button>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Snare Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-rose" />
      </div>
    </div>
  );
};

export default SnareSynthNode;
