import type {
  EditableAudioNodeType,
  SoundNodeData,
} from './types';

import { applyBasicNodeData } from './audio-engine/apply-node-data-basic';
import { applyFxNodeData } from './audio-engine/apply-node-data-fx';
import { applyMusicalNodeData } from './audio-engine/apply-node-data-musical';
import {
  removeNodeArtifacts,
  resetAudioEngineRuntime,
} from './audio-engine/cleanup';
import { createFxAudioNode } from './audio-engine/create-node-fx';
import { createMusicalAudioNode } from './audio-engine/create-node-musical';
import {
  connectAudioGraphNodes,
  disconnectAudioGraphNodes,
} from './audio-engine/routing';
import {
  clearTransportTimer,
  getTransportStateSnapshot,
  setTransportEngineBpm,
  setTransportEngineSwing,
  startTransportEngine,
} from './audio-engine/transport';
import { updateAudioNodeParam } from './audio-engine/update-node-param';
import {
  type RecordingChannelMode,
  type RecordingExportOptions,
  getRecordingStateSnapshot,
  startRecordingSession,
  stopRecordingSession,
} from './audio-engine/recording';
import {
  nodes,
  analysers,
  mixers,
  reverbs,
  stereoAnalysers,
  nodeConfigs,
  transportState,
  dispatchTransportEvent,
  emitTransportState,
  getDestinationAnalyser,
  getDestinationInput,
  getNoiseBuffer,
  buildDistortionCurve,
  buildImpulseResponse,
  createGateStage,
  ensureMixerGateWorklet,
  getAudioContext,
} from './audio-engine/runtime';
export { getAudioContext, getAudioContextState } from './audio-engine/runtime';

export const getTransportState = getTransportStateSnapshot;
export const getRecordingState = getRecordingStateSnapshot;
export type { RecordingChannelMode, RecordingExportOptions };

export const prepareAudioEngine = async () => {
  await ensureMixerGateWorklet();
};

export const startTransport = () => {
  startTransportEngine({
    applyAudioNodeData,
    updateNodeParam,
  });
};

export const setTransportBpm = (bpm: number) => {
  setTransportEngineBpm(bpm, {
    applyAudioNodeData,
    updateNodeParam,
  });
};

