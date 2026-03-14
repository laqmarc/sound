import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './StepSynthNode.css';

const defaultSteps = () => [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
const normalizeSteps = (steps?: boolean[]) => Array.from({ length: 16 }, (_, index) => steps?.[index] ?? defaultSteps()[index] ?? false);

const KickSynthNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.steps);
  const [currentStep, setCurrentStep] = useState(0);
  const gain = data.gain ?? 0.9;
  const tone = data.tone ?? 58;
  const decay = data.decay ?? 0.24;

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
          '--step-synth-accent': '#67e8f9',
          '--step-synth-bg': 'rgba(8, 47, 73, 0.8)',
          '--step-synth-border': 'rgba(34, 211, 238, 0.2)',
          '--step-synth-step-bg': '#67e8f9',
          '--step-synth-step-border': '#a5f3fc',
          '--step-synth-current-shadow': '0 0 18px rgba(103, 232, 249, 0.8)',
        } as CSSProperties
      }
    >
      <div className="step-synth-node__header">
        <div>
          <div className="node-chrome__title">
            <div className="node-chrome__dot" />
            Kick Synth
          </div>
          <p className="step-synth-node__description">16-Step Kick Voice</p>
        </div>
        <div className="step-synth-node__knobs">
          <Knob label="Tone" min={30} max={120} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#67e8f9" unit="Hz" size={52} />
          <Knob label="Decay" min={0.05} max={0.8} step={0.01} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#67e8f9" unit="s" size={52} />
          <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#67e8f9" unit="" size={52} />
        </div>
      </div>

      <div className="step-synth-node__grid">
        {steps.map((isActive, step) => {
          const isCurrent = currentStep === step;
          return (
            <button
              type="button"
              key={`kick-step-${step}`}
              onClick={() => toggleStep(step)}
              className={`step-synth-node__step ${isActive ? 'step-synth-node__step--active' : ''} ${isCurrent ? 'step-synth-node__step--current' : ''} ${step % 4 === 0 ? 'step-synth-node__step--quarter' : ''}`}
            >
              {step + 1}
            </button>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Kick Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-cyan" />
      </div>
    </div>
  );
};

export default KickSynthNode;
