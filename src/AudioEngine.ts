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
} from './types';

let audioContext: AudioContext | null = null;

const nodes = new Map<string, AudioNode>();
const analysers = new Map<string, AnalyserNode>();
const drumMachines = new Map<string, DrumMachineState>();
const arpeggiators = new Map<string, ArpeggiatorState>();
const arpeggiatorTargets = new Map<string, Set<string>>();
const equalizers = new Map<string, EqualizerState>();
const phasers = new Map<string, PhaserState>();
const compressors = new Map<string, CompressorState>();
const choruses = new Map<string, ChorusState>();
const bitcrushers = new Map<string, BitcrusherState>();
const flangers = new Map<string, FlangerState>();
const limiters = new Map<string, LimiterState>();
const loopers = new Map<string, LooperState>();
const fmSynths = new Map<string, FMSynthState>();
const subOscs = new Map<string, SubOscState>();
const noiseLayers = new Map<string, NoiseLayerState>();
const tremolos = new Map<string, TremoloState>();
const ringMods = new Map<string, RingModState>();
const vibratos = new Map<string, VibratoState>();
const combFilters = new Map<string, CombFilterState>();
const dualOscs = new Map<string, DualOscState>();
const autoPans = new Map<string, AutoPanState>();
const autoFilters = new Map<string, AutoFilterState>();
const clockDividers = new Map<string, ClockDividerState>();
const randomCvs = new Map<string, RandomCvState>();
const sampleHolds = new Map<string, SampleHoldState>();
const gateSeqs = new Map<string, GateSeqState>();
const resonators = new Map<string, ResonatorState>();
const wahs = new Map<string, WahState>();
const stereoWideners = new Map<string, StereoWidenerState>();
const foldbacks = new Map<string, FoldbackState>();
const tiltEqs = new Map<string, TiltEqState>();
const saturators = new Map<string, SaturatorState>();
const cabSims = new Map<string, CabSimState>();
const transientShapers = new Map<string, TransientShaperState>();
const freezeFxs = new Map<string, FreezeFxState>();
const granulars = new Map<string, GranularState>();
const monoSynths = new Map<string, MonoSynthState>();
const kickSynths = new Map<string, StepSynthState>();
const snareSynths = new Map<string, StepSynthState>();
const hiHatSynths = new Map<string, StepSynthState>();
const chordGenerators = new Map<string, ChordGeneratorState>();
const stereoAnalysers = new Map<string, StereoAnalyserState>();
const nodeConfigs = new Map<string, NodeConfig>();
let noiseBufferCache: AudioBuffer | null = null;

type AudioParamName =
  | 'frequency'
  | 'gain'
  | 'type'
  | 'Q'
  | 'delayTime'
  | 'distortion'
  | 'decay'
  | 'pan';

type AudioParamValue = number | OscillatorType | BiquadFilterType;

interface DrumMachineState {
  id: string;
  output: GainNode;
  pattern: DrumPattern;
}

interface NodeConfig {
  type: EditableAudioNodeType;
  data: SoundNodeData;
}

interface EqualizerState {
  input: GainNode;
  output: GainNode;
  filters: BiquadFilterNode[];
}

interface PhaserState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  feedbackGain: GainNode;
  filters: BiquadFilterNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface CompressorState {
  compressor: DynamicsCompressorNode;
  makeup: GainNode;
}

interface ChorusState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface BitcrusherState {
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

interface FlangerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  delay: DelayNode;
  feedbackGain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface LimiterState {
  compressor: DynamicsCompressorNode;
  makeup: GainNode;
}

interface LooperState {
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

interface FMSynthState {
  carrier: OscillatorNode;
  modulator: OscillatorNode;
  modGain: GainNode;
  output: GainNode;
}

interface SubOscState {
  oscillator: OscillatorNode;
  output: GainNode;
}

interface NoiseLayerState {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  output: GainNode;
}

interface TremoloState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  lfo: OscillatorNode;
  lfoDepth: GainNode;
  lfoOffset: ConstantSourceNode;
}

interface RingModState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  modulator: OscillatorNode;
  modDepth: GainNode;
  modOffset: ConstantSourceNode;
}

interface VibratoState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  delay: DelayNode;
  lfo: OscillatorNode;
  lfoDepth: GainNode;
}

interface CombFilterState {
  input: GainNode;
  output: GainNode;
  wet: GainNode;
  dry: GainNode;
  delay: DelayNode;
  feedbackGain: GainNode;
}

interface DualOscState {
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  mixA: GainNode;
  mixB: GainNode;
  output: GainNode;
}

interface AutoPanState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  panner: StereoPannerNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface AutoFilterState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface ClockDividerState {
  source: ConstantSourceNode;
  output: GainNode;
  syncDivision: SyncDivision;
}

interface RandomCvState {
  source: ConstantSourceNode;
  output: GainNode;
  syncDivision: SyncDivision;
  minValue: number;
  maxValue: number;
}

interface SampleHoldState {
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

interface GateSeqState {
  input: GainNode;
  output: GainNode;
  gate: GainNode;
  steps: boolean[];
  syncDivision: SyncDivision;
}

interface ResonatorState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filters: BiquadFilterNode[];
}

interface WahState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

interface StereoWidenerState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  merger: ChannelMergerNode;
  delayLeft: DelayNode;
  delayRight: DelayNode;
}

interface FoldbackState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  shaper: WaveShaperNode;
}

interface TiltEqState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  lowShelf: BiquadFilterNode;
  highShelf: BiquadFilterNode;
}

interface SaturatorState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  shaper: WaveShaperNode;
  makeup: GainNode;
}

interface CabSimState {
  input: GainNode;
  output: GainNode;
  dry: GainNode;
  wet: GainNode;
  highpass: BiquadFilterNode;
  peak: BiquadFilterNode;
  lowpass: BiquadFilterNode;
}

interface TransientShaperState {
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

interface FreezeFxState {
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

interface GranularState {
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

interface MonoSynthState {
  oscillator: OscillatorNode;
  filter: BiquadFilterNode;
  output: GainNode;
}

interface StepSynthState {
  id: string;
  output: GainNode;
  pattern: boolean[];
  tone: number;
  decay: number;
  gain: number;
}

interface ChordGeneratorState {
  oscillators: OscillatorNode[];
  output: GainNode;
}

interface StereoAnalyserState {
  input: GainNode;
  output: GainNode;
  splitter: ChannelSplitterNode;
  left: AnalyserNode;
  right: AnalyserNode;
}

interface ArpeggiatorState {
  id: string;
  stepIndex: number;
  syncDivision: SyncDivision;
  steps: ArpStep[];
  mode: ArpMode;
  scale: ArpScale;
}

interface TransportState {
  bpm: number;
  swing: number;
  isPlaying: boolean;
  step: number;
  timerId: number | null;
}

const transportState: TransportState = {
  bpm: 120,
  swing: 0,
  isPlaying: false,
  step: 0,
  timerId: null,
};

const defaultDrumPattern = (): DrumPattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
});

const NOTE_OFFSETS: Record<NoteName, number> = {
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

const SCALE_OFFSETS: Record<ArpScale, number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

const CHORD_INTERVALS: Record<ChordType, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
};

const DEFAULT_KICK_STEPS = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
const DEFAULT_SNARE_STEPS = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
const DEFAULT_HIHAT_STEPS = Array.from({ length: 16 }, () => true);

const EQ_BAND_CONFIGS: Array<{ frequency: number; type: BiquadFilterType; q: number }> = [
  { frequency: 60, type: 'lowshelf', q: 0.7 },
  { frequency: 170, type: 'peaking', q: 1.1 },
  { frequency: 310, type: 'peaking', q: 1.1 },
  { frequency: 600, type: 'peaking', q: 1.1 },
  { frequency: 1000, type: 'peaking', q: 1.1 },
  { frequency: 3000, type: 'peaking', q: 1.1 },
  { frequency: 6000, type: 'peaking', q: 1.1 },
  { frequency: 12000, type: 'highshelf', q: 0.7 },
];

const PHASER_CENTER_FREQUENCIES = [320, 800, 1800, 4200];

const cloneDrumPattern = (pattern?: DrumPattern): DrumPattern => {
  const base = pattern ?? defaultDrumPattern();

  return {
    kick: Array.from({ length: 16 }, (_, index) => base.kick[index] ?? false),
    snare: Array.from({ length: 16 }, (_, index) => base.snare[index] ?? false),
    hihat: Array.from({ length: 16 }, (_, index) => base.hihat[index] ?? false),
  };
};

const defaultArpSteps = (): ArpStep[] => [
  { note: 'C', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'C', octave: 5, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
];

const cloneArpSteps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultArpSteps();

  return Array.from({ length: 8 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
    enabled: base[index]?.enabled ?? true,
  }));
};

const quantizeNoteToScale = (note: NoteName, scale: ArpScale): NoteName => {
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

const divisionToBeats: Record<SyncDivision, number> = {
  '1/1': 4,
  '1/2': 2,
  '1/4': 1,
  '1/8': 0.5,
  '1/16': 0.25,
};

const dispatchTransportEvent = (name: string, detail: Record<string, unknown>) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

const emitTransportState = () => {
  dispatchTransportEvent('transport-state', {
    bpm: transportState.bpm,
    swing: transportState.swing,
    isPlaying: transportState.isPlaying,
    step: transportState.step % 16,
  });
};

const getNoiseBuffer = (ctx: AudioContext) => {
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

const getBeatDurationSeconds = (bpm: number) => 60 / bpm;

const getSyncedDurationSeconds = (division: SyncDivision, bpm: number) => {
  return getBeatDurationSeconds(bpm) * divisionToBeats[division];
};

const getSyncedLfoFrequency = (division: SyncDivision, bpm: number) => {
  return 1 / getSyncedDurationSeconds(division, bpm);
};

const getTransportStepInterval = (division: SyncDivision) => {
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

const shouldTriggerOnTransportStep = (step: number, division: SyncDivision) => {
  return step % getTransportStepInterval(division) === 0;
};

const noteToFrequency = (note: NoteName, octave: number) => {
  return 440 * Math.pow(2, (NOTE_OFFSETS[note] - 9 + (octave - 4) * 12) / 12);
};

const getPlayableArpSteps = (state: ArpeggiatorState) => {
  const enabledSteps = state.steps.filter((step) => step.enabled);
  const baseSteps = enabledSteps.length > 0 ? enabledSteps : state.steps;

  if (state.mode === 'down') {
    return [...baseSteps].reverse();
  }

  return baseSteps;
};

const cloneStepPattern = (steps: boolean[] | undefined, fallback: boolean[]) => {
  return Array.from({ length: 16 }, (_, index) => steps?.[index] ?? fallback[index] ?? false);
};

const stopSourceNode = (node: AudioNode) => {
  if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
    try {
      node.stop();
    } catch {
      // Ignore nodes that have already been stopped.
    }
  }
};

const buildDistortionCurve = (amount: number) => {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const deg = Math.PI / 180;

  for (let i = 0; i < sampleCount; i += 1) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
};

const buildSaturatorCurve = (drive: number) => {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const safeDrive = Math.max(1, drive);

  for (let i = 0; i < sampleCount; i += 1) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = Math.tanh(x * safeDrive) / Math.tanh(safeDrive);
  }

  return curve;
};

const buildImpulseResponse = (ctx: AudioContext, duration: number, decay: number) => {
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

const buildFoldbackCurve = (drive: number, threshold: number) => {
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

const triggerKick = (ctx: AudioContext, destination: AudioNode) => {
  triggerKickVoice(ctx, destination, 48, 0.22, 1);
};

const triggerKickVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  tone: number,
  decay: number,
  level: number,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(Math.max(tone * 3, tone + 90), ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(22, tone), ctx.currentTime + Math.max(0.04, decay));

  gain.gain.setValueAtTime(Math.max(0.001, level), ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.max(0.05, decay));

  osc.connect(gain);
  gain.connect(destination);
  osc.start();
  osc.stop(ctx.currentTime + Math.max(0.08, decay + 0.04));
};

const triggerSnare = (ctx: AudioContext, destination: AudioNode) => {
  triggerSnareVoice(ctx, destination, 180, 0.12, 0.8);
};

const triggerSnareVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  toneFrequency: number,
  decay: number,
  level: number,
) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1800, ctx.currentTime);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(Math.max(0.001, level), ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + Math.max(0.04, decay));

  const tone = ctx.createOscillator();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(Math.max(80, toneFrequency), ctx.currentTime);

  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(Math.max(0.001, level * 0.6), ctx.currentTime);
  toneGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + Math.max(0.03, decay * 0.8));

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);

  tone.connect(toneGain);
  toneGain.connect(destination);

  noise.start();
  noise.stop(ctx.currentTime + Math.max(0.08, decay + 0.06));
  tone.start();
  tone.stop(ctx.currentTime + Math.max(0.06, decay));
};

