import type { EditableAudioNodeType } from '../types';

import {
  nodes,
  drumMachines,
  drum2s,
  arpeggiators,
  arpeggiatorTargets,
  arp2s,
  arp2Targets,
  fmSynths,
  subOscs,
  noiseLayers,
  weirdMachines,
  chaosShrines,
  dualOscs,
  dronePads,
  basslines,
  leadVoices,
  samplers,
  clockDividers,
  randomCvs,
  sampleHolds,
  gateSeqs,
  cvOffsets,
  envelopeFollowers,
  quantizers,
  comparators,
  lags,
  chordSeqs,
  humanizers,
  triggerDelays,
  monoSynths,
  kickSynths,
  snareSynths,
  hiHatSynths,
  chordGenerators,
  defaultDrumPattern,
  defaultDrum2Pattern,
  defaultDrum2Voices,
  DEFAULT_KICK_STEPS,
  DEFAULT_SNARE_STEPS,
  DEFAULT_HIHAT_STEPS,
  defaultArpSteps,
  defaultArp2Steps,
  getNoiseBuffer,
  buildSaturatorCurve,
  getAudioContext,
} from './runtime';

const createDrumMachine = (id: string) => {
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

const createDrum2 = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.92, ctx.currentTime);
  nodes.set(id, output);

  drum2s.set(id, {
    id,
    output,
    pattern: defaultDrum2Pattern(),
    length: 16,
    stepIndex: 0,
    voices: defaultDrum2Voices(),
  });

  return output;
};

