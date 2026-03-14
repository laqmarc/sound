import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';

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
    <div className="bg-amber-950/80 backdrop-blur-xl border border-amber-400/20 p-4 rounded-2xl shadow-2xl min-w-[760px]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-amber-300 uppercase mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" />
            HiHat Synth
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">16-Step Hat Voice</p>
        </div>
        <div className="flex items-center gap-4">
          <Knob label="Tone" min={4000} max={14000} step={50} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fcd34d" unit="Hz" size={52} />
          <Knob label="Decay" min={0.01} max={0.2} step={0.005} value={decay} onChange={(value) => onDataChange(id, { decay: value })} color="#fcd34d" unit="s" size={52} />
          <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#fcd34d" unit="" size={52} />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
        {steps.map((isActive, step) => {
          const isCurrent = currentStep === step;
          return (
            <button
              key={`hihat-step-${step}`}
              onClick={() => toggleStep(step)}
              className={`h-10 rounded-md border text-[9px] font-black transition-all ${
                isActive
                  ? `bg-amber-300 text-black border-amber-200 ${isCurrent ? 'shadow-[0_0_18px_rgba(252,211,77,0.8)] scale-[1.03]' : ''}`
                  : `bg-white/5 border-white/10 ${isCurrent ? 'bg-white/15 text-white/80' : 'text-white/35 hover:bg-white/10'}`
              } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''}`}
            >
              {step + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Hat Out</span>
        <Handle type="source" position={Position.Right} className="!bg-amber-300 !w-4 !h-4 !border-2 !border-black" />
      </div>
    </div>
  );
};

export default HiHatSynthNode;
