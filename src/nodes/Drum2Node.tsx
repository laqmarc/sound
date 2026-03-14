import { useEffect, useState, type CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, Drum2Pattern, Drum2VoiceId, Drum2Voices } from '../types';
import './nodeChrome.css';
import './Drum2Node.css';

const channels: Array<{
  key: Drum2VoiceId;
  label: string;
  shortLabel: string;
  accent: string;
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
    accent: '#67e8f9',
    glow: 'rgba(103,232,249,0.55)',
    knobColor: '#67e8f9',
    accentLabel: 'Punch',
    toneRange: [30, 120, 1],
    decayRange: [0.05, 0.8, 0.01],
  },
  {
    key: 'snare',
    label: 'Snare',
    shortLabel: 'S',
    accent: '#fda4af',
    glow: 'rgba(253,164,175,0.55)',
    knobColor: '#fda4af',
    accentLabel: 'Snap',
    toneRange: [120, 600, 1],
    decayRange: [0.05, 0.55, 0.01],
  },
  {
    key: 'hihat',
    label: 'Hi-Hat',
    shortLabel: 'H',
    accent: '#fcd34d',
    glow: 'rgba(252,211,77,0.55)',
    knobColor: '#fcd34d',
    accentLabel: 'Grit',
    toneRange: [4000, 14000, 50],
    decayRange: [0.01, 0.25, 0.005],
  },
  {
    key: 'tom',
    label: 'Tom',
    shortLabel: 'T',
    accent: '#86efac',
    glow: 'rgba(134,239,172,0.5)',
    knobColor: '#86efac',
    accentLabel: 'Bend',
    toneRange: [70, 320, 1],
    decayRange: [0.08, 0.9, 0.01],
  },
  {
    key: 'fx',
    label: 'FX',
    shortLabel: 'FX',
    accent: '#f9a8d4',
    glow: 'rgba(244,114,182,0.5)',
    knobColor: '#f9a8d4',
    accentLabel: 'Scatter',
    toneRange: [300, 6000, 10],
    decayRange: [0.03, 0.6, 0.01],
  },
  {
    key: 'cymbal',
    label: 'Cymbal',
    shortLabel: 'CY',
    accent: '#a5b4fc',
    glow: 'rgba(165,180,252,0.52)',
    knobColor: '#a5b4fc',
    accentLabel: 'Shimmer',
    toneRange: [2500, 12000, 50],
    decayRange: [0.08, 1.2, 0.01],
  },
];

const defaultPattern = (): Drum2Pattern => ({
  kick: Array.from({ length: 32 }, (_, index) => [0, 4, 8, 12].includes(index)),
  snare: Array.from({ length: 32 }, (_, index) => [4, 12].includes(index)),
  hihat: Array.from({ length: 32 }, (_, index) => [0, 2, 4, 6, 8, 10, 12, 14].includes(index)),
  tom: Array.from({ length: 32 }, () => false),
  fx: Array.from({ length: 32 }, () => false),
  cymbal: Array.from({ length: 32 }, (_, index) => [15].includes(index)),
});

const defaultVoices = (): Drum2Voices => ({
  kick: { tone: 52, decay: 0.26, gain: 0.95, shape: 0.6 },
  snare: { tone: 190, decay: 0.16, gain: 0.68, shape: 0.55 },
  hihat: { tone: 9800, decay: 0.05, gain: 0.38, shape: 0.5 },
  tom: { tone: 140, decay: 0.24, gain: 0.48, shape: 0.4 },
  fx: { tone: 2100, decay: 0.18, gain: 0.26, shape: 0.42 },
  cymbal: { tone: 7400, decay: 0.62, gain: 0.34, shape: 0.72 },
});

const createVoiceSteps = (activeSteps: number[]) =>
  Array.from({ length: 32 }, (_, index) => activeSteps.includes(index));