const createArpeggiator = (id: string) => {
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

const createArp2 = (id: string) => {
  arp2s.set(id, {
    id,
    stepIndex: 0,
    syncDivision: '1/16',
    steps: defaultArp2Steps(),
    mode: 'up',
    scale: 'minor',
    length: 16,
    octaveSpan: 2,
    transpose: 0,
    chance: 100,
    ratchet: 1,
  });
  arp2Targets.set(id, new Set());
};

const createFMSynth = (id: string) => {
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

const createSubOsc = (id: string) => {
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

const createNoiseLayer = (id: string) => {
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

const createWeirdMachine = (id: string) => {
  const ctx = getAudioContext();
  const carrier = ctx.createOscillator();
  const harmonic = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const noiseSource = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const harmonicGain = ctx.createGain();
  const modGain = ctx.createGain();
  const wobbleLfo = ctx.createOscillator();
  const wobbleGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const shaper = ctx.createWaveShaper();
  const output = ctx.createGain();

  carrier.type = 'sawtooth';
  harmonic.type = 'square';
  carrier.frequency.setValueAtTime(180, ctx.currentTime);
  harmonic.frequency.setValueAtTime(270, ctx.currentTime);
  modulator.type = 'triangle';
  modulator.frequency.setValueAtTime(84, ctx.currentTime);
  wobbleLfo.type = 'sine';
  wobbleLfo.frequency.setValueAtTime(3.5, ctx.currentTime);
  noiseSource.buffer = getNoiseBuffer(ctx);
  noiseSource.loop = true;
  noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
  harmonicGain.gain.setValueAtTime(0.3, ctx.currentTime);
  modGain.gain.setValueAtTime(120, ctx.currentTime);
  wobbleGain.gain.setValueAtTime(900, ctx.currentTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, ctx.currentTime);
  filter.Q.setValueAtTime(1.4, ctx.currentTime);
  shaper.curve = buildSaturatorCurve(2.2);
  shaper.oversample = '4x';
  output.gain.setValueAtTime(0.22, ctx.currentTime);

  carrier.connect(filter);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  noiseSource.connect(noiseGain);
  noiseGain.connect(filter);
  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  modGain.connect(harmonic.frequency);
  wobbleLfo.connect(wobbleGain);
  wobbleGain.connect(filter.frequency);
  filter.connect(shaper);
  shaper.connect(output);

  carrier.start();
  harmonic.start();
  modulator.start();
  wobbleLfo.start();
  noiseSource.start();

  nodes.set(id, carrier);
  nodes.set(`${id}_out`, output);
  weirdMachines.set(id, {
    carrier,
    harmonic,
    modulator,
    noiseSource,
    noiseGain,
    harmonicGain,
    modGain,
    wobbleLfo,
    wobbleGain,
    filter,
    shaper,
    output,
    steps: [true, false, true, false, true, true, false, true],
    syncDivision: '1/8',
    stepIndex: 0,
  });
};

const createChaosShrine = (id: string) => {
  const ctx = getAudioContext();
  const carrier = ctx.createOscillator();
  const sub = ctx.createOscillator();
  const shimmer = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const fmGain = ctx.createGain();
  const motionLfo = ctx.createOscillator();
  const motionDepth = ctx.createGain();
  const motionBias = ctx.createConstantSource();
  const motionVca = ctx.createGain();
  const noiseSource = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const carrierGain = ctx.createGain();
  const subGain = ctx.createGain();
  const shimmerGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const colorFilter = ctx.createBiquadFilter();
  const shaper = ctx.createWaveShaper();
  const leftDelay = ctx.createDelay(0.03);
  const rightDelay = ctx.createDelay(0.03);
  const leftPan = ctx.createStereoPanner();
  const rightPan = ctx.createStereoPanner();
  const output = ctx.createGain();

  carrier.type = 'sawtooth';
  sub.type = 'square';
  shimmer.type = 'triangle';
  modulator.type = 'triangle';
  motionLfo.type = 'sine';
  carrier.frequency.setValueAtTime(110, ctx.currentTime);
  sub.frequency.setValueAtTime(55, ctx.currentTime);
  shimmer.frequency.setValueAtTime(164, ctx.currentTime);
  modulator.frequency.setValueAtTime(72, ctx.currentTime);
  motionLfo.frequency.setValueAtTime(2.5, ctx.currentTime);
  fmGain.gain.setValueAtTime(140, ctx.currentTime);
  motionDepth.gain.setValueAtTime(0.22, ctx.currentTime);
  motionBias.offset.setValueAtTime(0.65, ctx.currentTime);
  motionVca.gain.setValueAtTime(0, ctx.currentTime);
  noiseSource.buffer = getNoiseBuffer(ctx);
  noiseSource.loop = true;
  noiseGain.gain.setValueAtTime(0.07, ctx.currentTime);
  carrierGain.gain.setValueAtTime(0.34, ctx.currentTime);
  subGain.gain.setValueAtTime(0.22, ctx.currentTime);
  shimmerGain.gain.setValueAtTime(0.18, ctx.currentTime);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900, ctx.currentTime);
  filter.Q.setValueAtTime(4.5, ctx.currentTime);
  colorFilter.type = 'lowpass';
  colorFilter.frequency.setValueAtTime(2600, ctx.currentTime);
  colorFilter.Q.setValueAtTime(0.9, ctx.currentTime);
  shaper.curve = buildSaturatorCurve(2.8);
  shaper.oversample = '4x';
  leftDelay.delayTime.setValueAtTime(0.0015, ctx.currentTime);
  rightDelay.delayTime.setValueAtTime(0.009, ctx.currentTime);
  leftPan.pan.setValueAtTime(-0.45, ctx.currentTime);
  rightPan.pan.setValueAtTime(0.45, ctx.currentTime);
  output.gain.setValueAtTime(0.24, ctx.currentTime);

  modulator.connect(fmGain);
  fmGain.connect(carrier.frequency);
  fmGain.connect(shimmer.frequency);
  motionLfo.connect(motionDepth);
  motionDepth.connect(motionVca.gain);
  motionBias.connect(motionVca.gain);

  carrier.connect(carrierGain);
  sub.connect(subGain);
  shimmer.connect(shimmerGain);
  carrierGain.connect(filter);
  subGain.connect(filter);
  shimmerGain.connect(filter);
  noiseSource.connect(noiseGain);
  noiseGain.connect(filter);
  filter.connect(colorFilter);
  colorFilter.connect(shaper);
  shaper.connect(motionVca);
  motionVca.connect(leftDelay);
  motionVca.connect(rightDelay);
  leftDelay.connect(leftPan);
  rightDelay.connect(rightPan);
  leftPan.connect(output);
  rightPan.connect(output);

  carrier.start();
  sub.start();
  shimmer.start();
  modulator.start();
  motionLfo.start();
  motionBias.start();
  noiseSource.start();

  nodes.set(id, carrier);
  nodes.set(`${id}_out`, output);
  chaosShrines.set(id, {
    carrier,
    sub,
    shimmer,
    modulator,
    fmGain,
    motionLfo,
    motionDepth,
    motionBias,
    motionVca,
    noiseSource,
    noiseGain,
    carrierGain,
    subGain,
    shimmerGain,
    filter,
    colorFilter,
    shaper,
    leftDelay,
    rightDelay,
    leftPan,
    rightPan,
    output,
    steps: [true, false, true, true, false, true, false, true, true, false, false, true, false, true, true, false],
    syncDivision: '1/16',
    stepIndex: 0,
  });
};

const createDualOsc = (id: string) => {
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

const createDronePad = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.25, ctx.currentTime);

  const oscillators = Array.from({ length: 3 }, () => {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.connect(output);
    oscillator.start();
    return oscillator;
  });

  nodes.set(id, output);
  nodes.set(`${id}_out`, output);
  dronePads.set(id, {
    oscillators,
    output,
  });
};

const createBassline = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, output);
  basslines.set(id, {
    id,
    output,
    steps: Array.from({ length: 16 }, (_, index) => index % 4 === 0),
    syncDivision: '1/16',
    note: 'C',
    octave: 2,
    tone: 900,
    gain: 0.45,
  });
};

