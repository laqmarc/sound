import type {
  ArpStep,
  ArpMode,
  ArpScale,
  ChordType,
  DrumPattern,
  EditableAudioNodeType,
  NoteName,
  SoundNodeData,
  SyncDivision,
} from '../types';

export let audioContext: AudioContext | null = null;
let destinationInput: GainNode | null = null;
let destinationAnalyser: AnalyserNode | null = null;

export const nodes = new Map<string, AudioNode>();
export const analysers = new Map<string, AnalyserNode>();
export const drumMachines = new Map<string, DrumMachineState>();
export const arpeggiators = new Map<string, ArpeggiatorState>();
export const arpeggiatorTargets = new Map<string, Set<string>>();
export const arp2s = new Map<string, Arp2State>();
export const arp2Targets = new Map<string, Set<string>>();
export const equalizers = new Map<string, EqualizerState>();
export const reverbs = new Map<string, ReverbState>();
export const mixers = new Map<string, MixerState>();
export const phasers = new Map<string, PhaserState>();
export const compressors = new Map<string, CompressorState>();
export const choruses = new Map<string, ChorusState>();
export const bitcrushers = new Map<string, BitcrusherState>();
export const flangers = new Map<string, FlangerState>();
export const limiters = new Map<string, LimiterState>();
export const loopers = new Map<string, LooperState>();
export const fmSynths = new Map<string, FMSynthState>();
export const subOscs = new Map<string, SubOscState>();
export const noiseLayers = new Map<string, NoiseLayerState>();
export const weirdMachines = new Map<string, WeirdMachineState>();
export const chaosShrines = new Map<string, ChaosShrineState>();
export const tremolos = new Map<string, TremoloState>();
export const ringMods = new Map<string, RingModState>();
export const vibratos = new Map<string, VibratoState>();
export const combFilters = new Map<string, CombFilterState>();
export const dualOscs = new Map<string, DualOscState>();
export const dronePads = new Map<string, DronePadState>();
export const basslines = new Map<string, BasslineState>();
export const leadVoices = new Map<string, LeadVoiceState>();
export const autoPans = new Map<string, AutoPanState>();
export const autoFilters = new Map<string, AutoFilterState>();
export const clockDividers = new Map<string, ClockDividerState>();
export const randomCvs = new Map<string, RandomCvState>();
export const sampleHolds = new Map<string, SampleHoldState>();
export const gateSeqs = new Map<string, GateSeqState>();
export const cvOffsets = new Map<string, CVOffsetState>();
export const envelopeFollowers = new Map<string, EnvelopeFollowerState>();
export const quantizers = new Map<string, QuantizerState>();
export const comparators = new Map<string, ComparatorState>();
export const lags = new Map<string, LagState>();
export const chordSeqs = new Map<string, ChordSeqState>();
export const resonators = new Map<string, ResonatorState>();
export const wahs = new Map<string, WahState>();
export const stereoWideners = new Map<string, StereoWidenerState>();
export const foldbacks = new Map<string, FoldbackState>();
export const tiltEqs = new Map<string, TiltEqState>();
export const saturators = new Map<string, SaturatorState>();
export const cabSims = new Map<string, CabSimState>();
export const transientShapers = new Map<string, TransientShaperState>();
export const freezeFxs = new Map<string, FreezeFxState>();
export const granulars = new Map<string, GranularState>();
export const stutters = new Map<string, StutterState>();
export const humanizers = new Map<string, HumanizerState>();
export const triggerDelays = new Map<string, TriggerDelayState>();
export const monoSynths = new Map<string, MonoSynthState>();
export const kickSynths = new Map<string, StepSynthState>();
export const snareSynths = new Map<string, StepSynthState>();
export const hiHatSynths = new Map<string, StepSynthState>();
export const chordGenerators = new Map<string, ChordGeneratorState>();
export const stereoAnalysers = new Map<string, StereoAnalyserState>();
export const nodeConfigs = new Map<string, NodeConfig>();
export let noiseBufferCache: AudioBuffer | null = null;

export type AudioParamName =
  | 'frequency'
  | 'gain'
  | 'type'
  | 'Q'
  | 'delayTime'
  | 'distortion'
  | 'decay'
  | 'pan';

