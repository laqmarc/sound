import type { EditableAudioNodeType } from '../types';

import {
  nodes,
  channelStrips,
  equalizers,
  phasers,
  compressors,
  choruses,
  bitcrushers,
  flangers,
  limiters,
  loopers,
  tremolos,
  ringMods,
  vibratos,
  combFilters,
  autoPans,
  autoFilters,
  resonators,
  wahs,
  stereoWideners,
  foldbacks,
  tiltEqs,
  saturators,
  cabSims,
  transientShapers,
  freezeFxs,
  spectralDelays,
  granulars,
  stutters,
  EQ_BAND_CONFIGS,
  PHASER_CENTER_FREQUENCIES,
  buildFoldbackCurve,
  buildSaturatorCurve,
  createGateStage,
  getAudioContext,
} from './runtime';

const createCompressor = (id: string) => {
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

const CHANNEL_STRIP_BAND_CONFIGS: Array<{ type: BiquadFilterType; frequency: number; q: number }> = [
  { type: 'lowshelf', frequency: 90, q: 0.7 },
  { type: 'peaking', frequency: 420, q: 0.9 },
  { type: 'peaking', frequency: 2200, q: 1.1 },
  { type: 'highshelf', frequency: 7600, q: 0.7 },
];

const createChannelStrip = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const highpass = ctx.createBiquadFilter();
  const lowpass = ctx.createBiquadFilter();
  const bands = CHANNEL_STRIP_BAND_CONFIGS.map((band) => {
    const filter = ctx.createBiquadFilter();
    filter.type = band.type;
    filter.frequency.setValueAtTime(band.frequency, ctx.currentTime);
    filter.Q.setValueAtTime(band.q, ctx.currentTime);
    filter.gain.setValueAtTime(0, ctx.currentTime);
    return filter;
  });
  const { gateNode, gateThreshold } = createGateStage(ctx);
  const compressor = ctx.createDynamicsCompressor();
  const makeup = ctx.createGain();

  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(30, ctx.currentTime);
  highpass.Q.setValueAtTime(0.7, ctx.currentTime);

  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(18000, ctx.currentTime);
  lowpass.Q.setValueAtTime(0.7, ctx.currentTime);

  gateThreshold?.setValueAtTime(0, ctx.currentTime);

  compressor.threshold.setValueAtTime(-24, ctx.currentTime);
  compressor.knee.setValueAtTime(18, ctx.currentTime);
  compressor.ratio.setValueAtTime(4, ctx.currentTime);
  compressor.attack.setValueAtTime(0.01, ctx.currentTime);
  compressor.release.setValueAtTime(0.2, ctx.currentTime);
  makeup.gain.setValueAtTime(1, ctx.currentTime);
  output.gain.setValueAtTime(1, ctx.currentTime);

  input.connect(highpass);
  highpass.connect(bands[0]);
  for (let index = 0; index < bands.length - 1; index += 1) {
    bands[index].connect(bands[index + 1]);
  }
  bands[bands.length - 1].connect(lowpass);
  lowpass.connect(gateNode);
  gateNode.connect(compressor);
  compressor.connect(makeup);
  makeup.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  channelStrips.set(id, {
    input,
    output,
    highpass,
    bands,
    lowpass,
    gateNode,
    gateThreshold,
    gateParams: {
      threshold: 0,
    },
    compressor,
    makeup,
  });
};