const createLeadVoice = (id: string) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const output = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(330, ctx.currentTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, ctx.currentTime);
  filter.Q.setValueAtTime(0.8, ctx.currentTime);
  output.gain.setValueAtTime(0.3, ctx.currentTime);

  oscillator.connect(filter);
  filter.connect(output);
  oscillator.start();

  nodes.set(id, oscillator);
  nodes.set(`${id}_out`, output);
  leadVoices.set(id, {
    oscillator,
    filter,
    output,
    glide: 0.04,
  });
};

const createSampler = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.85, ctx.currentTime);

  nodes.set(id, output);
  samplers.set(id, {
    output,
    mediaElement: null,
    sourceNode: null,
    sampleDataUrl: null,
    lastTriggerNonce: 0,
    lastStopNonce: 0,
  });
};

const createClockDivider = (id: string) => {
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

const createRandomCv = (id: string) => {
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

const createSampleHold = (id: string) => {
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

const createGateSeq = (id: string) => {
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

const createCVOffset = (id: string) => {
  const ctx = getAudioContext();
  const source = ctx.createConstantSource();
  const scaler = ctx.createGain();

  source.offset.setValueAtTime(0, ctx.currentTime);
  scaler.gain.setValueAtTime(1, ctx.currentTime);
  source.connect(scaler);
  source.start();

  nodes.set(id, source);
  nodes.set(`${id}_out`, scaler);
  cvOffsets.set(id, {
    source,
    scaler,
  });
};

const createEnvelopeFollower = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const analyser = ctx.createScriptProcessor(2048, 1, 1);
  const source = ctx.createConstantSource();
  const scaler = ctx.createGain();
  const params = {
    attack: 0.03,
    release: 0.18,
    gain: 200,
  };
  let env = 0;

  source.offset.setValueAtTime(0, ctx.currentTime);
  scaler.gain.setValueAtTime(params.gain, ctx.currentTime);

  analyser.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      const magnitude = Math.abs(inputBuffer[index]);
      const coefficient = magnitude > env ? params.attack : params.release;
      env += (magnitude - env) * Math.min(1, Math.max(0.0001, coefficient));
    }

    source.offset.setTargetAtTime(env, ctx.currentTime, 0.01);
  };

  input.connect(analyser);
  analyser.connect(ctx.createGain());
  source.connect(scaler);
  source.start();

  nodes.set(id, input);
  nodes.set(`${id}_out`, scaler);
  envelopeFollowers.set(id, {
    input,
    analyser,
    source,
    scaler,
    params,
  });
};

const createQuantizer = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const params = {
    steps: 12,
    mix: 1,
  };

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);
    const steps = Math.max(2, Math.round(params.steps));
    const stepSize = 2 / steps;

    for (let index = 0; index < inputBuffer.length; index += 1) {
      const sample = inputBuffer[index];
      outputBuffer[index] = Math.round(sample / stepSize) * stepSize;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  quantizers.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

const createComparator = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const output = ctx.createGain();
  const params = {
    threshold: 0,
  };

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      outputBuffer[index] = inputBuffer[index] >= params.threshold ? 1 : 0;
    }
  };

  input.connect(processor);
  processor.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  comparators.set(id, {
    input,
    processor,
    output,
    params,
  });
};