export type AudioParamValue = number | OscillatorType | BiquadFilterType;

export interface DrumMachineState {
  id: string;
  output: GainNode;
  pattern: DrumPattern;
}

export interface NodeConfig {
  type: EditableAudioNodeType;
  data: SoundNodeData;
}

export interface EqualizerState {
  input: GainNode;
  output: GainNode;
  filters: BiquadFilterNode[];
}

export interface ReverbState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  preDelay: DelayNode;
  tone: BiquadFilterNode;
  convolver: ConvolverNode;
}

export interface MixerChannelState {
  input: GainNode;
  low: BiquadFilterNode;
  mid: BiquadFilterNode;
  high: BiquadFilterNode;
  pan: StereoPannerNode;
  gain: GainNode;
}

export interface MixerState {
  output: GainNode;
  channels: MixerChannelState[];
}

export interface PhaserState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  feedbackGain: GainNode;
  filters: BiquadFilterNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface CompressorState {
  compressor: DynamicsCompressorNode;
  makeup: GainNode;
}

export interface ChorusState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface BitcrusherState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    bits: number;
    normFreq: number;
  };
}

export interface FlangerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
  feedbackGain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface LimiterState {
  compressor: DynamicsCompressorNode;
  makeup: GainNode;
}

export interface LooperState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    lengthSamples: number;
    feedback: number;
    mix: number;
    freeze: boolean;
  };
}

export interface FMSynthState {
  carrier: OscillatorNode;
  modulator: OscillatorNode;
  modGain: GainNode;
  output: GainNode;
}

export interface SubOscState {
  oscillator: OscillatorNode;
  output: GainNode;
}

export interface NoiseLayerState {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  output: GainNode;
}

export interface WeirdMachineState {
  carrier: OscillatorNode;
  harmonic: OscillatorNode;
  modulator: OscillatorNode;
  noiseSource: AudioBufferSourceNode;
  noiseGain: GainNode;
  harmonicGain: GainNode;
  modGain: GainNode;
  wobbleLfo: OscillatorNode;
  wobbleGain: GainNode;
  filter: BiquadFilterNode;
  shaper: WaveShaperNode;
  output: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
  stepIndex: number;
}

export interface ChaosShrineState {
  carrier: OscillatorNode;
  sub: OscillatorNode;
  shimmer: OscillatorNode;
  modulator: OscillatorNode;
  fmGain: GainNode;
  motionLfo: OscillatorNode;
  motionDepth: GainNode;
  motionBias: ConstantSourceNode;
  motionVca: GainNode;
  noiseSource: AudioBufferSourceNode;
  noiseGain: GainNode;
  carrierGain: GainNode;
  subGain: GainNode;
  shimmerGain: GainNode;
  filter: BiquadFilterNode;
  colorFilter: BiquadFilterNode;
  shaper: WaveShaperNode;
  leftDelay: DelayNode;
  rightDelay: DelayNode;
  leftPan: StereoPannerNode;
  rightPan: StereoPannerNode;
  output: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
  stepIndex: number;
}

export interface TremoloState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  lfo: OscillatorNode;
  lfoDepth: GainNode;
  lfoOffset: ConstantSourceNode;
}

export interface RingModState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  modulator: OscillatorNode;
  modDepth: GainNode;
  modOffset: ConstantSourceNode;
}

export interface VibratoState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  delay: DelayNode;
  lfo: OscillatorNode;
  lfoDepth: GainNode;
}

export interface CombFilterState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  delay: DelayNode;
  feedbackGain: GainNode;
}

export interface DualOscState {
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  mixA: GainNode;
  mixB: GainNode;
  output: GainNode;
}

export interface DronePadState {
  oscillators: OscillatorNode[];
  output: GainNode;
}

export interface BasslineState {
  id: string;
  output: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
  note: NoteName;
  octave: number;
  tone: number;
  gain: number;
}

export interface LeadVoiceState {
  oscillator: OscillatorNode;
  filter: BiquadFilterNode;
  output: GainNode;
  glide: number;
}

