import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './StepSynthNode.css';

const defaultSteps = () => Array.from({ length: 16 }, () => true);
const normalizeSteps = (steps?: boolean[]) => Array.from({ length: 16 }, (_, index) => steps?.[index] ?? defaultSteps()[index] ?? false);

const HiHatSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.steps);
  const [currentStep, setCurrentStep] = useState(0);
  const gain = data.gain ?? 0.4;
  const tone = data.tone ?? 9500;
  const decay = data.decay ?? 0.06;

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
          '--step-synth-accent': '#fcd34d',
          '--step-synth-bg': 'rgba(120, 53, 15, 0.8)',
          '--step-synth-border': 'rgba(251, 191, 36, 0.2)',
          '--step-synth-step-bg': '#fcd34d',
          '--step-synth-step-border': '#fde68a',
          '--step-synth-current-shadow': '0 0 18px rgba(252, 211, 77, 0.8)',
        } as CSSProperties
      }
    >
      <div className="step-synth-node__header">
        <div>
          <div className="node-chrome__title">
            <div className="node-chrome__dot" />
            HiHat Synth
          </div>
          <p className="step-synth-node__description">16-Step Hat Voice</p>
        </div>
        <div className="step-synth-node__knobs">
          <Knob label="Tone" min={4000} max={14000} step={50} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fcd34d" unit="Hz" size={52} />
          <Knob label="Decay" min={0.01} max={0.2} step={0.005} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#fcd34d" unit="s" size={52} />
          <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#fcd34d" unit="" size={52} />
        </div>
      </div>

      <div className="step-synth-node__grid">
        {steps.map((isActive, step) => {
          const isCurrent = currentStep === step;
          return (
            <button
              type="button"
              key={`hihat-step-${step}`}
              onClick={() => toggleStep(step)}
              className={`step-synth-node__step ${isActive ? 'step-synth-node__step--active' : ''} ${isCurrent ? 'step-synth-node__step--current' : ''} ${step % 4 === 0 ? 'step-synth-node__step--quarter' : ''}`}
            >
              {step + 1}
            </button>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Hat Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
      </div>
    </div>
  );
};

export default HiHatSynthNode;