const createLag = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const processor = ctx.createScriptProcessor(2048, 1, 1);
  const params = {
    rise: 0.02,
    fall: 0.08,
    mix: 1,
  };
  let state = 0;

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);

  processor.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const outputBuffer = event.outputBuffer.getChannelData(0);

    for (let index = 0; index < inputBuffer.length; index += 1) {
      const target = inputBuffer[index];
      const coefficient = target > state ? params.rise : params.fall;
      state += (target - state) * Math.min(1, Math.max(0.0001, coefficient));
      outputBuffer[index] = state;
    }
  };

  input.connect(dry);
  dry.connect(output);
  input.connect(processor);
  processor.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  lags.set(id, {
    input,
    output,
    dry,
    wet,
    processor,
    params,
  });
};

const createChordSeq = (id: string) => {
  const ctx = getAudioContext();
  const output = ctx.createGain();
  output.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, output);
  chordSeqs.set(id, {
    id,
    output,
    steps: Array.from({ length: 16 }, (_, index) => index % 4 === 0),
    syncDivision: '1/4',
    note: 'C',
    octave: 3,
    chordType: 'major',
    spread: 10,
    gain: 0.22,
  });
};

const createHumanizer = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(0.03);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  dry.gain.setValueAtTime(0.3, ctx.currentTime);
  wet.gain.setValueAtTime(0.7, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.008, ctx.currentTime);
  lfo.frequency.setValueAtTime(2, ctx.currentTime);
  lfoGain.gain.setValueAtTime(0.003, ctx.currentTime);

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
  humanizers.set(id, {
    input,
    output,
    dry,
    wet,
    delay,
    lfo,
    lfoGain,
  });
};

const createTriggerDelay = (id: string) => {
  const ctx = getAudioContext();
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(0.4);

  dry.gain.setValueAtTime(0, ctx.currentTime);
  wet.gain.setValueAtTime(1, ctx.currentTime);
  delay.delayTime.setValueAtTime(0.08, ctx.currentTime);

  input.connect(dry);
  dry.connect(output);
  input.connect(delay);
  delay.connect(wet);
  wet.connect(output);

  nodes.set(id, input);
  nodes.set(`${id}_out`, output);
  triggerDelays.set(id, {
    input,
    output,
    dry,
    wet,
    delay,
  });
};

const createMonoSynth = (id: string) => {
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

const createKickSynth = (id: string) => {
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

const createSnareSynth = (id: string) => {
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

const createHiHatSynth = (id: string) => {
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

const createChordGenerator = (id: string) => {
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

export const createMusicalAudioNode = (type: EditableAudioNodeType, id: string) => {
  switch (type) {
    case 'dualOsc':
      createDualOsc(id);
      return true;
    case 'dronePad':
      createDronePad(id);
      return true;
    case 'bassline':
      createBassline(id);
      return true;
    case 'leadVoice':
      createLeadVoice(id);
      return true;
    case 'sampler':
      createSampler(id);
      return true;
    case 'clockDivider':
      createClockDivider(id);
      return true;
    case 'randomCv':
      createRandomCv(id);
      return true;
    case 'sampleHold':
      createSampleHold(id);
      return true;
    case 'gateSeq':
      createGateSeq(id);
      return true;
    case 'cvOffset':
      createCVOffset(id);
      return true;
    case 'envelopeFollower':
      createEnvelopeFollower(id);
      return true;
    case 'quantizer':
      createQuantizer(id);
      return true;
    case 'comparator':
      createComparator(id);
      return true;
    case 'lag':
      createLag(id);
      return true;
    case 'chordSeq':
      createChordSeq(id);
      return true;
    case 'humanizer':
      createHumanizer(id);
      return true;
    case 'triggerDelay':
      createTriggerDelay(id);
      return true;
    case 'monoSynth':
      createMonoSynth(id);
      return true;
    case 'kickSynth':
      createKickSynth(id);
      return true;
    case 'snareSynth':
      createSnareSynth(id);
      return true;
    case 'hiHatSynth':
      createHiHatSynth(id);
      return true;
    case 'chordGenerator':
      createChordGenerator(id);
      return true;
    case 'drumMachine':
      createDrumMachine(id);
      return true;
    case 'drum2':
      createDrum2(id);
      return true;
    case 'arpeggiator':
      createArpeggiator(id);
      return true;
    case 'arp2':
      createArp2(id);
      return true;
    case 'fmSynth':
      createFMSynth(id);
      return true;
    case 'subOsc':
      createSubOsc(id);
      return true;
    case 'noiseLayer':
      createNoiseLayer(id);
      return true;
    case 'weirdMachine':
      createWeirdMachine(id);
      return true;
    case 'chaosShrine':
      createChaosShrine(id);
      return true;
    default:
      return false;
  }
};