export interface AutoPanState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  panner: StereoPannerNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface AutoFilterState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface ClockDividerState {
  source: ConstantSourceNode;
  output: GainNode;
  syncDivision: SyncDivision;
}

export interface RandomCvState {
  source: ConstantSourceNode;
  output: GainNode;
  syncDivision: SyncDivision;
  minValue: number;
  maxValue: number;
}

export interface SampleHoldState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    holdSamples: number;
    mix: number;
  };
}

export interface GateSeqState {
  input: GainNode;
  output: GainNode;
  gate: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
}

export interface CVOffsetState {
  source: ConstantSourceNode;
  scaler: GainNode;
}

export interface EnvelopeFollowerState {
  input: GainNode;
  analyser: ScriptProcessorNode;
  source: ConstantSourceNode;
  scaler: GainNode;
  params: {
    attack: number;
    release: number;
    gain: number;
  };
}

export interface QuantizerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    steps: number;
    mix: number;
  };
}

export interface ComparatorState {
  input: GainNode;
  processor: ScriptProcessorNode;
  output: GainNode;
  params: {
    threshold: number;
  };
}

export interface LagState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    rise: number;
    fall: number;
    mix: number;
  };
}

export interface ChordSeqState {
  id: string;
  output: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
  note: NoteName;
  octave: number;
  chordType: ChordType;
  spread: number;
  gain: number;
}

export interface ResonatorState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filters: BiquadFilterNode[];
}

export interface WahState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface StereoWidenerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  merger: ChannelMergerNode;
  delayLeft: DelayNode;
  delayRight: DelayNode;
}

export interface FoldbackState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  shaper: WaveShaperNode;
}

export interface TiltEqState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  lowShelf: BiquadFilterNode;
  highShelf: BiquadFilterNode;
}

export interface SaturatorState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  shaper: WaveShaperNode;
  makeup: GainNode;
}

export interface CabSimState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  highpass: BiquadFilterNode;
  peak: BiquadFilterNode;
  lowpass: BiquadFilterNode;
}

export interface TransientShaperState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    attack: number;
    sustain: number;
    mix: number;
  };
}

export interface FreezeFxState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    lengthSamples: number;
    mix: number;
    freeze: boolean;
  };
}

export interface GranularState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    grainSamples: number;
    spray: number;
    mix: number;
  };
}

export interface StutterState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  processor: ScriptProcessorNode;
  params: {
    lengthSamples: number;
    mix: number;
  };
}

export interface HumanizerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

export interface TriggerDelayState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
}

export interface MonoSynthState {
  oscillator: OscillatorNode;
  filter: BiquadFilterNode;
  output: GainNode;
}

export interface StepSynthState {
  id: string;
  output: GainNode;
  pattern: boolean[];
  tone: number;
  decay: number;
  gain: number;
}

export interface ChordGeneratorState {
  oscillators: OscillatorNode[];
  output: GainNode;
}

export interface StereoAnalyserState {
  input: GainNode;
  output: GainNode;
  splitter: ChannelSplitterNode;
  left: AnalyserNode;
  right: AnalyserNode;
}

export interface ArpeggiatorState {
  id: string;
  stepIndex: number;
  syncDivision: SyncDivision;
  steps: ArpStep[];
  mode: ArpMode;
  scale: ArpScale;
}

export interface Arp2State {
  id: string;
  stepIndex: number;
  syncDivision: SyncDivision;
  steps: ArpStep[];
  mode: ArpMode;
  scale: ArpScale;
  length: number;
  octaveSpan: number;
  transpose: number;
  chance: number;
  ratchet: number;
}

export interface TransportState {
  bpm: number;
  swing: number;
  isPlaying: boolean;
  step: number;
  timerId: number | null;
  nextStepTime: number;
  uiTimerIds: number[];
}

export const transportState: TransportState = {
  bpm: 120,
  swing: 0,
  isPlaying: false,
  step: 0,
  timerId: null,
  nextStepTime: 0,
  uiTimerIds: [],
};

export const defaultDrumPattern = (): DrumPattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
});

export const NOTE_OFFSETS: Record<NoteName, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};

