import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, Drum2Pattern, Drum2VoiceId, Drum2Voices } from '../types';

const channels: Array<{
  key: Drum2VoiceId;
  label: string;
  shortLabel: string;
  color: string;
  glow: string;
  knobColor: string;
  accentLabel: string;
  toneRange: [number, number, number];
  decayRange: [number, number, number];
}> = [
  {
    key: 'kick',
    label: 'Kick',
    shortLabel: 'K',
    color: 'bg-cyan-300 border-cyan-200',
    glow: 'shadow-[0_0_16px_rgba(103,232,249,0.55)]',
    knobColor: '#67e8f9',
    accentLabel: 'Punch',
    toneRange: [30, 120, 1],
    decayRange: [0.05, 0.8, 0.01],
  },
  {
    key: 'snare',
    label: 'Snare',
    shortLabel: 'S',
    color: 'bg-rose-300 border-rose-200',
    glow: 'shadow-[0_0_16px_rgba(253,164,175,0.55)]',
    knobColor: '#fda4af',
    accentLabel: 'Snap',
    toneRange: [120, 600, 1],
    decayRange: [0.05, 0.55, 0.01],
  },
  {
    key: 'hihat',
    label: 'Hi-Hat',
    shortLabel: 'H',
    color: 'bg-amber-300 border-amber-200',
    glow: 'shadow-[0_0_16px_rgba(252,211,77,0.55)]',
    knobColor: '#fcd34d',
    accentLabel: 'Grit',
    toneRange: [4000, 14000, 50],
    decayRange: [0.01, 0.25, 0.005],
  },
  {
    key: 'tom',
    label: 'Tom',
    shortLabel: 'T',
    color: 'bg-emerald-300 border-emerald-200',
    glow: 'shadow-[0_0_16px_rgba(134,239,172,0.5)]',
    knobColor: '#86efac',
    accentLabel: 'Bend',
    toneRange: [70, 320, 1],
    decayRange: [0.08, 0.9, 0.01],
  },
  {
    key: 'fx',
    label: 'FX',
    shortLabel: 'FX',
    color: 'bg-fuchsia-300 border-fuchsia-200',
    glow: 'shadow-[0_0_16px_rgba(244,114,182,0.5)]',
    knobColor: '#f9a8d4',
    accentLabel: 'Scatter',
    toneRange: [300, 6000, 10],
    decayRange: [0.03, 0.6, 0.01],
  },
  {
    key: 'cymbal',
    label: 'Cymbal',
    shortLabel: 'CY',
    color: 'bg-indigo-300 border-indigo-200',
    glow: 'shadow-[0_0_16px_rgba(165,180,252,0.52)]',
    knobColor: '#a5b4fc',
    accentLabel: 'Shimmer',
    toneRange: [2500, 12000, 50],
    decayRange: [0.08, 1.2, 0.01],
  },
];

const defaultPattern = (): Drum2Pattern => ({
  kick: Array.from({ length: 32 }, (_, index) => [0, 4, 8, 12].includes(index)),
  snare: Array.from({ length: 32 }, (_, index) => [4, 12].includes(index)),
  hihat: Array.from({ length: 32 }, (_, index) => index < 16),
  tom: Array.from({ length: 32 }, (_, index) => [7, 15].includes(index)),
  fx: Array.from({ length: 32 }, (_, index) => [3, 11].includes(index)),
  cymbal: Array.from({ length: 32 }, (_, index) => [15].includes(index)),
});

const defaultVoices = (): Drum2Voices => ({
  kick: { tone: 54, decay: 0.24, gain: 0.92, shape: 0.58 },
  snare: { tone: 180, decay: 0.16, gain: 0.68, shape: 0.54 },
  hihat: { tone: 9500, decay: 0.06, gain: 0.42, shape: 0.52 },
  tom: { tone: 145, decay: 0.28, gain: 0.62, shape: 0.48 },
  fx: { tone: 2200, decay: 0.22, gain: 0.46, shape: 0.66 },
  cymbal: { tone: 7200, decay: 0.58, gain: 0.34, shape: 0.74 },
});

