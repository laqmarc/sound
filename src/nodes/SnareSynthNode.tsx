import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

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
    <div className="bg-rose-950/80 backdrop-blur-xl border border-rose-400/20 p-4 rounded-2xl shadow-2xl min-w-[760px]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-rose-300 uppercase mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" />
            Snare Synth
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">16-Step Snare Voice</p>
        </div>
        <div className="flex items-center gap-4">
          <Knob label="Tone" min={120} max={600} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fda4af" unit="Hz" size={52} />
          <Knob label="Decay" min={0.05} max={0.5} step={0.01} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#fda4af" unit="s" size={52} />
          <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#fda4af" unit="" size={52} />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
        {steps.map((isActive, step) => {
          const isCurrent = currentStep === step;
          return (
            <button
              key={`snare-step-${step}`}
              onClick={() => toggleStep(step)}
              className={`h-10 rounded-md border text-[9px] font-black transition-all ${
                isActive
                  ? `bg-rose-300 text-black border-rose-200 ${isCurrent ? 'shadow-[0_0_18px_rgba(253,164,175,0.8)] scale-[1.03]' : ''}`
                  : `bg-white/5 border-white/10 ${isCurrent ? 'bg-white/15 text-white/80' : 'text-white/35 hover:bg-white/10'}`
              } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''}`}
            >
              {step + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Snare Out</span>
        <Handle type="source" position={Position.Right} className="!bg-rose-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default SnareSynthNode;