export const setTransportSwing = (swing: number) => {
  setTransportEngineSwing(swing, {
    applyAudioNodeData,
    updateNodeParam,
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
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const preDelay = ctx.createDelay(0.4);
  const tone = ctx.createBiquadFilter();
  const convolver = ctx.createConvolver();

  dry.gain.setValueAtTime(0.45, ctx.currentTime);
  wet.gain.setValueAtTime(0.55, ctx.currentTime);
  preDelay.delayTime.setValueAtTime(0.02, ctx.currentTime);
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(4800, ctx.currentTime);
  tone.Q.setValueAtTime(0.2, ctx.currentTime);
  convolver.buffer = buildImpulseResponse(ctx, 2.8, 3);

  input.connect(dry);
  dry.connect(output);
  input.connect(preDelay);
  preDelay.connect(tone);
  tone.connect(convolver);
  convolver.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  reverbs.set(id, {
    input,
    output,
    dry,
    wet,
    preDelay,
    tone,
    convolver,
  });
  return input;
};

export const createMixer = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  const roomSendBus = ctx.createGain();
  const roomPreDelay = ctx.createDelay(0.25);
  const roomTone = ctx.createBiquadFilter();
  const roomConvolver = ctx.createConvolver();
  const roomReturn = ctx.createGain();
  const delaySendBus = ctx.createGain();
  const delayNode = ctx.createDelay(1.2);
  const delayTone = ctx.createBiquadFilter();
  const delayFeedback = ctx.createGain();
  const delayReturn = ctx.createGain();

  output.gain.setValueAtTime(1, ctx.currentTime);
  roomPreDelay.delayTime.setValueAtTime(0.02, ctx.currentTime);
  roomTone.type = 'lowpass';
  roomTone.frequency.setValueAtTime(4800, ctx.currentTime);
  roomConvolver.buffer = buildImpulseResponse(ctx, 3.8, 2.8);
  roomReturn.gain.setValueAtTime(0.24, ctx.currentTime);
  delayNode.delayTime.setValueAtTime(0.28, ctx.currentTime);
  delayTone.type = 'lowpass';
  delayTone.frequency.setValueAtTime(4200, ctx.currentTime);
  delayFeedback.gain.setValueAtTime(0.36, ctx.currentTime);
  delayReturn.gain.setValueAtTime(0.22, ctx.currentTime);

  roomSendBus.connect(roomPreDelay);
  roomPreDelay.connect(roomTone);
  roomTone.connect(roomConvolver);
  roomConvolver.connect(roomReturn);
  roomReturn.connect(output);

  delaySendBus.connect(delayNode);
  delayNode.connect(delayTone);
  delayTone.connect(delayReturn);
  delayReturn.connect(output);
  delayTone.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  nodes.set(id, output);

  const channels = Array.from({ length: 8 }, (_, index) => {
    const channelNumber = index + 1;
    const input = ctx.createGain();
    const low = ctx.createBiquadFilter();
    const mid = ctx.createBiquadFilter();
    const high = ctx.createBiquadFilter();
    const { gateNode, gateThreshold } = createGateStage(ctx);
    const compressor = ctx.createDynamicsCompressor();
    const pan = ctx.createStereoPanner();
    const gain = ctx.createGain();
    const roomSend = ctx.createGain();
    const delaySend = ctx.createGain();
    const gateParams = {
      threshold: 0,
    };

    low.type = 'lowshelf';
    low.frequency.setValueAtTime(120, ctx.currentTime);
    low.gain.setValueAtTime(0, ctx.currentTime);

    mid.type = 'peaking';
    mid.frequency.setValueAtTime(1100, ctx.currentTime);
    mid.Q.setValueAtTime(0.9, ctx.currentTime);
    mid.gain.setValueAtTime(0, ctx.currentTime);

    high.type = 'highshelf';
    high.frequency.setValueAtTime(4200, ctx.currentTime);
    high.gain.setValueAtTime(0, ctx.currentTime);

    compressor.threshold.setValueAtTime(-10, ctx.currentTime);
    compressor.knee.setValueAtTime(18, ctx.currentTime);
    compressor.ratio.setValueAtTime(3, ctx.currentTime);
    compressor.attack.setValueAtTime(0.008, ctx.currentTime);
    compressor.release.setValueAtTime(0.18, ctx.currentTime);

    pan.pan.setValueAtTime(0, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    roomSend.gain.setValueAtTime(0, ctx.currentTime);
    delaySend.gain.setValueAtTime(0, ctx.currentTime);
    gateThreshold?.setValueAtTime(0, ctx.currentTime);

    input.connect(low);
    low.connect(mid);
    mid.connect(high);
    high.connect(gateNode);
    gateNode.connect(compressor);
    compressor.connect(pan);
    pan.connect(gain);
    gain.connect(output);
    gain.connect(roomSend);
    gain.connect(delaySend);
    roomSend.connect(roomSendBus);
    delaySend.connect(delaySendBus);

    nodes.set(`${id}_ch${channelNumber}`, input);

    return {
      input,
      low,
      mid,
      high,
      gateNode,
      gateThreshold,
      gateParams,
      compressor,
      pan,
      gain,
      roomSend,
      delaySend,
    };
  });

  mixers.set(id, {
    output,
    channels,
    roomSendBus,
    roomPreDelay,
    roomTone,
    roomConvolver,
    roomReturn,
    delaySendBus,
    delayNode,
    delayTone,
    delayFeedback,
    delayReturn,
  });

  return output;
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

export const createAudioNode = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData = {},
) => {
  if (createMusicalAudioNode(type, id) || createFxAudioNode(type, id)) {
    applyAudioNodeData(type, id, data, data);
    return;
  }

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
  }

  applyAudioNodeData(type, id, data, data);
};

export const applyAudioNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
  changedData: Partial<SoundNodeData> = data,
) => {
  nodeConfigs.set(id, {
    type,
    data: { ...data },
  });

  if (
    applyMusicalNodeData(type, id, data, {
      setTransportBpm,
      updateNodeParam,
      changedData,
    })
  ) {
    return;
  }

  if (applyFxNodeData(type, id, data)) {
    return;
  }

  applyBasicNodeData(type, id, data, changedData, updateNodeParam);
};

export const getAnalyser = (id: string) => {
  return analysers.get(id);
};

export const getStereoAnalysers = (id: string) => {
  return stereoAnalysers.get(id);
};

export const getDestination = () => {
  return getDestinationInput();
};

export { getDestinationAnalyser, getDestinationInput };

export const connectNodes = connectAudioGraphNodes;

export const disconnectNodes = disconnectAudioGraphNodes;

export const updateNodeParam = updateAudioNodeParam;

export const stopAudio = async () => {
  clearTransportTimer();
  transportState.isPlaying = false;
  transportState.step = 0;
  emitTransportState();
  dispatchTransportEvent('transport-stop', {
    bpm: transportState.bpm,
    step: 0,
  });
  await resetAudioEngineRuntime();
};

export const startRecording = (options: RecordingExportOptions = {}) => {
  return startRecordingSession(options);
};

export const stopRecording = () => {
  return stopRecordingSession();
};

export const removeNode = (id: string) => {
  removeNodeArtifacts(id);
};