const triggerHiHat = (ctx: AudioContext, destination: AudioNode) => {
  triggerHiHatVoice(ctx, destination, 10000, 0.05, 0.45);
};

const triggerHiHatVoice = (
  ctx: AudioContext,
  destination: AudioNode,
  toneFrequency: number,
  decay: number,
  level: number,
) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(Math.max(3000, toneFrequency), ctx.currentTime);
  bandpass.Q.setValueAtTime(0.8, ctx.currentTime);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(Math.max(2000, toneFrequency * 0.7), ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(Math.max(0.001, level), ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + Math.max(0.02, decay));

  noise.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(destination);

  noise.start();
  noise.stop(ctx.currentTime + Math.max(0.03, decay + 0.02));
};

const updateSyncedNodesForTransport = () => {
  nodeConfigs.forEach((config, id) => {
    if (
      config.type === 'delay' ||
      config.type === 'lfo' ||
      config.type === 'drumMachine' ||
      config.type === 'phaser' ||
      config.type === 'chorus' ||
      config.type === 'flanger' ||
      config.type === 'looper' ||
      config.type === 'sampleHold' ||
      config.type === 'tremolo' ||
      config.type === 'ringMod' ||
      config.type === 'vibrato' ||
      config.type === 'autoPan' ||
      config.type === 'autoFilter' ||
      config.type === 'wah' ||
      config.type === 'freezeFx' ||
      config.type === 'granular'
    ) {
      applyAudioNodeData(config.type, id, config.data);
    }
  });
};

const clearTransportTimer = () => {
  if (transportState.timerId !== null) {
    window.clearTimeout(transportState.timerId);
    transportState.timerId = null;
  }
};

const getNextTransportIntervalMs = () => {
  const baseMs = getSyncedDurationSeconds('1/16', transportState.bpm) * 1000;
  const swingAmount = transportState.swing;
  const isEvenStep = transportState.step % 2 === 0;

  return baseMs * (isEvenStep ? 1 + swingAmount : 1 - swingAmount);
};

const tickTransport = () => {
  const ctx = audioContext;
  if (!ctx || ctx.state !== 'running') {
    return;
  }

  const step = transportState.step % 16;

  arpeggiators.forEach((arpeggiator) => {
    if (!shouldTriggerOnTransportStep(step, arpeggiator.syncDivision)) {
      return;
    }

    const targets = arpeggiatorTargets.get(arpeggiator.id);
    const playableSteps = getPlayableArpSteps(arpeggiator);
    if (playableSteps.length === 0) {
      return;
    }

    const stepPosition =
      arpeggiator.mode === 'random'
        ? Math.floor(Math.random() * playableSteps.length)
        : arpeggiator.stepIndex % playableSteps.length;

    const arpStep = playableSteps[stepPosition];

    if (targets && arpStep) {
      const quantizedNote = quantizeNoteToScale(arpStep.note, arpeggiator.scale);
      const frequency = noteToFrequency(quantizedNote, arpStep.octave);
      targets.forEach((targetId) => {
        updateNodeParam(targetId, 'frequency', frequency);
      });
    }

    dispatchTransportEvent('arpeggiator-step', {
      id: arpeggiator.id,
      stepIndex: stepPosition,
      note: arpStep ? quantizeNoteToScale(arpStep.note, arpeggiator.scale) : undefined,
      octave: arpStep?.octave,
    });

    if (arpeggiator.mode !== 'random') {
      arpeggiator.stepIndex = (arpeggiator.stepIndex + 1) % playableSteps.length;
    }
  });

  drumMachines.forEach((drumMachine) => {
    if (drumMachine.pattern.kick[step]) {
      triggerKick(ctx, drumMachine.output);
    }

    if (drumMachine.pattern.snare[step]) {
      triggerSnare(ctx, drumMachine.output);
    }

    if (drumMachine.pattern.hihat[step]) {
      triggerHiHat(ctx, drumMachine.output);
    }
  });

  kickSynths.forEach((synth) => {
    if (synth.pattern[step]) {
      triggerKickVoice(ctx, synth.output, synth.tone, synth.decay, synth.gain);
    }
  });

  snareSynths.forEach((synth) => {
    if (synth.pattern[step]) {
      triggerSnareVoice(ctx, synth.output, synth.tone, synth.decay, synth.gain);
    }
  });

  hiHatSynths.forEach((synth) => {
    if (synth.pattern[step]) {
      triggerHiHatVoice(ctx, synth.output, synth.tone, synth.decay, synth.gain);
    }
  });

  clockDividers.forEach((divider) => {
    const isPulse = shouldTriggerOnTransportStep(step, divider.syncDivision);
    divider.source.offset.setTargetAtTime(isPulse ? 1 : 0, ctx.currentTime, 0.002);
  });

  randomCvs.forEach((randomCv) => {
    if (!shouldTriggerOnTransportStep(step, randomCv.syncDivision)) {
      return;
    }

    const minValue = Math.min(randomCv.minValue, randomCv.maxValue);
    const maxValue = Math.max(randomCv.minValue, randomCv.maxValue);
    const value = minValue + Math.random() * (maxValue - minValue);
    randomCv.source.offset.setTargetAtTime(value, ctx.currentTime, 0.002);
  });

  gateSeqs.forEach((gateSeq) => {
    if (!shouldTriggerOnTransportStep(step, gateSeq.syncDivision)) {
      return;
    }

    const isOpen = gateSeq.steps[step] ?? false;
    gateSeq.gate.gain.setTargetAtTime(isOpen ? 1 : 0, ctx.currentTime, 0.003);
  });

  dispatchTransportEvent('transport-step', {
    step,
    bpm: transportState.bpm,
  });
  emitTransportState();

  transportState.step = (step + 1) % 16;
  if (transportState.isPlaying) {
    transportState.timerId = window.setTimeout(tickTransport, getNextTransportIntervalMs());
  }
};

const restartTransportTimer = () => {
  clearTransportTimer();

  if (!transportState.isPlaying) {
    return;
  }

  transportState.timerId = window.setTimeout(tickTransport, getNextTransportIntervalMs());
};

const resolveTarget = (
  targetId: string,
  targetHandleId?: string | null,
): AudioNode | AudioParam | AudioDestinationNode | undefined => {
  if (!audioContext) {
    return undefined;
  }

  if (targetId === 'destination') {
    return audioContext.destination;
  }

  if (targetHandleId?.startsWith('ch')) {
    return nodes.get(`${targetId}_${targetHandleId}`);
  }

  if (targetHandleId === 'mod') {
    const targetNode = nodes.get(targetId);

    if (targetNode instanceof OscillatorNode || targetNode instanceof BiquadFilterNode) {
      return targetNode.frequency;
    }

    if (targetNode instanceof GainNode) {
      return targetNode.gain;
    }

    if (targetNode instanceof StereoPannerNode) {
      return targetNode.pan;
    }
  }

  return nodes.get(targetId);
};

const resolveSource = (sourceId: string) => {
  return nodes.get(`${sourceId}_out`) ?? nodes.get(`${sourceId}_gain`) ?? nodes.get(sourceId);
};

const updateIfDefined = (
  id: string,
  param: AudioParamName,
  value: AudioParamValue | undefined,
) => {
  if (value === undefined) {
    return;
  }

  updateNodeParam(id, param, value);
};