export const SCALE_OFFSETS: Record<ArpScale, number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
};

export const BASSLINE_OFFSETS = [0, 0, 7, 0, 3, 0, 7, 10, 0, 7, 12, 7, 3, 0, 7, 10];

export const DEFAULT_KICK_STEPS = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
export const DEFAULT_SNARE_STEPS = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
export const DEFAULT_HIHAT_STEPS = Array.from({ length: 16 }, () => true);

export const EQ_BAND_CONFIGS: Array<{ frequency: number; type: BiquadFilterType; q: number }> = [
  { frequency: 60, type: 'lowshelf', q: 0.7 },
  { frequency: 170, type: 'peaking', q: 1.1 },
  { frequency: 310, type: 'peaking', q: 1.1 },
  { frequency: 600, type: 'peaking', q: 1.1 },
  { frequency: 1000, type: 'peaking', q: 1.1 },
  { frequency: 3000, type: 'peaking', q: 1.1 },
  { frequency: 6000, type: 'peaking', q: 1.1 },
  { frequency: 12000, type: 'highshelf', q: 0.7 },
];

export const PHASER_CENTER_FREQUENCIES = [320, 800, 1800, 4200];

export const cloneDrumPattern = (pattern?: DrumPattern): DrumPattern => {
  const base = pattern ?? defaultDrumPattern();

  return {
    kick: Array.from({ length: 16 }, (_, index) => base.kick[index] ?? false),
    snare: Array.from({ length: 16 }, (_, index) => base.snare[index] ?? false),
    hihat: Array.from({ length: 16 }, (_, index) => base.hihat[index] ?? false),
  };
};

export const defaultArpSteps = (): ArpStep[] => [
  { note: 'C', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'C', octave: 5, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
];

export const defaultArp2Steps = (): ArpStep[] => [
  { note: 'C', octave: 3, enabled: true },
  { note: 'G', octave: 3, enabled: false },
  { note: 'A#', octave: 3, enabled: true },
  { note: 'D', octave: 4, enabled: true },
  { note: 'F', octave: 4, enabled: true },
  { note: 'A', octave: 4, enabled: false },
  { note: 'C', octave: 5, enabled: true },
  { note: 'D#', octave: 5, enabled: true },
  { note: 'C', octave: 4, enabled: true },
  { note: 'G', octave: 3, enabled: false },
  { note: 'F', octave: 3, enabled: true },
  { note: 'A#', octave: 3, enabled: true },
  { note: 'D', octave: 4, enabled: false },
  { note: 'F', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'C', octave: 5, enabled: true },
];

export const cloneArpSteps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultArpSteps();

  return Array.from({ length: 8 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
    enabled: base[index]?.enabled ?? true,
  }));
};

export const cloneArp2Steps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultArp2Steps();

  return Array.from({ length: 16 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
    enabled: base[index]?.enabled ?? true,
  }));
};

export const quantizeNoteToScale = (note: NoteName, scale: ArpScale): NoteName => {
  if (scale === 'chromatic') {
    return note;
  }

  const noteOffset = NOTE_OFFSETS[note];
  const candidates = SCALE_OFFSETS[scale];

  let closest = candidates[0];
  let closestDistance = Math.abs(noteOffset - closest);

  candidates.forEach((candidate) => {
    const distance = Math.abs(noteOffset - candidate);
    if (distance < closestDistance) {
      closest = candidate;
      closestDistance = distance;
    }
  });

  return (Object.keys(NOTE_OFFSETS) as NoteName[]).find((key) => NOTE_OFFSETS[key] === closest) ?? note;
};

export const divisionToBeats: Record<SyncDivision, number> = {
  '1/1': 4,
  '1/2': 2,
  '1/4': 1,
  '1/8': 0.5,
  '1/16': 0.25,
};

export const dispatchTransportEvent = (name: string, detail: Record<string, unknown>) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export const emitTransportState = () => {
  dispatchTransportEvent('transport-state', {
    bpm: transportState.bpm,
    swing: transportState.swing,
    isPlaying: transportState.isPlaying,
    step: transportState.step % 16,
  });
};