const normalizePattern = (pattern?: Drum2Pattern): Drum2Pattern => {
  const base = pattern ?? defaultPattern();

  return {
    kick: Array.from({ length: 32 }, (_, index) => base.kick[index] ?? false),
    snare: Array.from({ length: 32 }, (_, index) => base.snare[index] ?? false),
    hihat: Array.from({ length: 32 }, (_, index) => base.hihat[index] ?? false),
    tom: Array.from({ length: 32 }, (_, index) => base.tom[index] ?? false),
    fx: Array.from({ length: 32 }, (_, index) => base.fx[index] ?? false),
    cymbal: Array.from({ length: 32 }, (_, index) => base.cymbal[index] ?? false),
  };
};

const normalizeVoices = (voices?: Partial<Drum2Voices>): Drum2Voices => {
  const base = defaultVoices();

  return channels.reduce<Drum2Voices>((accumulator, channel) => {
    const current = voices?.[channel.key];
    accumulator[channel.key] = {
      tone: current?.tone ?? base[channel.key].tone,
      decay: current?.decay ?? base[channel.key].decay,
      gain: current?.gain ?? base[channel.key].gain,
      shape: current?.shape ?? base[channel.key].shape,
    };
    return accumulator;
  }, {} as Drum2Voices);
};

interface Drum2StepEventDetail {
  id?: string;
  stepIndex?: number;
  length?: number;
}