const destroyNodeById = (id: string) => {
  drumMachines.delete(id);
  arpeggiators.delete(id);
  arpeggiatorTargets.delete(id);
  arpeggiatorTargets.forEach((targets) => targets.delete(id));
  const equalizer = equalizers.get(id);
  if (equalizer) {
    try {
      equalizer.input.disconnect();
      equalizer.output.disconnect();
      equalizer.filters.forEach((filter) => filter.disconnect());
    } catch {
      // Ignore cleanup errors while tearing down the EQ chain.
    }
    equalizers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const phaser = phasers.get(id);
  if (phaser) {
    try {
      phaser.input.disconnect();
      phaser.output.disconnect();
      phaser.dry.disconnect();
      phaser.wet.disconnect();
      phaser.feedbackGain.disconnect();
      phaser.filters.forEach((filter) => filter.disconnect());
      phaser.lfo.disconnect();
      phaser.lfoGain.disconnect();
      phaser.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the phaser chain.
    }
    phasers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const compressor = compressors.get(id);
  if (compressor) {
    try {
      compressor.compressor.disconnect();
      compressor.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the compressor chain.
    }
    compressors.delete(id);
    nodes.delete(`${id}_out`);
  }

  const chorus = choruses.get(id);
  if (chorus) {
    try {
      chorus.input.disconnect();
      chorus.output.disconnect();
      chorus.dry.disconnect();
      chorus.wet.disconnect();
      chorus.delay.disconnect();
      chorus.lfo.disconnect();
      chorus.lfoGain.disconnect();
      chorus.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the chorus chain.
    }
    choruses.delete(id);
    nodes.delete(`${id}_out`);
  }

  const bitcrusher = bitcrushers.get(id);
  if (bitcrusher) {
    try {
      bitcrusher.input.disconnect();
      bitcrusher.output.disconnect();
      bitcrusher.dry.disconnect();
      bitcrusher.wet.disconnect();
      bitcrusher.processor.disconnect();
      bitcrusher.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the bitcrusher chain.
    }
    bitcrushers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const flanger = flangers.get(id);
  if (flanger) {
    try {
      flanger.input.disconnect();
      flanger.output.disconnect();
      flanger.dry.disconnect();
      flanger.wet.disconnect();
      flanger.delay.disconnect();
      flanger.feedbackGain.disconnect();
      flanger.lfo.disconnect();
      flanger.lfoGain.disconnect();
      flanger.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the flanger chain.
    }
    flangers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const limiter = limiters.get(id);
  if (limiter) {
    try {
      limiter.compressor.disconnect();
      limiter.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the limiter chain.
    }
    limiters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const looper = loopers.get(id);
  if (looper) {
    try {
      looper.input.disconnect();
      looper.output.disconnect();
      looper.dry.disconnect();
      looper.wet.disconnect();
      looper.processor.disconnect();
      looper.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the looper chain.
    }
    loopers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const fmSynth = fmSynths.get(id);
  if (fmSynth) {
    try {
      fmSynth.carrier.disconnect();
      fmSynth.modulator.disconnect();
      fmSynth.modGain.disconnect();
      fmSynth.output.disconnect();
      fmSynth.modulator.stop();
    } catch {
      // Ignore cleanup errors while tearing down the FM synth.
    }
    fmSynths.delete(id);
    nodes.delete(`${id}_out`);
  }

  const subOsc = subOscs.get(id);
  if (subOsc) {
    try {
      subOsc.oscillator.disconnect();
      subOsc.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the sub oscillator.
    }
    subOscs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const noiseLayer = noiseLayers.get(id);
  if (noiseLayer) {
    try {
      noiseLayer.source.disconnect();
      noiseLayer.filter.disconnect();
      noiseLayer.output.disconnect();
      noiseLayer.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the noise layer.
    }
    noiseLayers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const tremolo = tremolos.get(id);
  if (tremolo) {
    try {
      tremolo.input.disconnect();
      tremolo.output.disconnect();
      tremolo.wet.disconnect();
      tremolo.dry.disconnect();
      tremolo.lfo.disconnect();
      tremolo.lfoDepth.disconnect();
      tremolo.lfoOffset.disconnect();
      tremolo.lfo.stop();
      tremolo.lfoOffset.stop();
    } catch {
      // Ignore cleanup errors while tearing down the tremolo chain.
    }
    tremolos.delete(id);
    nodes.delete(`${id}_out`);
  }

  const ringMod = ringMods.get(id);
  if (ringMod) {
    try {
      ringMod.input.disconnect();
      ringMod.output.disconnect();
      ringMod.wet.disconnect();
      ringMod.dry.disconnect();
      ringMod.modulator.disconnect();
      ringMod.modDepth.disconnect();
      ringMod.modOffset.disconnect();
      ringMod.modulator.stop();
      ringMod.modOffset.stop();
    } catch {
      // Ignore cleanup errors while tearing down the ring mod chain.
    }
    ringMods.delete(id);
    nodes.delete(`${id}_out`);
  }

  const vibrato = vibratos.get(id);
  if (vibrato) {
    try {
      vibrato.input.disconnect();
      vibrato.output.disconnect();
      vibrato.wet.disconnect();
      vibrato.dry.disconnect();
      vibrato.delay.disconnect();
      vibrato.lfo.disconnect();
      vibrato.lfoDepth.disconnect();
      vibrato.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the vibrato chain.
    }
    vibratos.delete(id);
    nodes.delete(`${id}_out`);
  }

  const combFilter = combFilters.get(id);
  if (combFilter) {
    try {
      combFilter.input.disconnect();
      combFilter.output.disconnect();
      combFilter.wet.disconnect();
      combFilter.dry.disconnect();
      combFilter.delay.disconnect();
      combFilter.feedbackGain.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the comb filter chain.
    }
    combFilters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const dualOsc = dualOscs.get(id);
  if (dualOsc) {
    try {
      dualOsc.oscA.disconnect();
      dualOsc.oscB.disconnect();
      dualOsc.mixA.disconnect();
      dualOsc.mixB.disconnect();
      dualOsc.output.disconnect();
      dualOsc.oscA.stop();
      dualOsc.oscB.stop();
    } catch {
      // Ignore cleanup errors while tearing down the dual oscillator.
    }
    dualOscs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const autoPan = autoPans.get(id);
  if (autoPan) {
    try {
      autoPan.input.disconnect();
      autoPan.output.disconnect();
      autoPan.dry.disconnect();
      autoPan.wet.disconnect();
      autoPan.panner.disconnect();
      autoPan.lfo.disconnect();
      autoPan.lfoGain.disconnect();
      autoPan.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the auto-pan chain.
    }
    autoPans.delete(id);
    nodes.delete(`${id}_out`);
  }

  const autoFilter = autoFilters.get(id);
  if (autoFilter) {
    try {
      autoFilter.input.disconnect();
      autoFilter.output.disconnect();
      autoFilter.dry.disconnect();
      autoFilter.wet.disconnect();
      autoFilter.filter.disconnect();
      autoFilter.lfo.disconnect();
      autoFilter.lfoGain.disconnect();
      autoFilter.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the auto filter chain.
    }
    autoFilters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const clockDivider = clockDividers.get(id);
  if (clockDivider) {
    try {
      clockDivider.source.disconnect();
      clockDivider.output.disconnect();
      clockDivider.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the clock divider.
    }
    clockDividers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const randomCv = randomCvs.get(id);
  if (randomCv) {
    try {
      randomCv.source.disconnect();
      randomCv.output.disconnect();
      randomCv.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the random CV source.
    }
    randomCvs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const sampleHold = sampleHolds.get(id);
  if (sampleHold) {
    try {
      sampleHold.input.disconnect();
      sampleHold.output.disconnect();
      sampleHold.dry.disconnect();
      sampleHold.wet.disconnect();
      sampleHold.processor.disconnect();
      sampleHold.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the sample and hold effect.
    }
    sampleHolds.delete(id);
    nodes.delete(`${id}_out`);
  }

  const gateSeq = gateSeqs.get(id);
  if (gateSeq) {
    try {
      gateSeq.input.disconnect();
      gateSeq.output.disconnect();
      gateSeq.gate.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the gate sequencer.
    }
    gateSeqs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const resonator = resonators.get(id);
  if (resonator) {
    try {
      resonator.input.disconnect();
      resonator.output.disconnect();
      resonator.dry.disconnect();
      resonator.wet.disconnect();
      resonator.filters.forEach((filter) => filter.disconnect());
    } catch {
      // Ignore cleanup errors while tearing down the resonator chain.
    }
    resonators.delete(id);
    nodes.delete(`${id}_out`);
  }

  const wah = wahs.get(id);
  if (wah) {
    try {
      wah.input.disconnect();
      wah.output.disconnect();
      wah.dry.disconnect();
      wah.wet.disconnect();
      wah.filter.disconnect();
      wah.lfo.disconnect();
      wah.lfoGain.disconnect();
      wah.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the wah chain.
    }
    wahs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const stereoWidener = stereoWideners.get(id);
  if (stereoWidener) {
    try {
      stereoWidener.input.disconnect();
      stereoWidener.output.disconnect();
      stereoWidener.dry.disconnect();
      stereoWidener.wet.disconnect();
      stereoWidener.merger.disconnect();
      stereoWidener.delayLeft.disconnect();
      stereoWidener.delayRight.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the stereo widener chain.
    }
    stereoWideners.delete(id);
    nodes.delete(`${id}_out`);
  }

  const foldback = foldbacks.get(id);
  if (foldback) {
    try {
      foldback.input.disconnect();
      foldback.output.disconnect();
      foldback.dry.disconnect();
      foldback.wet.disconnect();
      foldback.shaper.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the foldback chain.
    }
    foldbacks.delete(id);
    nodes.delete(`${id}_out`);
  }

  const tiltEq = tiltEqs.get(id);
  if (tiltEq) {
    try {
      tiltEq.input.disconnect();
      tiltEq.output.disconnect();
      tiltEq.dry.disconnect();
      tiltEq.wet.disconnect();
      tiltEq.lowShelf.disconnect();
      tiltEq.highShelf.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the tilt EQ chain.
    }
    tiltEqs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const saturator = saturators.get(id);
  if (saturator) {
    try {
      saturator.input.disconnect();
      saturator.output.disconnect();
      saturator.dry.disconnect();
      saturator.wet.disconnect();
      saturator.shaper.disconnect();
      saturator.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the saturator chain.
    }
    saturators.delete(id);
    nodes.delete(`${id}_out`);
  }

  const cabSim = cabSims.get(id);
  if (cabSim) {
    try {
      cabSim.input.disconnect();
      cabSim.output.disconnect();
      cabSim.dry.disconnect();
      cabSim.wet.disconnect();
      cabSim.highpass.disconnect();
      cabSim.peak.disconnect();
      cabSim.lowpass.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the cab sim chain.
    }
    cabSims.delete(id);
    nodes.delete(`${id}_out`);
  }

  const transientShaper = transientShapers.get(id);
  if (transientShaper) {
    try {
      transientShaper.input.disconnect();
      transientShaper.output.disconnect();
      transientShaper.dry.disconnect();
      transientShaper.wet.disconnect();
      transientShaper.processor.disconnect();
      transientShaper.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the transient shaper.
    }
    transientShapers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const freezeFx = freezeFxs.get(id);
  if (freezeFx) {
    try {
      freezeFx.input.disconnect();
      freezeFx.output.disconnect();
      freezeFx.dry.disconnect();
      freezeFx.wet.disconnect();
      freezeFx.processor.disconnect();
      freezeFx.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the freeze effect.
    }
    freezeFxs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const granular = granulars.get(id);
  if (granular) {
    try {
      granular.input.disconnect();
      granular.output.disconnect();
      granular.dry.disconnect();
      granular.wet.disconnect();
      granular.processor.disconnect();
      granular.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the granular effect.
    }
    granulars.delete(id);
    nodes.delete(`${id}_out`);
  }

  const monoSynth = monoSynths.get(id);
  if (monoSynth) {
    try {
      monoSynth.oscillator.disconnect();
      monoSynth.filter.disconnect();
      monoSynth.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the mono synth.
    }
    monoSynths.delete(id);
    nodes.delete(`${id}_out`);
  }

  kickSynths.delete(id);
  snareSynths.delete(id);
  hiHatSynths.delete(id);

  const chordGenerator = chordGenerators.get(id);
  if (chordGenerator) {
    try {
      chordGenerator.oscillators.forEach((oscillator) => oscillator.disconnect());
      chordGenerator.output.disconnect();
      chordGenerator.oscillators.forEach((oscillator) => oscillator.stop());
    } catch {
      // Ignore cleanup errors while tearing down the chord generator.
    }
    chordGenerators.delete(id);
  }

  const stereoAnalyser = stereoAnalysers.get(id);
  if (stereoAnalyser) {
    try {
      stereoAnalyser.input.disconnect();
      stereoAnalyser.output.disconnect();
      stereoAnalyser.splitter.disconnect();
      stereoAnalyser.left.disconnect();
      stereoAnalyser.right.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the stereo analyser monitor.
    }
    stereoAnalysers.delete(id);
    nodes.delete(`${id}_out`);
  }
  nodeConfigs.delete(id);

  const node = nodes.get(id);
  if (!node) {
    return;
  }

  stopSourceNode(node);

  try {
    node.disconnect();
  } catch {
    // Ignore disconnect errors for nodes that are already detached.
  }

  nodes.delete(id);
  analysers.delete(id);
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

export const getAudioContextState = () => {
  return audioContext?.state ?? 'closed';
};

export const getTransportState = () => ({
  bpm: transportState.bpm,
  swing: transportState.swing,
  isPlaying: transportState.isPlaying,
  step: transportState.step,
});

export const startTransport = () => {
  transportState.isPlaying = true;
  transportState.step = 0;
  emitTransportState();
  restartTransportTimer();
  dispatchTransportEvent('transport-start', {
    bpm: transportState.bpm,
    step: 0,
  });
};

export const setTransportBpm = (bpm: number) => {
  if (!Number.isFinite(bpm)) {
    return;
  }

  if (transportState.bpm === bpm) {
    return;
  }

  transportState.bpm = bpm;
  restartTransportTimer();
  updateSyncedNodesForTransport();
  emitTransportState();
  dispatchTransportEvent('transport-bpm', {
    bpm: transportState.bpm,
  });
};

export const setTransportSwing = (swing: number) => {
  if (!Number.isFinite(swing)) {
    return;
  }

  const normalizedSwing = Math.max(0, Math.min(0.45, swing));

  if (transportState.swing === normalizedSwing) {
    return;
  }

  transportState.swing = normalizedSwing;
  restartTransportTimer();
  emitTransportState();
  dispatchTransportEvent('transport-swing', {
    swing: transportState.swing,
  });
};

export const createOscillator = (id: string) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.start();
  nodes.set(id, osc);
  return osc;
};

export const createGain = (id: string) => {
  const ctx = getAudioContext();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  nodes.set(id, gain);
  return gain;
};

export const createFilter = (id: string) => {
  const ctx = getAudioContext();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.Q.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, filter);
  return filter;
};

export const createDelay = (id: string) => {
  const ctx = getAudioContext();
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.3, ctx.currentTime);
  nodes.set(id, delay);
  return delay;
};

export const createNoise = (id: string) => {
  const ctx = getAudioContext();
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = getNoiseBuffer(ctx);
  whiteNoise.loop = true;
  whiteNoise.start();
  nodes.set(id, whiteNoise);
  return whiteNoise;
};

export const createDistortion = (id: string) => {
  const ctx = getAudioContext();
  const distortion = ctx.createWaveShaper();
  distortion.curve = buildDistortionCurve(400);
  distortion.oversample = '4x';
  nodes.set(id, distortion);
  return distortion;
};

export const createReverb = (id: string) => {
  const ctx = getAudioContext();
  const convolver = ctx.createConvolver();
  convolver.buffer = buildImpulseResponse(ctx, 2, 3);
  nodes.set(id, convolver);
  return convolver;
};

export const createCompressor = (id: string) => {
  const ctx = getAudioContext();
  const compressor = ctx.createDynamicsCompressor();
  const makeup = ctx.createGain();

  compressor.threshold.setValueAtTime(-24, ctx.currentTime);
  compressor.knee.setValueAtTime(18, ctx.currentTime);
  compressor.ratio.setValueAtTime(6, ctx.currentTime);
  compressor.attack.setValueAtTime(0.01, ctx.currentTime);
  compressor.release.setValueAtTime(0.25, ctx.currentTime);
  makeup.gain.setValueAtTime(1, ctx.currentTime);

  compressor.connect(makeup);
  nodes.set(id, compressor);
  nodes.set(`${id}_out`, makeup);
  compressors.set(id, {
    compressor,
    makeup,
  });
};

export const createMixer = (id: string) => {
  const ctx = getAudioContext();
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, mainGain);

  for (let channel = 1; channel <= 4; channel += 1) {
    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.5, ctx.currentTime);
    channelGain.connect(mainGain);
    nodes.set(`${id}_ch${channel}`, channelGain);
  }

  return mainGain;
};

export const createAnalyser = (id: string) => {
  const ctx = getAudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  nodes.set(id, analyser);
  analysers.set(id, analyser);
  return analyser;
};

export const createStereoAnalyser = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const splitter = ctx.createChannelSplitter(2);
  const left = ctx.createAnalyser();
  const right = ctx.createAnalyser();

  left.fftSize = 2048;
  left.smoothingTimeConstant = 0.8;
  right.fftSize = 2048;
  right.smoothingTimeConstant = 0.8;

  input.connect(output);
  input.connect(splitter);
  splitter.connect(left, 0);
  splitter.connect(right, 1);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  stereoAnalysers.set(id, {
    input,
    output,
    splitter,
    left,
    right,
  });
};

export const createPanner = (id: string) => {
  const ctx = getAudioContext();
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(0, ctx.currentTime);
  nodes.set(id, panner);
  return panner;
};

export const createLFO = (id: string) => {
  const ctx = getAudioContext();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  lfo.frequency.setValueAtTime(1, ctx.currentTime);
  lfoGain.gain.setValueAtTime(100, ctx.currentTime);

  lfo.connect(lfoGain);
  lfo.start();

  nodes.set(id, lfo);
  nodes.set(`${id}_gain`, lfoGain);
  return lfo;
};

export const createDrumMachine = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.9, ctx.currentTime);
  nodes.set(id, output);

  drumMachines.set(id, {
    id,
    output,
    pattern: defaultDrumPattern(),
  });

  return output;
};

export const createArpeggiator = (id: string) => {
  arpeggiators.set(id, {
    id,
    stepIndex: 0,
    syncDivision: '1/8',
    steps: defaultArpSteps(),
    mode: 'up',
    scale: 'chromatic',
  });
  arpeggiatorTargets.set(id, new Set());
};

export const createEqualizer8 = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);

  const filters = EQ_BAND_CONFIGS.map((band) => {
    const filter = ctx.createBiquadFilter();
    filter.type = band.type;
    filter.frequency.setValueAtTime(band.frequency, ctx.currentTime);
    filter.Q.setValueAtTime(band.q, ctx.currentTime);
    filter.gain.setValueAtTime(0, ctx.currentTime);
    return filter;
  });

  input.connect(filters[0]);
  for (let index = 0; index < filters.length - 1; index += 1) {
    filters[index].connect(filters[index + 1]);
  }
  filters[filters.length - 1].connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  equalizers.set(id, {
    input,
    output,
    filters,
  });
};

export const createChorus = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(0.1);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0.55, ctx.currentTime);
  wet.gain.setValueAtTime(0.45, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.02, ctx.currentTime);
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.8, ctx.currentTime);
  lfoGain.gain.setValueAtTime(0.012, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delay);
  delay.connect(wet);
  wet.connect(output);

  lfo.connect(lfoGain);
  lfoGain.connect(delay.delayTime);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  choruses.set(id, {
    input,
    output,
    dry,
    wet,
    delay,
    lfo,
    lfoGain,
  });
};

export const createPhaser = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const feedbackGain = ctx.createGain();
  const filters = PHASER_CENTER_FREQUENCIES.map((frequency) => {
    const filter = ctx.createBiquadFilter();
    filter.type = 'allpass';
    filter.frequency.setValueAtTime(frequency, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);
    return filter;
  });
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  input.connect(dry);
  dry.connect(output);

  input.connect(filters[0]);
  for (let index = 0; index < filters.length - 1; index += 1) {
    filters[index].connect(filters[index + 1]);
  }
  filters[filters.length - 1].connect(wet);
  wet.connect(output);
  filters[filters.length - 1].connect(feedbackGain);
  feedbackGain.connect(filters[0]);

  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.6, ctx.currentTime);
  lfoGain.gain.setValueAtTime(800, ctx.currentTime);
  lfo.connect(lfoGain);
  filters.forEach((filter) => lfoGain.connect(filter.frequency));
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  phasers.set(id, {
    input,
    output,
    dry,
    wet,
    feedbackGain,
    filters,
    lfo,
    lfoGain,
  });
};

export const createBitcrusher = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  const params = {
    bits: 6,
    normFreq: 0.2,
  };

  dry.gain.setValueAtTime(0.3, ctx.currentTime);
  wet.gain.setValueAtTime(0.7, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);
    const bits = Math.max(1, Math.min(16, Math.round(params.bits)));
    const normFreq = Math.max(0.01, Math.min(1, params.normFreq));
    const step = 1 / Math.pow(2, bits);
    let phase = 0;
    let last = 0;

    for (let index = 0; index < inputBuffer.length; index += 1) {
      phase += normFreq;
      if (phase >= 1) {
        phase -= 1;
        last = step * Math.floor(inputBuffer[index] / step + 0.5);
      }
      outputBuffer[index] = last;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  bitcrushers.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createFlanger = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(0.05);
  const feedbackGain = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0.5, ctx.currentTime);
  wet.gain.setValueAtTime(0.5, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.003, ctx.currentTime);
  feedbackGain.gain.setValueAtTime(0.55, ctx.currentTime);
  lfo.type = 'triangle';
  lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
  lfoGain.gain.setValueAtTime(0.003, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delay);
  delay.connect(wet);
  wet.connect(output);
  delay.connect(feedbackGain);
  feedbackGain.connect(delay);

  lfo.connect(lfoGain);
  lfoGain.connect(delay.delayTime);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  flangers.set(id, {
    input,
    output,
    dry,
    wet,
    delay,
    feedbackGain,
    lfo,
    lfoGain,
  });
};

export const createLimiter = (id: string) => {
  const ctx = getAudioContext();
  const compressor = ctx.createDynamicsCompressor();
  const makeup = ctx.createGain();

  compressor.threshold.setValueAtTime(-6, ctx.currentTime);
  compressor.knee.setValueAtTime(0, ctx.currentTime);
  compressor.ratio.setValueAtTime(20, ctx.currentTime);
  compressor.attack.setValueAtTime(0.003, ctx.currentTime);
  compressor.release.setValueAtTime(0.08, ctx.currentTime);
  makeup.gain.setValueAtTime(1, ctx.currentTime);

  compressor.connect(makeup);
  nodes.set(id, compressor);
  nodes.set(`${id}_out`, makeup);
  limiters.set(id, {
    compressor,
    makeup,
  });
};

export const createLooper = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const maxLengthSamples = Math.max(1, Math.floor(ctx.sampleRate * 8));
  const loopBuffer = new Float32Array(maxLengthSamples);
  let position = 0;
  const params = {
    lengthSamples: Math.max(1, Math.floor(ctx.sampleRate * 0.5)),
    feedback: 0.2,
    mix: 0.8,
    freeze: false,
  };

  dry.gain.setValueAtTime(0.2, ctx.currentTime);
  wet.gain.setValueAtTime(0.8, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);
    const lengthSamples = Math.max(1, Math.min(maxLengthSamples, Math.floor(params.lengthSamples)));

    if (position >= lengthSamples) {
      position = 0;
    }

    for (let index = 0; index < inputBuffer.length; index += 1) {
      const looped = loopBuffer[position];
      const source = inputBuffer[index];
      if (!params.freeze) {
        const written = Math.max(-1, Math.min(1, source + looped * params.feedback));
        loopBuffer[position] = written;
      }
      outputBuffer[index] = looped;
      position = (position + 1) % lengthSamples;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  loopers.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createFMSynth = (id: string) => {
  const ctx = getAudioContext();
  const carrier = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const modGain = ctx.createGain();
  const output = ctx.createGain();

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(220, ctx.currentTime);
  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(220, ctx.currentTime);
  modGain.gain.setValueAtTime(180, ctx.currentTime);
  output.gain.setValueAtTime(0.35, ctx.currentTime);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  carrier.connect(output);

  carrier.start();
  modulator.start();

  nodes.set(id, carrier);
  nodes.set(`${id}_out`, output);
  fmSynths.set(id, {
    carrier,
    modulator,
    modGain,
    output,
  });
};

export const createSubOsc = (id: string) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const output = ctx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(55, ctx.currentTime);
  output.gain.setValueAtTime(0.4, ctx.currentTime);
  oscillator.connect(output);
  oscillator.start();

  nodes.set(id, oscillator);
  nodes.set(`${id}_out`, output);
  subOscs.set(id, {
    oscillator,
    output,
  });
};

export const createNoiseLayer = (id: string) => {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const output = ctx.createGain();

  source.buffer = getNoiseBuffer(ctx);
  source.loop = true;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2800, ctx.currentTime);
  filter.Q.setValueAtTime(0.8, ctx.currentTime);
  output.gain.setValueAtTime(0.18, ctx.currentTime);

  source.connect(filter);
  filter.connect(output);
  source.start();

  nodes.set(id, source);
  nodes.set(`${id}_out`, output);
  noiseLayers.set(id, {
    source,
    filter,
    output,
  });
};

export const createTremolo = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const wet = ctx.createGain();
  const dry = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();
  const lfoOffset = ctx.createConstantSource();

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  lfo.frequency.setValueAtTime(4, ctx.currentTime);
  lfoDepth.gain.setValueAtTime(0.375, ctx.currentTime);
  lfoOffset.offset.setValueAtTime(0.625, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(wet);
  wet.connect(output);
  lfo.connect(lfoDepth);
  lfoDepth.connect(wet.gain);
  lfoOffset.connect(wet.gain);
  lfo.start();
  lfoOffset.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  tremolos.set(id, {
    input,
    output,
    wet,
    dry,
    lfo,
    lfoDepth,
    lfoOffset,
  });
};

export const createRingMod = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const wet = ctx.createGain();
  const dry = ctx.createGain();
  const modulator = ctx.createOscillator();
  const modDepth = ctx.createGain();
  const modOffset = ctx.createConstantSource();

  dry.gain.setValueAtTime(0.2, ctx.currentTime);
  wet.gain.setValueAtTime(0, ctx.currentTime);
  modulator.frequency.setValueAtTime(60, ctx.currentTime);
  modDepth.gain.setValueAtTime(0.5, ctx.currentTime);
  modOffset.offset.setValueAtTime(0.5, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(wet);
  wet.connect(output);
  modulator.connect(modDepth);
  modDepth.connect(wet.gain);
  modOffset.connect(wet.gain);
  modulator.start();
  modOffset.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  ringMods.set(id, {
    input,
    output,
    wet,
    dry,
    modulator,
    modDepth,
    modOffset,
  });
};

export const createVibrato = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const wet = ctx.createGain();
  const dry = ctx.createGain();
  const delay = ctx.createDelay(0.05);
  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.01, ctx.currentTime);
  lfo.frequency.setValueAtTime(5, ctx.currentTime);
  lfoDepth.gain.setValueAtTime(0.004, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delay);
  delay.connect(wet);
  wet.connect(output);
  lfo.connect(lfoDepth);
  lfoDepth.connect(delay.delayTime);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  vibratos.set(id, {
    input,
    output,
    wet,
    dry,
    delay,
    lfo,
    lfoDepth,
  });
};