export const getNoiseBuffer = (ctx: AudioContext) => {
  if (noiseBufferCache && noiseBufferCache.sampleRate === ctx.sampleRate) {
    return noiseBufferCache;
  }

  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    output[i] = Math.random() * 2 - 1;
  }

  noiseBufferCache = noiseBuffer;
  return noiseBuffer;
};

export const getBeatDurationSeconds = (bpm: number) => 60 / bpm;

export const getSyncedDurationSeconds = (division: SyncDivision, bpm: number) => {
  return getBeatDurationSeconds(bpm) * divisionToBeats[division];
};

export const getSyncedLfoFrequency = (division: SyncDivision, bpm: number) => {
  return 1 / getSyncedDurationSeconds(division, bpm);
};

export const getTransportStepInterval = (division: SyncDivision) => {
  switch (division) {
    case '1/16':
      return 1;
    case '1/8':
      return 2;
    case '1/4':
      return 4;
    case '1/2':
      return 8;
    case '1/1':
      return 16;
  }
};

export const shouldTriggerOnTransportStep = (step: number, division: SyncDivision) => {
  return step % getTransportStepInterval(division) === 0;
};

export const noteToFrequency = (note: NoteName, octave: number) => {
  return 440 * Math.pow(2, (NOTE_OFFSETS[note] - 9 + (octave - 4) * 12) / 12);
};

export const getPlayableArpSteps = (state: ArpeggiatorState) => {
  const enabledSteps = state.steps.filter((step) => step.enabled);
  const baseSteps = enabledSteps.length > 0 ? enabledSteps : state.steps;

  if (state.mode === 'down') {
    return [...baseSteps].reverse();
  }

  return baseSteps;
};

export const getPlayableArp2Steps = (state: Arp2State) => {
  const slicedSteps = state.steps.slice(0, Math.max(1, Math.min(16, state.length)));

  if (state.mode === 'down') {
    return [...slicedSteps].reverse();
  }

  return slicedSteps;
};

export const cloneStepPattern = (steps: boolean[] | undefined, fallback: boolean[]) => {
  return Array.from({ length: 16 }, (_, index) => steps?.[index] ?? fallback[index] ?? false);
};

export const stopSourceNode = (node: AudioNode) => {
  if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
    try {
      node.stop();
    } catch {
      // Ignore nodes that have already been stopped.
    }
  }
};

export const buildDistortionCurve = (amount: number) => {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const deg = Math.PI / 180;

  for (let i = 0; i < sampleCount; i += 1) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
};

export const buildSaturatorCurve = (drive: number) => {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const safeDrive = Math.max(1, drive);

  for (let i = 0; i < sampleCount; i += 1) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = Math.tanh(x * safeDrive) / Math.tanh(safeDrive);
  }

  return curve;
};

export const buildImpulseResponse = (ctx: AudioContext, duration: number, decay: number) => {
  const length = ctx.sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i += 1) {
    const progress = i / length;
    const falloff = Math.pow(1 - progress, decay);
    left[i] = (Math.random() * 2 - 1) * falloff;
    right[i] = (Math.random() * 2 - 1) * falloff;
  }

  return impulse;
};

export const buildFoldbackCurve = (drive: number, threshold: number) => {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const safeDrive = Math.max(1, drive);
  const safeThreshold = Math.max(0.05, Math.min(1, threshold));

  for (let i = 0; i < sampleCount; i += 1) {
    const x = ((i / (sampleCount - 1)) * 2 - 1) * safeDrive;
    const sign = Math.sign(x) || 1;
    const magnitude = Math.abs(x);

    if (magnitude <= safeThreshold) {
      curve[i] = x / safeDrive;
      continue;
    }

    const folded =
      Math.abs(((magnitude - safeThreshold) % (safeThreshold * 4)) - safeThreshold * 2) -
      safeThreshold;
    curve[i] = (sign * folded) / safeDrive;
  }

  return curve;
};

export const triggerKick = (ctx: AudioContext, destination: AudioNode, startTime = ctx.currentTime) => {
  triggerKickVoice(ctx, destination, 48, 0.22, 1, startTime);
};

