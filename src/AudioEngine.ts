import type { DrumPattern, EditableAudioNodeType, SoundNodeData } from './types';

let audioContext: AudioContext | null = null;

const nodes = new Map<string, AudioNode>();
const analysers = new Map<string, AnalyserNode>();
const drumMachines = new Map<string, DrumMachineState>();
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
  step: number;
  bpm: number;
  pattern: DrumPattern;
  timerId: number | null;
}

const defaultDrumPattern = (): DrumPattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
});

const cloneDrumPattern = (pattern?: DrumPattern): DrumPattern => {
  const base = pattern ?? defaultDrumPattern();

  return {
    kick: Array.from({ length: 16 }, (_, index) => base.kick[index] ?? false),
    snare: Array.from({ length: 16 }, (_, index) => base.snare[index] ?? false),
    hihat: Array.from({ length: 16 }, (_, index) => base.hihat[index] ?? false),
  };
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

const triggerKick = (ctx: AudioContext, destination: AudioNode) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.18);

  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

  osc.connect(gain);
  gain.connect(destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
};

const triggerSnare = (ctx: AudioContext, destination: AudioNode) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1800, ctx.currentTime);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.8, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  const tone = ctx.createOscillator();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(180, ctx.currentTime);

  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(0.5, ctx.currentTime);
  toneGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);

  tone.connect(toneGain);
  toneGain.connect(destination);

  noise.start();
  noise.stop(ctx.currentTime + 0.2);
  tone.start();
  tone.stop(ctx.currentTime + 0.12);
};

const triggerHiHat = (ctx: AudioContext, destination: AudioNode) => {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(10000, ctx.currentTime);
  bandpass.Q.setValueAtTime(0.8, ctx.currentTime);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(7000, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  noise.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(destination);

  noise.start();
  noise.stop(ctx.currentTime + 0.06);
};

const clearDrumMachineTimer = (state: DrumMachineState) => {
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
};

const tickDrumMachine = (state: DrumMachineState) => {
  const ctx = audioContext;
  if (!ctx || ctx.state !== 'running') {
    return;
  }

  const step = state.step % 16;
  window.dispatchEvent(
    new CustomEvent('drum-machine-step', {
      detail: {
        id: state.id,
        step,
      },
    }),
  );

  if (state.pattern.kick[step]) {
    triggerKick(ctx, state.output);
  }

  if (state.pattern.snare[step]) {
    triggerSnare(ctx, state.output);
  }

  if (state.pattern.hihat[step]) {
    triggerHiHat(ctx, state.output);
  }

  state.step = (step + 1) % 16;
};

const startDrumMachineLoop = (state: DrumMachineState) => {
  clearDrumMachineTimer(state);
  const intervalMs = ((60 / state.bpm) / 4) * 1000;
  state.timerId = window.setInterval(() => tickDrumMachine(state), intervalMs);
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

const destroyNodeById = (id: string) => {
  const drumMachine = drumMachines.get(id);
  if (drumMachine) {
    clearDrumMachineTimer(drumMachine);
    drumMachines.delete(id);
  }

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

const buildDistortionCurve = (amount: number) => {
  const k = amount;
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount);
  const deg = Math.PI / 180;

  for (let i = 0; i < sampleCount; i += 1) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }

  return curve;
};

const buildImpulseResponse = (
  ctx: AudioContext,
  duration: number,
  decay: number,
) => {
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
  return nodes.get(`${sourceId}_gain`) ?? nodes.get(sourceId);
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

  const state: DrumMachineState = {
    id,
    output,
    step: 0,
    bpm: 120,
    pattern: defaultDrumPattern(),
    timerId: null,
  };

  drumMachines.set(id, state);
  startDrumMachineLoop(state);
  return output;
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
    case 'scope':
    case 'spectrogram':
      createAnalyser(id);
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
  }

  applyAudioNodeData(type, id, data);
};

export const applyAudioNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
) => {
  switch (type) {
    case 'oscillator':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      break;
    case 'gain':
      updateIfDefined(id, 'gain', data.gain);
      break;
    case 'filter':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      updateIfDefined(id, 'Q', data.Q);
      break;
    case 'delay':
      updateIfDefined(id, 'delayTime', data.delayTime);
      break;
    case 'distortion':
      updateIfDefined(id, 'distortion', data.distortion);
      break;
    case 'reverb':
      updateIfDefined(id, 'decay', data.decay);
      break;
    case 'panner':
      updateIfDefined(id, 'pan', data.pan);
      break;
    case 'lfo':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      updateIfDefined(`${id}_gain`, 'gain', data.gain);
      break;
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

      drumMachine.bpm = data.bpm ?? 120;
      drumMachine.pattern = cloneDrumPattern(data.drumPattern);
      drumMachine.step = drumMachine.step % 16;
      startDrumMachineLoop(drumMachine);
      break;
    }
    case 'noise':
    case 'scope':
    case 'spectrogram':
      break;
  }
};

export const getAnalyser = (id: string) => {
  return analysers.get(id);
};

export const getDestination = () => {
  return getAudioContext().destination;
};

export const connectNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
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
  drumMachines.forEach((state) => clearDrumMachineTimer(state));
  const ids = Array.from(nodes.keys());
  ids.forEach(destroyNodeById);
  analysers.clear();
  drumMachines.clear();
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