export const createCombFilter = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const wet = ctx.createGain();
  const dry = ctx.createGain();
  const delay = ctx.createDelay(0.1);
  const feedbackGain = ctx.createGain();

  dry.gain.setValueAtTime(0.3, ctx.currentTime);
  wet.gain.setValueAtTime(0.7, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.015, ctx.currentTime);
  feedbackGain.gain.setValueAtTime(0.65, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delay);
  delay.connect(wet);
  wet.connect(output);
  delay.connect(feedbackGain);
  feedbackGain.connect(delay);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  combFilters.set(id, {
    input,
    output,
    wet,
    dry,
    delay,
    feedbackGain,
  });
};

export const createDualOsc = (id: string) => {
  const ctx = getAudioContext();
  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const mixA = ctx.createGain();
  const mixB = ctx.createGain();
  const output = ctx.createGain();

  oscA.type = 'sawtooth';
  oscB.type = 'square';
  oscA.frequency.setValueAtTime(220, ctx.currentTime);
  oscB.frequency.setValueAtTime(221.5, ctx.currentTime);
  mixA.gain.setValueAtTime(0.5, ctx.currentTime);
  mixB.gain.setValueAtTime(0.5, ctx.currentTime);
  output.gain.setValueAtTime(0.35, ctx.currentTime);

  oscA.connect(mixA);
  oscB.connect(mixB);
  mixA.connect(output);
  mixB.connect(output);
  oscA.start();
  oscB.start();

  nodes.set(id, oscA);
  nodes.set(`${id}_out`, output);
  dualOscs.set(id, {
    oscA,
    oscB,
    mixA,
    mixB,
    output,
  });
};