const Drum2Node = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const [transportBpm, setTransportBpm] = useState(data.bpm ?? 120);
  const [currentStep, setCurrentStep] = useState(0);
  const pattern = normalizePattern(data.drum2Pattern);
  const voices = normalizeVoices(data.drum2Voices);
  const length = Math.max(4, Math.min(32, Math.round(data.drum2Length ?? 16)));

  useEffect(() => {
    const handleStep = (event: Event) => {
      const customEvent = event as CustomEvent<Drum2StepEventDetail>;
      if (customEvent.detail.id === id && typeof customEvent.detail.stepIndex === 'number') {
        setCurrentStep(customEvent.detail.stepIndex);
      }
    };

    window.addEventListener('drum2-step', handleStep);
    return () => window.removeEventListener('drum2-step', handleStep);
  }, [id]);

  useEffect(() => {
    const handleTransportState = (event: Event) => {
      const customEvent = event as CustomEvent<{ bpm?: number }>;
      if (typeof customEvent.detail.bpm === 'number') {
        setTransportBpm(customEvent.detail.bpm);
      }
    };

    window.addEventListener('transport-state', handleTransportState);
    return () => window.removeEventListener('transport-state', handleTransportState);
  }, []);

  const toggleStep = (channel: Drum2VoiceId, stepIndex: number) => {
    const nextPattern = normalizePattern(pattern);
    nextPattern[channel][stepIndex] = !nextPattern[channel][stepIndex];
    onDataChange(id, { drum2Pattern: nextPattern });
  };

  const updateVoice = (channel: Drum2VoiceId, patch: Partial<Drum2Voices[Drum2VoiceId]>) => {
    const nextVoices = normalizeVoices(voices);
    nextVoices[channel] = {
      ...nextVoices[channel],
      ...patch,
    };
    onDataChange(id, { drum2Voices: nextVoices });
  };

  return (
    <div className="bg-[linear-gradient(145deg,rgba(18,8,26,0.98),rgba(10,22,40,0.96))] backdrop-blur-xl border border-fuchsia-400/20 p-4 rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] min-w-[1080px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-[0.32em] text-fuchsia-300 uppercase mb-1 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(244,114,182,0.9)] animate-pulse" />
            DRUM2
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">6 voices, 32-step mutant drum brain</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 min-w-[108px]">
            <div className="text-[8px] uppercase tracking-[0.24em] text-white/35 mb-1">Active</div>
            <div className="text-[10px] font-mono text-fuchsia-200">
              {currentStep + 1} / {length}
            </div>
          </div>
          <Knob
            label="BPM"
            min={60}
            max={180}
            step={1}
            value={transportBpm}
            onChange={(value) => onDataChange(id, { bpm: value })}
            color="#f0abfc"
            size={56}
          />
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3 min-w-[220px]">
            <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Length</label>
            <input
              type="range"
              min={4}
              max={32}
              step={1}
              value={length}
              onChange={(event) => onDataChange(id, { drum2Length: Number(event.target.value) })}
              className="w-full accent-fuchsia-300"
            />
            <div className="mt-2 text-[10px] font-mono text-fuchsia-200 text-center">{length} steps</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 mb-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        {Array.from({ length: 32 }, (_, stepIndex) => (
          <div
            key={`drum2-indicator-${stepIndex}`}
            className={`h-3 rounded-full transition-all ${
              stepIndex >= length
                ? 'bg-white/[0.04]'
                : currentStep === stepIndex
                  ? 'bg-fuchsia-300 shadow-[0_0_12px_rgba(244,114,182,0.85)]'
                  : stepIndex % 4 === 0
                    ? 'bg-white/20'
                    : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {channels.map((channel) => {
          const voice = voices[channel.key];

          return (
            <section key={channel.key} className="rounded-[24px] border border-white/10 bg-black/20 p-3">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/70">{channel.label}</div>
                  <div className="text-[8px] uppercase tracking-[0.22em] text-white/35">{channel.accentLabel} lane</div>
                </div>

                <div className="flex items-center gap-3">
                  <Knob
                    label="Tone"
                    min={channel.toneRange[0]}
                    max={channel.toneRange[1]}
                    step={channel.toneRange[2]}
                    value={voice.tone}
                    onChange={(value) => updateVoice(channel.key, { tone: value })}
                    color={channel.knobColor}
                    unit="Hz"
                    size={42}
                  />
                  <Knob
                    label="Decay"
                    min={channel.decayRange[0]}
                    max={channel.decayRange[1]}
                    step={channel.decayRange[2]}
                    value={voice.decay}
                    onChange={(value) => updateVoice(channel.key, { decay: value })}
                    color={channel.knobColor}
                    unit="s"
                    size={42}
                  />
                  <Knob
                    label="Gain"
                    min={0}
                    max={1}
                    step={0.01}
                    value={voice.gain}
                    onChange={(value) => updateVoice(channel.key, { gain: value })}
                    color={channel.knobColor}
                    unit=""
                    size={42}
                  />
                  <Knob
                    label={channel.accentLabel}
                    min={0}
                    max={1}
                    step={0.01}
                    value={voice.shape}
                    onChange={(value) => updateVoice(channel.key, { shape: value })}
                    color={channel.knobColor}
                    unit=""
                    size={42}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
                {pattern[channel.key].map((isActive, stepIndex) => {
                  const isCurrent = currentStep === stepIndex;
                  const isOutsideLength = stepIndex >= length;

                  return (
                    <button
                      key={`${channel.key}-${stepIndex}`}
                      onClick={() => toggleStep(channel.key, stepIndex)}
                      className={`h-8 rounded-md border text-[9px] font-black transition-all ${
                        isOutsideLength
                          ? 'border-white/5 bg-white/[0.03] text-white/20'
                          : isActive
                            ? `${channel.color} text-black ${isCurrent ? channel.glow : 'shadow-[0_0_8px_rgba(255,255,255,0.08)]'}`
                            : `bg-white/5 border-white/10 ${isCurrent ? 'bg-white/15 text-white/80 shadow-[0_0_12px_rgba(255,255,255,0.18)]' : 'text-white/35 hover:bg-white/10'}`
                      } ${stepIndex % 4 === 0 ? 'ring-1 ring-white/10' : ''} ${isCurrent && !isOutsideLength ? 'scale-[1.03]' : ''}`}
                    >
                      {stepIndex + 1}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Drum Bus Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-fuchsia-300 !w-4 !h-4 !border-2 !border-black"
        />
      </div>
    </div>
  );
};

export default Drum2Node;