export const triggerKickVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  tone: number,
  decay: number,
  level: number,
  startTime = ctx.currentTime,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(Math.max(tone * 3, tone + 90), startTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(22, tone), startTime + Math.max(0.04, decay));

  gain.gain.setValueAtTime(Math.max(0.001, level), startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.max(0.05, decay));

  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(startTime + Math.max(0.08, decay + 0.04));
};

export const triggerSnare = (ctx: AudioContext, destination: AudioNode, startTime = ctx.currentTime) => {
  triggerSnareVoice(ctx, destination, 180, 0.12, 0.8, startTime);
};

export const triggerSnareVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  toneFrequency: number,
  decay: number,
  level: number,
  startTime = ctx.currentTime,
) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1800, startTime);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(Math.max(0.001, level), startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + Math.max(0.04, decay));

  const tone = ctx.createOscillator();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(Math.max(80, toneFrequency), startTime);

  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(Math.max(0.001, level * 0.6), startTime);
  toneGain.gain.exponentialRampToValueAtTime(0.01, startTime + Math.max(0.03, decay * 0.8));

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);

  tone.connect(toneGain);
  toneGain.connect(destination);

  noise.start(startTime);
  noise.stop(startTime + Math.max(0.08, decay + 0.06));
  tone.start(startTime);
  tone.stop(startTime + Math.max(0.06, decay));
};

export const triggerHiHat = (ctx: AudioContext, destination: AudioNode, startTime = ctx.currentTime) => {
  triggerHiHatVoice(ctx, destination, 10000, 0.05, 0.45, startTime);
};

export const triggerHiHatVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  toneFrequency: number,
  decay: number,
  level: number,
  startTime = ctx.currentTime,
) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(Math.max(3000, toneFrequency), startTime);
  bandpass.Q.setValueAtTime(0.8, startTime);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(Math.max(2000, toneFrequency * 0.7), startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(Math.max(0.001, level), startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + Math.max(0.02, decay));

  noise.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(destination);

  noise.start(startTime);
  noise.stop(startTime + Math.max(0.03, decay + 0.02));
};

export const triggerBasslineVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  tone: number,
  level: number,
  startTime = ctx.currentTime,
) => {
  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * 0.985), startTime + 0.12);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.max(120, tone), startTime);
  filter.Q.setValueAtTime(1.2, startTime);
  gain.gain.setValueAtTime(Math.max(0.001, level), startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.22);
};

export const triggerChordSequenceVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  rootFrequency: number,
  chordType: ChordType,
  spread: number,
  level: number,
  durationSeconds: number,
  startTime = ctx.currentTime,
) => {
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const oscillators = CHORD_INTERVALS[chordType].map((interval, index) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(rootFrequency * Math.pow(2, interval / 12), startTime);
    oscillator.detune.setValueAtTime((index - 1) * spread, startTime);
    oscillator.connect(filter);
    oscillator.start(startTime);
    oscillator.stop(startTime + durationSeconds + 0.04);
    return oscillator;
  });

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2800, startTime);
  gain.gain.setValueAtTime(Math.max(0.001, level), startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSeconds);
  filter.connect(gain);
  gain.connect(destination);

  return oscillators;
};


export const setAudioContext = (nextAudioContext: AudioContext | null) => {
  audioContext = nextAudioContext;
  if (nextAudioContext === null) {
    destinationInput = null;
    destinationAnalyser = null;
  }
};

export const clearNoiseBufferCache = () => {
  noiseBufferCache = null;
};

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }

  return audioContext;
};

export const getDestinationInput = () => {
  const ctx = getAudioContext();

  if (!destinationInput || !destinationAnalyser) {
    destinationInput = ctx.createGain();
    destinationAnalyser = ctx.createAnalyser();
    destinationAnalyser.fftSize = 512;
    destinationAnalyser.smoothingTimeConstant = 0.82;
    destinationInput.connect(ctx.destination);
    destinationInput.connect(destinationAnalyser);
  }

  return destinationInput;
};

export const getDestinationAnalyser = () => {
  void getDestinationInput();
  return destinationAnalyser;
};

export const getAudioContextState = () => {
  return audioContext?.state ?? 'closed';
};