export const createAutoPan = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const panner = ctx.createStereoPanner();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  panner.pan.setValueAtTime(0, ctx.currentTime);
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
  lfoGain.gain.setValueAtTime(1, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(wet);
  wet.connect(panner);
  panner.connect(output);
  lfo.connect(lfoGain);
  lfoGain.connect(panner.pan);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  autoPans.set(id, {
    input,
    output,
    dry,
    wet,
    panner,
    lfo,
    lfoGain,
  });
};

export const createAutoFilter = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0.15, ctx.currentTime);
  wet.gain.setValueAtTime(0.85, ctx.currentTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.Q.setValueAtTime(1.2, ctx.currentTime);
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.8, ctx.currentTime);
  lfoGain.gain.setValueAtTime(1100, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(filter);
  filter.connect(wet);
  wet.connect(output);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  autoFilters.set(id, {
    input,
    output,
    dry,
    wet,
    filter,
    lfo,
    lfoGain,
  });
};

export const createClockDivider = (id: string) => {
  const ctx = getAudioContext();
  const source = ctx.createConstantSource();
  const output = ctx.createGain();

  source.offset.setValueAtTime(0, ctx.currentTime);
  output.gain.setValueAtTime(1, ctx.currentTime);
  source.connect(output);
  source.start();

  nodes.set(id, source);
  nodes.set(`${id}_out`, output);
  clockDividers.set(id, {
    source,
    output,
    syncDivision: '1/4',
  });
};

export const createRandomCv = (id: string) => {
  const ctx = getAudioContext();
  const source = ctx.createConstantSource();
  const output = ctx.createGain();

  source.offset.setValueAtTime(0, ctx.currentTime);
  output.gain.setValueAtTime(1, ctx.currentTime);
  source.connect(output);
  source.start();

  nodes.set(id, source);
  nodes.set(`${id}_out`, output);
  randomCvs.set(id, {
    source,
    output,
    syncDivision: '1/8',
    minValue: -300,
    maxValue: 300,
  });
};

export const createSampleHold = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const params = {
    holdSamples: Math.max(1, Math.floor(ctx.sampleRate / 8)),
    mix: 1,
  };
  let held = 0;
  let counter = 0;

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      if (counter <= 0) {
        held = inputBuffer[index];
        counter = params.holdSamples;
      }

      outputBuffer[index] = held;
      counter -= 1;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  sampleHolds.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createGateSeq = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const gate = ctx.createGain();

  gate.gain.setValueAtTime(1, ctx.currentTime);
  input.connect(gate);
  gate.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  gateSeqs.set(id, {
    input,
    output,
    gate,
    steps: Array.from({ length: 16 }, (_, index) => index % 2 === 0),
    syncDivision: '1/16',
  });
};

export const createResonator = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const filters = Array.from({ length: 3 }, () => {
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(440, ctx.currentTime);
    filter.Q.setValueAtTime(12, ctx.currentTime);
    return filter;
  });

  dry.gain.setValueAtTime(0.3, ctx.currentTime);
  wet.gain.setValueAtTime(0.7, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  filters.forEach((filter) => {
    input.connect(filter);
    filter.connect(wet);
  });
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  resonators.set(id, {
    input,
    output,
    dry,
    wet,
    filters,
  });
};

export const createWah = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0.25, ctx.currentTime);
  wet.gain.setValueAtTime(0.75, ctx.currentTime);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(700, ctx.currentTime);
  filter.Q.setValueAtTime(8, ctx.currentTime);
  lfo.type = 'triangle';
  lfo.frequency.setValueAtTime(1.5, ctx.currentTime);
  lfoGain.gain.setValueAtTime(900, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(filter);
  filter.connect(wet);
  wet.connect(output);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  wahs.set(id, {
    input,
    output,
    dry,
    wet,
    filter,
    lfo,
    lfoGain,
  });
};

export const createStereoWidener = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  const delayLeft = ctx.createDelay(0.05);
  const delayRight = ctx.createDelay(0.05);

  dry.gain.setValueAtTime(0.35, ctx.currentTime);
  wet.gain.setValueAtTime(0.65, ctx.currentTime);
  delayLeft.delayTime.setValueAtTime(0.012, ctx.currentTime);
  delayRight.delayTime.setValueAtTime(0.018, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delayLeft);
  input.connect(delayRight);
  delayLeft.connect(merger, 0, 0);
  delayRight.connect(merger, 0, 1);
  merger.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  stereoWideners.set(id, {
    input,
    output,
    dry,
    wet,
    merger,
    delayLeft,
    delayRight,
  });
};

export const createFoldback = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const shaper = ctx.createWaveShaper();

  dry.gain.setValueAtTime(0.25, ctx.currentTime);
  wet.gain.setValueAtTime(0.75, ctx.currentTime);
  shaper.curve = buildFoldbackCurve(2.2, 0.55);
  shaper.oversample = '4x';

  input.connect(dry);
  dry.connect(output);
  input.connect(shaper);
  shaper.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  foldbacks.set(id, {
    input,
    output,
    dry,
    wet,
    shaper,
  });
};

export const createTiltEq = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const lowShelf = ctx.createBiquadFilter();
  const highShelf = ctx.createBiquadFilter();

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  lowShelf.type = 'lowshelf';
  highShelf.type = 'highshelf';
  lowShelf.frequency.setValueAtTime(900, ctx.currentTime);
  highShelf.frequency.setValueAtTime(900, ctx.currentTime);
  lowShelf.gain.setValueAtTime(0, ctx.currentTime);
  highShelf.gain.setValueAtTime(0, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(lowShelf);
  lowShelf.connect(highShelf);
  highShelf.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  tiltEqs.set(id, {
    input,
    output,
    dry,
    wet,
    lowShelf,
    highShelf,
  });
};

export const createSaturator = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const shaper = ctx.createWaveShaper();
  const makeup = ctx.createGain();

  dry.gain.setValueAtTime(0.2, ctx.currentTime);
  wet.gain.setValueAtTime(0.8, ctx.currentTime);
  shaper.curve = buildSaturatorCurve(2.4);
  shaper.oversample = '4x';
  makeup.gain.setValueAtTime(1, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(shaper);
  shaper.connect(makeup);
  makeup.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  saturators.set(id, {
    input,
    output,
    dry,
    wet,
    shaper,
    makeup,
  });
};

export const createCabSim = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const highpass = ctx.createBiquadFilter();
  const peak = ctx.createBiquadFilter();
  const lowpass = ctx.createBiquadFilter();

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(90, ctx.currentTime);
  peak.type = 'peaking';
  peak.frequency.setValueAtTime(1800, ctx.currentTime);
  peak.Q.setValueAtTime(0.8, ctx.currentTime);
  peak.gain.setValueAtTime(2, ctx.currentTime);
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(2600, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(highpass);
  highpass.connect(peak);
  peak.connect(lowpass);
  lowpass.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  cabSims.set(id, {
    input,
    output,
    dry,
    wet,
    highpass,
    peak,
    lowpass,
  });
};

