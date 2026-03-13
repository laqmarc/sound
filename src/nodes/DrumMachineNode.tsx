import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, DrumPattern } from '../types';

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

const channels: Array<{ key: keyof DrumPattern; label: string; color: string; glow: string }> = [
  { key: 'kick', label: 'Kick', color: 'bg-cyan-400 border-cyan-300', glow: 'shadow-[0_0_16px_rgba(34,211,238,0.45)]' },
  { key: 'snare', label: 'Snare', color: 'bg-rose-400 border-rose-300', glow: 'shadow-[0_0_16px_rgba(251,113,133,0.45)]' },
  { key: 'hihat', label: 'Hi-Hat', color: 'bg-amber-300 border-amber-200', glow: 'shadow-[0_0_16px_rgba(252,211,77,0.45)]' },
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
    <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[760px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-rose-400 uppercase mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
            Drum Machine
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">16-Step Loop Sequencer</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="grid grid-cols-8 gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            {Array.from({ length: 16 }, (_, step) => (
              <div
                key={`indicator-${step}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step ? 'bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.9)] scale-110' : 'bg-white/10'
                }`}
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

      <div className="grid grid-cols-[72px_repeat(16,minmax(0,1fr))] gap-1 items-center mb-2">
        <div />
        {Array.from({ length: 16 }, (_, step) => (
          <div
            key={`step-label-${step}`}
            className={`text-center text-[9px] font-black uppercase rounded-md py-1 transition-all ${
              currentStep === step ? 'text-rose-300 bg-rose-500/10' : 'text-white/30'
            } ${step % 4 === 0 ? 'border border-white/10' : ''}`}
          >
            {step + 1}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {channels.map((channel) => (
          <div key={channel.key} className="grid grid-cols-[72px_repeat(16,minmax(0,1fr))] gap-1 items-center">
            <div className="text-[10px] uppercase font-black tracking-widest text-white/55">{channel.label}</div>
            {pattern[channel.key].map((isActive, step) => {
              const isCurrentStep = currentStep === step;
              return (
                <button
                  key={`${channel.key}-${step}`}
                  onClick={() => toggleStep(channel.key, step)}
                  className={`h-9 rounded-md border text-[9px] font-black transition-all ${
                    isActive
                      ? `${channel.color} text-black ${isCurrentStep ? channel.glow : 'shadow-[0_0_10px_rgba(255,255,255,0.08)]'}`
                      : `bg-white/5 border-white/10 ${isCurrentStep ? 'bg-white/15 text-white/80 shadow-[0_0_14px_rgba(255,255,255,0.18)]' : 'text-white/35 hover:bg-white/10'}`
                  } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''} ${isCurrentStep ? 'scale-[1.03]' : ''}`}
                >
                  {isActive ? 'ON' : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Loop Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-rose-400 !w-4 !h-4 !border-2 !border-black"
        />
      </div>
    </div>
  );
};

export default DrumMachineNode;