const createEqualizer8 = (id: string) => {
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

const createChorus = (id: string) => {
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

const createSpectralDelay = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const filterConfigs: Array<{ type: BiquadFilterType; frequency: number; q: number }> = [
    { type: 'lowpass', frequency: 380, q: 0.8 },
    { type: 'bandpass', frequency: 900, q: 1.8 },
    { type: 'bandpass', frequency: 2400, q: 2.4 },
    { type: 'highpass', frequency: 5200, q: 0.7 },
  ];
  const filters = filterConfigs.map((config) => {
    const filter = ctx.createBiquadFilter();
    filter.type = config.type;
    filter.frequency.setValueAtTime(config.frequency, ctx.currentTime);
    filter.Q.setValueAtTime(config.q, ctx.currentTime);
    return filter;
  });
  const delays = filters.map((_, index) => {
    const delay = ctx.createDelay(1.5);
    delay.delayTime.setValueAtTime(0.12 + index * 0.05, ctx.currentTime);
    return delay;
  });
  const feedbackGains = filters.map(() => {
    const feedbackGain = ctx.createGain();
    feedbackGain.gain.setValueAtTime(0.38, ctx.currentTime);
    return feedbackGain;
  });
  const panners = filters.map((_, index) => {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(-0.7 + index * 0.45, ctx.currentTime);
    return panner;
  });
  dry.gain.setValueAtTime(0.28, ctx.currentTime);
  wet.gain.setValueAtTime(0.72, ctx.currentTime);
  input.connect(dry);
  dry.connect(output);
  filters.forEach((filter, index) => {
    input.connect(filter);
    filter.connect(delays[index]);
    delays[index].connect(panners[index]);
    panners[index].connect(wet);
    delays[index].connect(feedbackGains[index]);
    feedbackGains[index].connect(delays[index]);
  });
  wet.connect(output);
  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  spectralDelays.set(id, {
    input,
    output,
    dry,
    wet,
    filters,
    delays,
    feedbackGains,
    panners,
  });
};
const createPhaser = (id: string) => {
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

const createBitcrusher = (id: string) => {
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

const createFlanger = (id: string) => {
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

const createLimiter = (id: string) => {
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

const createLooper = (id: string) => {
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

const createTremolo = (id: string) => {
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

const createRingMod = (id: string) => {
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

const createVibrato = (id: string) => {
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

const createCombFilter = (id: string) => {
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

const createAutoPan = (id: string) => {
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

const createAutoFilter = (id: string) => {
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

const createResonator = (id: string) => {
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

const createWah = (id: string) => {
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

const createStereoWidener = (id: string) => {
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

const createFoldback = (id: string) => {
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

const createTiltEq = (id: string) => {
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

const createSaturator = (id: string) => {
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

const createCabSim = (id: string) => {
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

const createTransientShaper = (id: string) => {
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

const createFreezeFx = (id: string) => {
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

const createGranular = (id: string) => {
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

const createStutter = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const maxSamples = Math.max(1, Math.floor(ctx.sampleRate));
  const buffer = new Float32Array(maxSamples);
  let writeIndex = 0;
  let readIndex = 0;
  const params = {
    lengthSamples: Math.max(1, Math.floor(ctx.sampleRate * 0.12)),
    mix: 0.8,
  };

  dry.gain.setValueAtTime(0.2, ctx.currentTime);
  wet.gain.setValueAtTime(0.8, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);
    const segmentLength = Math.max(1, Math.min(maxSamples, params.lengthSamples));

    for (let index = 0; index < inputBuffer.length; index += 1) {
      buffer[writeIndex] = inputBuffer[index];
      outputBuffer[index] = buffer[readIndex] ?? 0;

      writeIndex = (writeIndex + 1) % maxSamples;
      readIndex = (readIndex + 1) % segmentLength;
      if (writeIndex % segmentLength === 0) {
        readIndex = 0;
      }
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  stutters.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

export const createFxAudioNode = (type: EditableAudioNodeType, id: string) => {
  switch (type) {
    case 'channelStrip':
      createChannelStrip(id);
      return true;
    case 'compressor':
      createCompressor(id);
      return true;
    case 'equalizer8':
      createEqualizer8(id);
      return true;
    case 'chorus':
      createChorus(id);
      return true;
    case 'phaser':
      createPhaser(id);
      return true;
    case 'bitcrusher':
      createBitcrusher(id);
      return true;
    case 'flanger':
      createFlanger(id);
      return true;
    case 'limiter':
      createLimiter(id);
      return true;
    case 'looper':
      createLooper(id);
      return true;
    case 'tremolo':
      createTremolo(id);
      return true;
    case 'ringMod':
      createRingMod(id);
      return true;
    case 'vibrato':
      createVibrato(id);
      return true;
    case 'combFilter':
      createCombFilter(id);
      return true;
    case 'autoPan':
      createAutoPan(id);
      return true;
    case 'autoFilter':
      createAutoFilter(id);
      return true;
    case 'resonator':
      createResonator(id);
      return true;
    case 'wah':
      createWah(id);
      return true;
    case 'stereoWidener':
      createStereoWidener(id);
      return true;
    case 'foldback':
      createFoldback(id);
      return true;
    case 'tiltEq':
      createTiltEq(id);
      return true;
    case 'saturator':
      createSaturator(id);
      return true;
    case 'cabSim':
      createCabSim(id);
      return true;
    case 'transientShaper':
      createTransientShaper(id);
      return true;
    case 'freezeFx':
      createFreezeFx(id);
      return true;
    case 'spectralDelay':
      createSpectralDelay(id);
      return true;
    case 'granular':
      createGranular(id);
      return true;
    case 'stutter':
      createStutter(id);
      return true;
    default:
      return false;
  }
};