export const createTransientShaper = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const params = {
    attack: 0.7,
    sustain: 0,
    mix: 1,
  };
  let envFast = 0;
  let envSlow = 0;

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      const sample = inputBuffer[index];
      const magnitude = Math.abs(sample);
      envFast += (magnitude - envFast) * 0.35;
      envSlow += (magnitude - envSlow) * 0.015;
      const transient = Math.max(0, envFast - envSlow);
      const body = envSlow;
      const shaped = sample * (1 + transient * params.attack * 5 + body * params.sustain * 2);
      outputBuffer[index] = Math.max(-1, Math.min(1, shaped));
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  transientShapers.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createFreezeFx = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const maxSamples = Math.max(1, Math.floor(ctx.sampleRate * 2));
  const buffer = new Float32Array(maxSamples);
  let position = 0;
  const params = {
    lengthSamples: Math.max(1, Math.floor(ctx.sampleRate * 0.35)),
    mix: 0.9,
    freeze: false,
  };

  dry.gain.setValueAtTime(0.1, ctx.currentTime);
  wet.gain.setValueAtTime(0.9, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);
    const lengthSamples = Math.max(1, Math.min(maxSamples, params.lengthSamples));

    for (let index = 0; index < inputBuffer.length; index += 1) {
      if (position >= lengthSamples) {
        position = 0;
      }

      if (!params.freeze) {
        buffer[position] = inputBuffer[index];
      }

      outputBuffer[index] = buffer[position];
      position += 1;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  freezeFxs.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createGranular = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const maxSamples = Math.max(1, Math.floor(ctx.sampleRate * 4));
  const buffer = new Float32Array(maxSamples);
  let writeIndex = 0;
  let grainCounter = 0;
  let readOffset = 0;
  const params = {
    grainSamples: Math.max(1, Math.floor(ctx.sampleRate * 0.12)),
    spray: 0.35,
    mix: 0.8,
  };

  dry.gain.setValueAtTime(0.2, ctx.currentTime);
  wet.gain.setValueAtTime(0.8, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      buffer[writeIndex] = inputBuffer[index];

      if (grainCounter <= 0) {
        const maxOffset = Math.min(maxSamples - 1, params.grainSamples * (1 + params.spray * 8));
        readOffset = Math.max(1, Math.floor(params.grainSamples + Math.random() * maxOffset));
        grainCounter = params.grainSamples;
      }

      const readIndex = (writeIndex - readOffset + maxSamples) % maxSamples;
      outputBuffer[index] = buffer[readIndex] ?? 0;

      writeIndex = (writeIndex + 1) % maxSamples;
      grainCounter -= 1;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  granulars.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createMonoSynth = (id: string) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const output = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(220, ctx.currentTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, ctx.currentTime);
  filter.Q.setValueAtTime(0.8, ctx.currentTime);
  output.gain.setValueAtTime(0.35, ctx.currentTime);

  oscillator.connect(filter);
  filter.connect(output);
  oscillator.start();

  nodes.set(id, oscillator);
  nodes.set(`${id}_out`, output);
  monoSynths.set(id, {
    oscillator,
    filter,
    output,
  });
};

export const createKickSynth = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, output);
  kickSynths.set(id, {
    id,
    output,
    pattern: [...DEFAULT_KICK_STEPS],
    tone: 58,
    decay: 0.24,
    gain: 0.9,
  });
};

export const createSnareSynth = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, output);
  snareSynths.set(id, {
    id,
    output,
    pattern: [...DEFAULT_SNARE_STEPS],
    tone: 180,
    decay: 0.16,
    gain: 0.65,
  });
};

export const createHiHatSynth = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, output);
  hiHatSynths.set(id, {
    id,
    output,
    pattern: [...DEFAULT_HIHAT_STEPS],
    tone: 9500,
    decay: 0.06,
    gain: 0.4,
  });
};

export const createChordGenerator = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.22, ctx.currentTime);

  const oscillators = Array.from({ length: 3 }, () => {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.connect(output);
    oscillator.start();
    return oscillator;
  });

  nodes.set(id, output);
  chordGenerators.set(id, {
    oscillators,
    output,
  });
};

export const createAudioNode = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData = {},
) => {
  switch (type) {
    case 'oscillator':
      createOscillator(id);
      break;
    case 'dualOsc':
      createDualOsc(id);
      break;
    case 'gain':
      createGain(id);
      break;
    case 'filter':
      createFilter(id);
      break;
    case 'delay':
      createDelay(id);
      break;
    case 'noise':
      createNoise(id);
      break;
    case 'distortion':
      createDistortion(id);
      break;
    case 'reverb':
      createReverb(id);
      break;
    case 'compressor':
      createCompressor(id);
      break;
    case 'chorus':
      createChorus(id);
      break;
    case 'bitcrusher':
      createBitcrusher(id);
      break;
    case 'flanger':
      createFlanger(id);
      break;
    case 'limiter':
      createLimiter(id);
      break;
    case 'looper':
      createLooper(id);
      break;
    case 'tremolo':
      createTremolo(id);
      break;
    case 'ringMod':
      createRingMod(id);
      break;
    case 'vibrato':
      createVibrato(id);
      break;
    case 'combFilter':
      createCombFilter(id);
      break;
    case 'autoPan':
      createAutoPan(id);
      break;
    case 'autoFilter':
      createAutoFilter(id);
      break;
    case 'clockDivider':
      createClockDivider(id);
      break;
    case 'randomCv':
      createRandomCv(id);
      break;
    case 'sampleHold':
      createSampleHold(id);
      break;
    case 'gateSeq':
      createGateSeq(id);
      break;
    case 'resonator':
      createResonator(id);
      break;
    case 'wah':
      createWah(id);
      break;
    case 'stereoWidener':
      createStereoWidener(id);
      break;
    case 'foldback':
      createFoldback(id);
      break;
    case 'tiltEq':
      createTiltEq(id);
      break;
    case 'saturator':
      createSaturator(id);
      break;
    case 'cabSim':
      createCabSim(id);
      break;
    case 'transientShaper':
      createTransientShaper(id);
      break;
    case 'freezeFx':
      createFreezeFx(id);
      break;
    case 'granular':
      createGranular(id);
      break;
    case 'monoSynth':
      createMonoSynth(id);
      break;
    case 'kickSynth':
      createKickSynth(id);
      break;
    case 'snareSynth':
      createSnareSynth(id);
      break;
    case 'hiHatSynth':
      createHiHatSynth(id);
      break;
    case 'chordGenerator':
      createChordGenerator(id);
      break;
    case 'scope':
    case 'vuMeter':
    case 'tuner':
    case 'spectrogram':
      createAnalyser(id);
      break;
    case 'phaseCorrelator':
    case 'lissajous':
      createStereoAnalyser(id);
      break;
    case 'mixer':
      createMixer(id);
      break;
    case 'panner':
      createPanner(id);
      break;
    case 'lfo':
      createLFO(id);
      break;
    case 'drumMachine':
      createDrumMachine(id);
      break;
    case 'arpeggiator':
      createArpeggiator(id);
      break;
    case 'equalizer8':
      createEqualizer8(id);
      break;
    case 'phaser':
      createPhaser(id);
      break;
    case 'fmSynth':
      createFMSynth(id);
      break;
    case 'subOsc':
      createSubOsc(id);
      break;
    case 'noiseLayer':
      createNoiseLayer(id);
      break;
  }

  applyAudioNodeData(type, id, data);
};