const createPresetPattern = (channelsByVoice: Partial<Record<Drum2VoiceId, number[]>>): Drum2Pattern => ({
  kick: createVoiceSteps(channelsByVoice.kick ?? []),
  snare: createVoiceSteps(channelsByVoice.snare ?? []),
  hihat: createVoiceSteps(channelsByVoice.hihat ?? []),
  tom: createVoiceSteps(channelsByVoice.tom ?? []),
  fx: createVoiceSteps(channelsByVoice.fx ?? []),
  cymbal: createVoiceSteps(channelsByVoice.cymbal ?? []),
});

const drum2Presets = [
  {
    name: 'Four Floor',
    length: 16,
    pattern: createPresetPattern({
      kick: [0, 4, 8, 12],
      snare: [4, 12],
      hihat: [0, 2, 4, 6, 8, 10, 12, 14],
      cymbal: [15],
    }),
    voices: {
      kick: { tone: 52, decay: 0.26, gain: 0.95, shape: 0.6 },
      snare: { tone: 190, decay: 0.16, gain: 0.68, shape: 0.55 },
      hihat: { tone: 9800, decay: 0.05, gain: 0.38, shape: 0.5 },
      tom: { tone: 140, decay: 0.24, gain: 0.48, shape: 0.4 },
      fx: { tone: 2100, decay: 0.18, gain: 0.26, shape: 0.42 },
      cymbal: { tone: 7400, decay: 0.62, gain: 0.34, shape: 0.72 },
    },
  },
  {
    name: 'Electro Snap',
    length: 16,
    pattern: createPresetPattern({
      kick: [0, 3, 8, 10, 12],
      snare: [4, 12],
      hihat: [0, 2, 6, 8, 10, 14],
      tom: [7, 15],
      fx: [5, 13],
      cymbal: [15],
    }),
    voices: {
      kick: { tone: 58, decay: 0.21, gain: 0.9, shape: 0.64 },
      snare: { tone: 240, decay: 0.14, gain: 0.74, shape: 0.68 },
      hihat: { tone: 11000, decay: 0.04, gain: 0.36, shape: 0.62 },
      tom: { tone: 155, decay: 0.3, gain: 0.5, shape: 0.5 },
      fx: { tone: 2800, decay: 0.16, gain: 0.42, shape: 0.74 },
      cymbal: { tone: 7800, decay: 0.5, gain: 0.26, shape: 0.7 },
    },
  },
  {
    name: 'Trap Dust',
    length: 16,
    pattern: createPresetPattern({
      kick: [0, 7, 10, 14],
      snare: [4, 12],
      hihat: [0, 1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 14],
      fx: [11, 15],
      cymbal: [15],
    }),
    voices: {
      kick: { tone: 46, decay: 0.32, gain: 0.98, shape: 0.52 },
      snare: { tone: 170, decay: 0.18, gain: 0.6, shape: 0.46 },
      hihat: { tone: 12000, decay: 0.03, gain: 0.33, shape: 0.76 },
      tom: { tone: 135, decay: 0.2, gain: 0.34, shape: 0.38 },
      fx: { tone: 3200, decay: 0.22, gain: 0.46, shape: 0.8 },
      cymbal: { tone: 6800, decay: 0.44, gain: 0.22, shape: 0.64 },
    },
  },
  {
    name: 'House Roller',
    length: 16,
    pattern: createPresetPattern({
      kick: [0, 4, 8, 12],
      snare: [4, 12],
      hihat: [0, 2, 4, 6, 8, 10, 11, 12, 14, 15],
      tom: [11],
      fx: [7],
      cymbal: [15],
    }),
    voices: {
      kick: { tone: 50, decay: 0.28, gain: 0.94, shape: 0.58 },
      snare: { tone: 205, decay: 0.15, gain: 0.66, shape: 0.58 },
      hihat: { tone: 10200, decay: 0.055, gain: 0.42, shape: 0.56 },
      tom: { tone: 150, decay: 0.26, gain: 0.38, shape: 0.48 },
      fx: { tone: 2400, decay: 0.16, gain: 0.24, shape: 0.52 },
      cymbal: { tone: 7200, decay: 0.72, gain: 0.36, shape: 0.76 },
    },
  },
  {
    name: 'Tom Run',
    length: 16,
    pattern: createPresetPattern({
      kick: [0, 8, 12],
      snare: [4, 12],
      hihat: [0, 2, 4, 6, 8, 10, 12, 14],
      tom: [10, 11, 12, 13, 14, 15],
      fx: [7, 15],
      cymbal: [15],
    }),
    voices: {
      kick: { tone: 56, decay: 0.22, gain: 0.86, shape: 0.54 },
      snare: { tone: 190, decay: 0.14, gain: 0.62, shape: 0.5 },
      hihat: { tone: 9000, decay: 0.05, gain: 0.34, shape: 0.46 },
      tom: { tone: 170, decay: 0.36, gain: 0.72, shape: 0.66 },
      fx: { tone: 1800, decay: 0.24, gain: 0.3, shape: 0.58 },
      cymbal: { tone: 6600, decay: 0.48, gain: 0.24, shape: 0.62 },
    },
  },
  {
    name: 'Halfstep',
    length: 8,
    pattern: createPresetPattern({
      kick: [0, 5],
      snare: [4],
      hihat: [0, 2, 4, 6],
      fx: [7],
      cymbal: [7],
    }),
    voices: {
      kick: { tone: 44, decay: 0.34, gain: 1, shape: 0.5 },
      snare: { tone: 165, decay: 0.2, gain: 0.64, shape: 0.44 },
      hihat: { tone: 8600, decay: 0.07, gain: 0.36, shape: 0.4 },
      tom: { tone: 128, decay: 0.22, gain: 0.2, shape: 0.34 },
      fx: { tone: 1500, decay: 0.28, gain: 0.34, shape: 0.72 },
      cymbal: { tone: 6200, decay: 0.7, gain: 0.28, shape: 0.68 },
    },
  },
  {
    name: 'Prog 24',
    length: 24,
    pattern: createPresetPattern({
      kick: [0, 4, 8, 12, 16, 20],
      snare: [4, 12, 20],
      hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
      tom: [15, 19, 23],
      fx: [11, 23],
      cymbal: [23],
    }),
    voices: {
      kick: { tone: 53, decay: 0.25, gain: 0.92, shape: 0.57 },
      snare: { tone: 210, decay: 0.16, gain: 0.67, shape: 0.6 },
      hihat: { tone: 9800, decay: 0.05, gain: 0.39, shape: 0.52 },
      tom: { tone: 162, decay: 0.34, gain: 0.56, shape: 0.58 },
      fx: { tone: 2600, decay: 0.2, gain: 0.32, shape: 0.62 },
      cymbal: { tone: 7600, decay: 0.76, gain: 0.32, shape: 0.74 },
    },
  },
  {
    name: 'Jungle 32',
    length: 32,
    pattern: createPresetPattern({
      kick: [0, 6, 10, 16, 19, 24, 28],
      snare: [4, 12, 20, 28],
      hihat: [0, 2, 3, 6, 8, 10, 11, 14, 16, 18, 19, 22, 24, 26, 27, 30],
      tom: [7, 15, 23, 31],
      fx: [5, 13, 21, 29],
      cymbal: [15, 31],
    }),
    voices: {
      kick: { tone: 57, decay: 0.2, gain: 0.88, shape: 0.7 },
      snare: { tone: 250, decay: 0.12, gain: 0.78, shape: 0.72 },
      hihat: { tone: 11800, decay: 0.035, gain: 0.34, shape: 0.78 },
      tom: { tone: 175, decay: 0.26, gain: 0.48, shape: 0.55 },
      fx: { tone: 3400, decay: 0.18, gain: 0.4, shape: 0.84 },
      cymbal: { tone: 8200, decay: 0.56, gain: 0.28, shape: 0.8 },
    },
  },
] as const;

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
  const [selectedPreset, setSelectedPreset] = useState(0);
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

  const applyPreset = (presetIndex: number) => {
    const preset = drum2Presets[presetIndex];
    if (!preset) {
      return;
    }

    onDataChange(id, {
      drum2Length: preset.length,
      drum2Pattern: normalizePattern(preset.pattern),
      drum2Voices: normalizeVoices(preset.voices),
    });
  };

  return (
    <div className="node-chrome drum2-node">
      <div className="drum2-node__header">
        <div>
          <div className="node-chrome__title drum2-node__title">
            <div className="node-chrome__dot drum2-node__dot" />
            DRUM2
          </div>
          <p className="node-chrome__description">6 voices, 32-step mutant drum brain</p>
        </div>

        <div className="drum2-node__header-controls">
          <div className="drum2-node__status-card">
            <div className="drum2-node__status-label">Active</div>
            <div className="drum2-node__status-value">
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
          <div className="drum2-node__length-card">
            <label className="node-chrome__field-label">Length</label>
            <input
              type="range"
              min={4}
              max={32}
              step={1}
              value={length}
              onChange={(event) => onDataChange(id, { drum2Length: Number(event.target.value) })}
              className="drum2-node__range"
            />
            <div className="drum2-node__range-value">{length} steps</div>
          </div>
        </div>
      </div>

      <div className="drum2-node__indicator-grid">
        {Array.from({ length: 32 }, (_, stepIndex) => (
          <div
            key={`drum2-indicator-${stepIndex}`}
            className={[
              'drum2-node__indicator',
              stepIndex >= length ? 'drum2-node__indicator--outside' : '',
              currentStep === stepIndex ? 'drum2-node__indicator--current' : '',
              stepIndex < length && stepIndex % 4 === 0 && currentStep !== stepIndex ? 'drum2-node__indicator--quarter' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>

      <div className="drum2-node__bank">
        <div>
          <label className="node-chrome__field-label">Pattern Bank</label>
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(Number(event.target.value))}
            className="node-chrome__select"
          >
            {drum2Presets.map((preset, index) => (
              <option key={preset.name} value={index}>
                {index + 1}. {preset.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => applyPreset(selectedPreset)}
          className="drum2-node__bank-button"
        >
          Load Preset
        </button>
      </div>

      <div className="drum2-node__lanes">
        {channels.map((channel) => {
          const voice = voices[channel.key];
          const laneStyle = {
            '--drum2-accent': channel.accent,
            '--drum2-glow': channel.glow,
          } as CSSProperties;

          return (
            <section key={channel.key} className="drum2-node__lane" style={laneStyle}>
              <div className="drum2-node__lane-header">
                <div>
                  <div className="drum2-node__lane-title">{channel.label}</div>
                  <div className="drum2-node__lane-subtitle">{channel.accentLabel} lane</div>
                </div>

                <div className="drum2-node__lane-knobs">
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

              <div className="drum2-node__steps">
                {pattern[channel.key].map((isActive, stepIndex) => {
                  const isCurrent = currentStep === stepIndex;
                  const isOutsideLength = stepIndex >= length;

                  return (
                    <button
                      type="button"
                      key={`${channel.key}-${stepIndex}`}
                      onClick={() => toggleStep(channel.key, stepIndex)}
                      className={[
                        'drum2-node__step-button',
                        isOutsideLength ? 'drum2-node__step-button--outside' : '',
                        isActive && !isOutsideLength ? 'drum2-node__step-button--active' : '',
                        isCurrent && !isOutsideLength ? 'drum2-node__step-button--current' : '',
                        !isActive && isCurrent && !isOutsideLength ? 'drum2-node__step-button--current-idle' : '',
                        stepIndex % 4 === 0 && !isOutsideLength ? 'drum2-node__step-button--quarter' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
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

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Drum Bus Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle--source node-handle--source-fuchsia"
        />
      </div>
    </div>
  );
};

export default Drum2Node;