export const applyAudioNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
) => {
  nodeConfigs.set(id, {
    type,
    data: { ...data },
  });

  switch (type) {
    case 'oscillator':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      break;
    case 'dualOsc': {
      const dualOsc = dualOscs.get(id);
      if (!dualOsc) {
        break;
      }

      const baseFrequency = data.frequency ?? 220;
      const detune = data.detune ?? 12;
      const blend = Math.max(0, Math.min(1, data.blend ?? 0.5));
      const currentTime = getAudioContext().currentTime;

      dualOsc.oscA.frequency.setTargetAtTime(baseFrequency, currentTime, 0.03);
      dualOsc.oscB.frequency.setTargetAtTime(baseFrequency * Math.pow(2, detune / 1200), currentTime, 0.03);
      dualOsc.oscA.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      dualOsc.oscB.type = data.modType ?? 'square';
      dualOsc.mixA.gain.setTargetAtTime(1 - blend, currentTime, 0.03);
      dualOsc.mixB.gain.setTargetAtTime(blend, currentTime, 0.03);
      dualOsc.output.gain.setTargetAtTime(data.gain ?? 0.35, currentTime, 0.03);
      break;
    }
    case 'gain':
      updateIfDefined(id, 'gain', data.gain);
      break;
    case 'filter':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      updateIfDefined(id, 'Q', data.Q);
      break;
    case 'delay': {
      const syncedDelayTime = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : data.delayTime;
      updateIfDefined(id, 'delayTime', syncedDelayTime);
      break;
    }
    case 'distortion':
      updateIfDefined(id, 'distortion', data.distortion);
      break;
    case 'reverb':
      updateIfDefined(id, 'decay', data.decay);
      break;
    case 'compressor': {
      const compressor = compressors.get(id);
      if (!compressor) {
        break;
      }

      const currentTime = getAudioContext().currentTime;
      compressor.compressor.threshold.setTargetAtTime(data.threshold ?? -24, currentTime, 0.03);
      compressor.compressor.knee.setTargetAtTime(data.knee ?? 18, currentTime, 0.03);
      compressor.compressor.ratio.setTargetAtTime(data.ratio ?? 6, currentTime, 0.03);
      compressor.compressor.attack.setTargetAtTime(data.attack ?? 0.01, currentTime, 0.03);
      compressor.compressor.release.setTargetAtTime(data.release ?? 0.25, currentTime, 0.03);
      compressor.makeup.gain.setTargetAtTime(data.makeup ?? 1, currentTime, 0.03);
      break;
    }
    case 'chorus': {
      const chorus = choruses.get(id);
      if (!chorus) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.8);
      const depth = data.depth ?? 0.012;
      const delay = data.delay ?? 0.02;
      const mix = data.mix ?? 0.45;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      chorus.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      chorus.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      chorus.delay.delayTime.setTargetAtTime(delay, currentTime, 0.03);
      chorus.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      chorus.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'panner':
      updateIfDefined(id, 'pan', data.pan);
      break;
    case 'lfo': {
      const syncedFrequency = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : data.frequency;
      updateIfDefined(id, 'frequency', syncedFrequency);
      updateIfDefined(id, 'type', data.type);
      updateIfDefined(`${id}_gain`, 'gain', data.gain);
      break;
    }
    case 'mixer':
      updateIfDefined(`${id}_ch1`, 'gain', data.ch1);
      updateIfDefined(`${id}_ch2`, 'gain', data.ch2);
      updateIfDefined(`${id}_ch3`, 'gain', data.ch3);
      updateIfDefined(`${id}_ch4`, 'gain', data.ch4);
      break;
    case 'drumMachine': {
      const drumMachine = drumMachines.get(id);
      if (!drumMachine) {
        break;
      }

      drumMachine.pattern = cloneDrumPattern(data.drumPattern);
      if (data.bpm !== undefined) {
        setTransportBpm(data.bpm);
      }
      break;
    }
    case 'arpeggiator': {
      const arpeggiator = arpeggiators.get(id);
      if (!arpeggiator) {
        break;
      }

      arpeggiator.syncDivision = data.syncDivision ?? '1/8';
      arpeggiator.steps = cloneArpSteps(data.arpSteps);
      arpeggiator.mode = data.arpMode ?? 'up';
      arpeggiator.scale = data.arpScale ?? 'chromatic';
      arpeggiator.stepIndex = 0;
      break;
    }
    case 'equalizer8': {
      const equalizer = equalizers.get(id);
      if (!equalizer) {
        break;
      }

      const bands = data.eqBands ?? [];
      equalizer.filters.forEach((filter, index) => {
        const gain = bands[index] ?? 0;
        filter.gain.setTargetAtTime(gain, getAudioContext().currentTime, 0.03);
      });
      break;
    }
    case 'phaser': {
      const phaser = phasers.get(id);
      if (!phaser) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.6);
      const depth = data.depth ?? 800;
      const feedback = data.feedback ?? 0.35;
      const mix = data.mix ?? 0.5;
      const dryMix = 1 - mix;

      phaser.lfo.frequency.setTargetAtTime(rate, getAudioContext().currentTime, 0.03);
      phaser.lfoGain.gain.setTargetAtTime(depth, getAudioContext().currentTime, 0.03);
      phaser.feedbackGain.gain.setTargetAtTime(feedback, getAudioContext().currentTime, 0.03);
      phaser.dry.gain.setTargetAtTime(dryMix, getAudioContext().currentTime, 0.03);
      phaser.wet.gain.setTargetAtTime(mix, getAudioContext().currentTime, 0.03);
      break;
    }
    case 'bitcrusher': {
      const bitcrusher = bitcrushers.get(id);
      if (!bitcrusher) {
        break;
      }

      const bits = data.bits ?? 6;
      const normFreq = data.normFreq ?? 0.2;
      const mix = data.mix ?? 0.7;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      bitcrusher.params.bits = bits;
      bitcrusher.params.normFreq = normFreq;
      bitcrusher.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      bitcrusher.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'flanger': {
      const flanger = flangers.get(id);
      if (!flanger) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.25);
      const depth = data.depth ?? 0.003;
      const feedback = data.feedback ?? 0.55;
      const mix = data.mix ?? 0.5;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      flanger.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      flanger.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      flanger.feedbackGain.gain.setTargetAtTime(feedback, currentTime, 0.03);
      flanger.delay.delayTime.setTargetAtTime(Math.max(0.0005, depth), currentTime, 0.03);
      flanger.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      flanger.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'limiter': {
      const limiter = limiters.get(id);
      if (!limiter) {
        break;
      }

      const currentTime = getAudioContext().currentTime;
      limiter.compressor.threshold.setTargetAtTime(data.threshold ?? -6, currentTime, 0.03);
      limiter.compressor.release.setTargetAtTime(data.release ?? 0.08, currentTime, 0.03);
      limiter.makeup.gain.setTargetAtTime(data.makeup ?? 1, currentTime, 0.03);
      break;
    }
    case 'looper': {
      const looper = loopers.get(id);
      if (!looper) {
        break;
      }

      const loopLength = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.loopLength ?? 0.5);
      const feedback = data.feedback ?? 0.2;
      const mix = data.mix ?? 0.8;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      looper.params.lengthSamples = Math.max(1, Math.floor(getAudioContext().sampleRate * loopLength));
      looper.params.feedback = feedback;
      looper.params.mix = mix;
      looper.params.freeze = data.freeze ?? false;
      looper.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      looper.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'tremolo': {
      const tremolo = tremolos.get(id);
      if (!tremolo) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.rate ?? 4);
      const depth = Math.max(0, Math.min(1, data.depth ?? 0.75));
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      tremolo.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      tremolo.lfoDepth.gain.setTargetAtTime(depth * 0.5, currentTime, 0.03);
      tremolo.lfoOffset.offset.setTargetAtTime(1 - depth * 0.5, currentTime, 0.03);
      tremolo.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      break;
    }
    case 'ringMod': {
      const ringMod = ringMods.get(id);
      if (!ringMod) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.modFrequency ?? 60);
      const depth = Math.max(0, Math.min(1, data.depth ?? 1));
      const mix = data.mix ?? 0.8;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      ringMod.modulator.frequency.setTargetAtTime(rate, currentTime, 0.03);
      ringMod.modDepth.gain.setTargetAtTime(depth * 0.5 * mix, currentTime, 0.03);
      ringMod.modOffset.offset.setTargetAtTime(depth * 0.5 * mix, currentTime, 0.03);
      ringMod.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      break;
    }
    case 'vibrato': {
      const vibrato = vibratos.get(id);
      if (!vibrato) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.rate ?? 5);
      const depth = data.depth ?? 0.004;
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      vibrato.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      vibrato.lfoDepth.gain.setTargetAtTime(depth, currentTime, 0.03);
      vibrato.delay.delayTime.setTargetAtTime(Math.max(0.002, depth * 2), currentTime, 0.03);
      vibrato.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      vibrato.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'combFilter': {
      const combFilter = combFilters.get(id);
      if (!combFilter) {
        break;
      }

      const delay = data.delay ?? 0.015;
      const feedback = data.feedback ?? 0.65;
      const mix = data.mix ?? 0.7;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      combFilter.delay.delayTime.setTargetAtTime(delay, currentTime, 0.03);
      combFilter.feedbackGain.gain.setTargetAtTime(feedback, currentTime, 0.03);
      combFilter.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      combFilter.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'autoPan': {
      const autoPan = autoPans.get(id);
      if (!autoPan) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.5);
      const depth = Math.max(0, Math.min(1, data.depth ?? 1));
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      autoPan.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      autoPan.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      autoPan.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      autoPan.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'autoFilter': {
      const autoFilter = autoFilters.get(id);
      if (!autoFilter) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.rate ?? 0.8);
      const base = data.tone ?? 800;
      const depth = data.depth ?? 2200;
      const q = data.Q ?? 1.2;
      const mix = data.mix ?? 0.85;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      autoFilter.filter.type = (data.type as BiquadFilterType | undefined) ?? 'lowpass';
      autoFilter.filter.frequency.setTargetAtTime(base, currentTime, 0.03);
      autoFilter.filter.Q.setTargetAtTime(q, currentTime, 0.03);
      autoFilter.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      autoFilter.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      autoFilter.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      autoFilter.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'clockDivider': {
      const clockDivider = clockDividers.get(id);
      if (!clockDivider) {
        break;
      }

      clockDivider.syncDivision = data.syncDivision ?? '1/4';
      break;
    }
    case 'randomCv': {
      const randomCv = randomCvs.get(id);
      if (!randomCv) {
        break;
      }

      randomCv.syncDivision = data.syncDivision ?? '1/8';
      randomCv.minValue = data.minValue ?? -300;
      randomCv.maxValue = data.maxValue ?? 300;
      break;
    }
    case 'sampleHold': {
      const sampleHold = sampleHolds.get(id);
      if (!sampleHold) {
        break;
      }

      const holdSeconds = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/16', transportState.bpm)
        : 1 / Math.max(0.1, data.rate ?? 8);
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      sampleHold.params.holdSamples = Math.max(1, Math.floor(getAudioContext().sampleRate * holdSeconds));
      sampleHold.params.mix = mix;
      sampleHold.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      sampleHold.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'gateSeq': {
      const gateSeq = gateSeqs.get(id);
      if (!gateSeq) {
        break;
      }

      gateSeq.steps = cloneStepPattern(data.steps, Array.from({ length: 16 }, (_, index) => index % 2 === 0));
      gateSeq.syncDivision = data.syncDivision ?? '1/16';
      break;
    }
    case 'resonator': {
      const resonator = resonators.get(id);
      if (!resonator) {
        break;
      }

      const tone = data.tone ?? 440;
      const q = data.Q ?? 12;
      const spread = data.spread ?? 7;
      const mix = data.mix ?? 0.7;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;
      const frequencies = [
        tone / Math.pow(2, spread / 12),
        tone,
        tone * Math.pow(2, spread / 12),
      ];

      resonator.filters.forEach((filter, index) => {
        filter.frequency.setTargetAtTime(
          Math.max(40, Math.min(18000, frequencies[index] ?? tone)),
          currentTime,
          0.03,
        );
        filter.Q.setTargetAtTime(q, currentTime, 0.03);
      });
      resonator.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      resonator.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'wah': {
      const wah = wahs.get(id);
      if (!wah) {
        break;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.rate ?? 1.5);
      const base = data.tone ?? 700;
      const depth = data.depth ?? 900;
      const q = data.Q ?? 8;
      const mix = data.mix ?? 0.75;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      wah.filter.frequency.setTargetAtTime(base, currentTime, 0.03);
      wah.filter.Q.setTargetAtTime(q, currentTime, 0.03);
      wah.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      wah.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      wah.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      wah.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'stereoWidener': {
      const stereoWidener = stereoWideners.get(id);
      if (!stereoWidener) {
        break;
      }

      const delay = Math.max(0.001, Math.min(0.03, data.delay ?? 0.012));
      const spread = Math.max(0, Math.min(2, data.spread ?? 1));
      const mix = data.mix ?? 0.65;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      stereoWidener.delayLeft.delayTime.setTargetAtTime(delay, currentTime, 0.03);
      stereoWidener.delayRight.delayTime.setTargetAtTime(
        Math.max(0.001, Math.min(0.05, delay * (1 + spread * 0.5))),
        currentTime,
        0.03,
      );
      stereoWidener.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      stereoWidener.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'foldback': {
      const foldback = foldbacks.get(id);
      if (!foldback) {
        break;
      }

      const drive = data.drive ?? 2.2;
      const threshold = data.threshold ?? 0.55;
      const mix = data.mix ?? 0.75;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      foldback.shaper.curve = buildFoldbackCurve(drive, threshold);
      foldback.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      foldback.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'tiltEq': {
      const tiltEq = tiltEqs.get(id);
      if (!tiltEq) {
        break;
      }

      const pivot = data.tone ?? 900;
      const tilt = Math.max(-18, Math.min(18, data.tilt ?? 0));
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      tiltEq.lowShelf.frequency.setTargetAtTime(pivot, currentTime, 0.03);
      tiltEq.highShelf.frequency.setTargetAtTime(pivot, currentTime, 0.03);
      tiltEq.lowShelf.gain.setTargetAtTime(-tilt, currentTime, 0.03);
      tiltEq.highShelf.gain.setTargetAtTime(tilt, currentTime, 0.03);
      tiltEq.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      tiltEq.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'saturator': {
      const saturator = saturators.get(id);
      if (!saturator) {
        break;
      }

      const drive = data.drive ?? 2.4;
      const makeup = data.makeup ?? 1;
      const mix = data.mix ?? 0.8;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      saturator.shaper.curve = buildSaturatorCurve(drive);
      saturator.makeup.gain.setTargetAtTime(makeup, currentTime, 0.03);
      saturator.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      saturator.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'cabSim': {
      const cabSim = cabSims.get(id);
      if (!cabSim) {
        break;
      }

      const tone = data.tone ?? 2600;
      const q = data.Q ?? 0.8;
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      cabSim.peak.Q.setTargetAtTime(q, currentTime, 0.03);
      cabSim.peak.frequency.setTargetAtTime(Math.max(900, tone * 0.7), currentTime, 0.03);
      cabSim.lowpass.frequency.setTargetAtTime(tone, currentTime, 0.03);
      cabSim.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      cabSim.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'transientShaper': {
      const transientShaper = transientShapers.get(id);
      if (!transientShaper) {
        break;
      }

      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      transientShaper.params.attack = data.attack ?? 0.7;
      transientShaper.params.sustain = data.sustain ?? 0;
      transientShaper.params.mix = mix;
      transientShaper.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      transientShaper.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'freezeFx': {
      const freezeFx = freezeFxs.get(id);
      if (!freezeFx) {
        break;
      }

      const freezeLength = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.loopLength ?? 0.35);
      const mix = data.mix ?? 0.9;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      freezeFx.params.lengthSamples = Math.max(1, Math.floor(getAudioContext().sampleRate * freezeLength));
      freezeFx.params.mix = mix;
      freezeFx.params.freeze = data.freeze ?? false;
      freezeFx.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      freezeFx.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'granular': {
      const granular = granulars.get(id);
      if (!granular) {
        break;
      }

      const grainLength = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.grainSize ?? 0.12);
      const mix = data.mix ?? 0.8;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      granular.params.grainSamples = Math.max(1, Math.floor(getAudioContext().sampleRate * grainLength));
      granular.params.spray = data.spray ?? 0.35;
      granular.params.mix = mix;
      granular.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      granular.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      break;
    }
    case 'monoSynth': {
      const monoSynth = monoSynths.get(id);
      if (!monoSynth) {
        break;
      }

      const currentTime = getAudioContext().currentTime;
      monoSynth.oscillator.frequency.setTargetAtTime(data.frequency ?? 220, currentTime, 0.03);
      monoSynth.oscillator.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      monoSynth.filter.type = 'lowpass';
      monoSynth.filter.frequency.setTargetAtTime(data.tone ?? 1800, currentTime, 0.03);
      monoSynth.filter.Q.setTargetAtTime(data.Q ?? 0.8, currentTime, 0.03);
      monoSynth.output.gain.setTargetAtTime(data.gain ?? 0.35, currentTime, 0.03);
      break;
    }
    case 'kickSynth': {
      const synth = kickSynths.get(id);
      if (!synth) {
        break;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_KICK_STEPS);
      synth.tone = data.tone ?? 58;
      synth.decay = data.decay ?? 0.24;
      synth.gain = data.gain ?? 0.9;
      break;
    }
    case 'snareSynth': {
      const synth = snareSynths.get(id);
      if (!synth) {
        break;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_SNARE_STEPS);
      synth.tone = data.tone ?? 180;
      synth.decay = data.decay ?? 0.16;
      synth.gain = data.gain ?? 0.65;
      break;
    }
    case 'hiHatSynth': {
      const synth = hiHatSynths.get(id);
      if (!synth) {
        break;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_HIHAT_STEPS);
      synth.tone = data.tone ?? 9500;
      synth.decay = data.decay ?? 0.06;
      synth.gain = data.gain ?? 0.4;
      break;
    }
    case 'chordGenerator': {
      const chordGenerator = chordGenerators.get(id);
      if (!chordGenerator) {
        break;
      }

      const root = noteToFrequency(data.note ?? 'C', data.octave ?? 4);
      const intervals = CHORD_INTERVALS[data.chordType ?? 'major'];
      const spread = data.spread ?? 10;
      const gain = (data.gain ?? 0.22) / chordGenerator.oscillators.length;
      const waveType = (data.type as OscillatorType | undefined) ?? 'triangle';

      chordGenerator.oscillators.forEach((oscillator, index) => {
        const semitones = intervals[index] ?? 0;
        const frequency = root * Math.pow(2, semitones / 12);
        oscillator.frequency.setTargetAtTime(frequency, getAudioContext().currentTime, 0.03);
        oscillator.detune.setTargetAtTime((index - 1) * spread, getAudioContext().currentTime, 0.03);
        oscillator.type = waveType;
      });
      chordGenerator.output.gain.setTargetAtTime(gain * chordGenerator.oscillators.length, getAudioContext().currentTime, 0.03);
      break;
    }
    case 'fmSynth': {
      const fmSynth = fmSynths.get(id);
      if (!fmSynth) {
        break;
      }

      const currentTime = getAudioContext().currentTime;
      fmSynth.carrier.frequency.setTargetAtTime(data.frequency ?? 220, currentTime, 0.03);
      fmSynth.modulator.frequency.setTargetAtTime(data.modFrequency ?? 220, currentTime, 0.03);
      fmSynth.modGain.gain.setTargetAtTime(data.modAmount ?? 180, currentTime, 0.03);
      fmSynth.output.gain.setTargetAtTime(data.gain ?? 0.35, currentTime, 0.03);
      fmSynth.carrier.type = (data.type as OscillatorType | undefined) ?? 'sine';
      fmSynth.modulator.type = data.modType ?? 'sine';
      break;
    }
    case 'subOsc': {
      const subOsc = subOscs.get(id);
      if (!subOsc) {
        break;
      }

      const baseFrequency = data.frequency ?? 110;
      const divisor = Math.pow(2, data.subOctave ?? 1);
      const currentTime = getAudioContext().currentTime;
      subOsc.oscillator.frequency.setTargetAtTime(baseFrequency / divisor, currentTime, 0.03);
      subOsc.output.gain.setTargetAtTime(data.gain ?? 0.4, currentTime, 0.03);
      subOsc.oscillator.type = (data.type as OscillatorType | undefined) ?? 'square';
      break;
    }
    case 'noiseLayer': {
      const noiseLayer = noiseLayers.get(id);
      if (!noiseLayer) {
        break;
      }

      const currentTime = getAudioContext().currentTime;
      noiseLayer.filter.type = (data.type as BiquadFilterType | undefined) ?? 'lowpass';
      noiseLayer.filter.frequency.setTargetAtTime(data.tone ?? 2800, currentTime, 0.03);
      noiseLayer.filter.Q.setTargetAtTime(data.Q ?? 0.8, currentTime, 0.03);
      noiseLayer.output.gain.setTargetAtTime(data.gain ?? 0.18, currentTime, 0.03);
      break;
    }
    case 'noise':
    case 'scope':
    case 'vuMeter':
    case 'phaseCorrelator':
    case 'lissajous':
    case 'tuner':
    case 'spectrogram':
      break;
  }
};

export const getAnalyser = (id: string) => {
  return analysers.get(id);
};

export const getStereoAnalysers = (id: string) => {
  return stereoAnalysers.get(id);
};

export const getDestination = () => {
  return getAudioContext().destination;
};

export const connectNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  const sourceConfig = nodeConfigs.get(sourceId);
  const targetConfig = nodeConfigs.get(targetId);

  if (
    sourceConfig?.type === 'arpeggiator' &&
    targetHandleId === 'pitch' &&
    (targetConfig?.type === 'oscillator' ||
      targetConfig?.type === 'dualOsc' ||
      targetConfig?.type === 'monoSynth' ||
      targetConfig?.type === 'fmSynth' ||
      targetConfig?.type === 'subOsc')
  ) {
    let targets = arpeggiatorTargets.get(sourceId);
    if (!targets) {
      targets = new Set<string>();
      arpeggiatorTargets.set(sourceId, targets);
    }
    targets.add(targetId);
    return;
  }

  const source = resolveSource(sourceId);
  const target = resolveTarget(targetId, targetHandleId);

  if (!source || !target) {
    return;
  }

  try {
    if (target instanceof AudioParam) {
      source.connect(target);
    } else {
      source.connect(target);
    }
  } catch {
    // Ignore invalid connections between unsupported node types.
  }
};

export const disconnectNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  const sourceConfig = nodeConfigs.get(sourceId);
  const targetConfig = nodeConfigs.get(targetId);

  if (
    sourceConfig?.type === 'arpeggiator' &&
    targetHandleId === 'pitch' &&
    (targetConfig?.type === 'oscillator' ||
      targetConfig?.type === 'dualOsc' ||
      targetConfig?.type === 'monoSynth' ||
      targetConfig?.type === 'fmSynth' ||
      targetConfig?.type === 'subOsc')
  ) {
    arpeggiatorTargets.get(sourceId)?.delete(targetId);
    return;
  }

  const source = resolveSource(sourceId);
  const target = resolveTarget(targetId, targetHandleId);

  if (!source || !target) {
    return;
  }

  try {
    if (target instanceof AudioParam) {
      source.disconnect(target);
    } else {
      source.disconnect(target);
    }
  } catch {
    // Ignore disconnects for links that no longer exist.
  }
};

export const updateNodeParam = (
  id: string,
  param: AudioParamName,
  value: AudioParamValue,
) => {
  const node = nodes.get(id);
  if (!node) {
    return;
  }

  const ctx = getAudioContext();

  const dualOsc = dualOscs.get(id);
  if (dualOsc) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      const detune = nodeConfigs.get(id)?.data.detune ?? 12;
      dualOsc.oscA.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
      dualOsc.oscB.frequency.setTargetAtTime(value * Math.pow(2, detune / 1200), ctx.currentTime, 0.03);
    } else if (param === 'type') {
      dualOsc.oscA.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      dualOsc.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  const fmSynth = fmSynths.get(id);
  if (fmSynth) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      fmSynth.carrier.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      fmSynth.carrier.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      fmSynth.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  const subOsc = subOscs.get(id);
  if (subOsc) {
    const subData = nodeConfigs.get(id)?.data;
    const divisor = Math.pow(2, subData?.subOctave ?? 1);
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      subOsc.oscillator.frequency.setTargetAtTime(value / divisor, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      subOsc.oscillator.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      subOsc.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  const monoSynth = monoSynths.get(id);
  if (monoSynth) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      monoSynth.oscillator.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      monoSynth.oscillator.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      monoSynth.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  if (node instanceof OscillatorNode) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      node.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      node.type = value as OscillatorType;
    }
    return;
  }

  if (node instanceof GainNode) {
    if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      node.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  if (node instanceof BiquadFilterNode) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      node.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      node.type = value as BiquadFilterType;
    } else if (param === 'Q' && typeof value === 'number' && Number.isFinite(value)) {
      node.Q.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  if (node instanceof DelayNode) {
    if (param === 'delayTime' && typeof value === 'number' && Number.isFinite(value)) {
      node.delayTime.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  if (node instanceof WaveShaperNode) {
    if (param === 'distortion' && typeof value === 'number' && Number.isFinite(value)) {
      node.curve = buildDistortionCurve(value);
    }
    return;
  }

  if (node instanceof ConvolverNode) {
    if (param === 'decay' && typeof value === 'number' && Number.isFinite(value)) {
      node.buffer = buildImpulseResponse(ctx, 2, value);
    }
    return;
  }

  if (node instanceof StereoPannerNode) {
    if (param === 'pan' && typeof value === 'number' && Number.isFinite(value)) {
      node.pan.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
  }
};

export const stopAudio = async () => {
  clearTransportTimer();
  transportState.isPlaying = false;
  transportState.step = 0;
  emitTransportState();
  dispatchTransportEvent('transport-stop', {
    bpm: transportState.bpm,
    step: 0,
  });

  const ids = Array.from(nodes.keys());
  ids.forEach(destroyNodeById);
  analysers.clear();
  drumMachines.clear();
  arpeggiators.clear();
  arpeggiatorTargets.clear();
  equalizers.clear();
  phasers.clear();
  compressors.clear();
  choruses.clear();
  bitcrushers.clear();
  flangers.clear();
  limiters.clear();
  loopers.clear();
  fmSynths.clear();
  subOscs.clear();
  noiseLayers.clear();
  tremolos.clear();
  ringMods.clear();
  vibratos.clear();
  combFilters.clear();
  dualOscs.clear();
  autoPans.clear();
  autoFilters.clear();
  clockDividers.clear();
  randomCvs.clear();
  sampleHolds.clear();
  gateSeqs.clear();
  resonators.clear();
  wahs.clear();
  stereoWideners.clear();
  foldbacks.clear();
  tiltEqs.clear();
  saturators.clear();
  cabSims.clear();
  transientShapers.clear();
  freezeFxs.clear();
  granulars.clear();
  monoSynths.clear();
  kickSynths.clear();
  snareSynths.clear();
  hiHatSynths.clear();
  chordGenerators.clear();
  stereoAnalysers.clear();
  nodeConfigs.clear();
  noiseBufferCache = null;

  const ctx = audioContext;
  audioContext = null;

  if (ctx) {
    await ctx.close();
  }
};

export const removeNode = (id: string) => {
  destroyNodeById(id);
  destroyNodeById(`${id}_gain`);

  for (let channel = 1; channel <= 4; channel += 1) {
    destroyNodeById(`${id}_ch${channel}`);
  }
};
