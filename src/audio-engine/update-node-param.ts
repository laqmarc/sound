import type { AudioParamName, AudioParamValue } from './runtime';

import {
  nodes,
  dualOscs,
  leadVoices,
  fmSynths,
  subOscs,
  monoSynths,
  weirdMachines,
  chaosShrines,
  nodeConfigs,
  buildDistortionCurve,
  buildImpulseResponse,
  getAudioContext,
} from './runtime';

export const updateAudioNodeParam = (
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

  const leadVoice = leadVoices.get(id);
  if (leadVoice) {
    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      leadVoice.oscillator.frequency.setTargetAtTime(value, ctx.currentTime, Math.max(0.001, leadVoice.glide));
    } else if (param === 'type') {
      leadVoice.oscillator.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      leadVoice.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
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

  const weirdMachine = weirdMachines.get(id);
  if (weirdMachine) {
    const weirdData = nodeConfigs.get(id)?.data;
    const texture = Math.max(0, Math.min(1, weirdData?.texture ?? 0.45));
    const chaos = Math.max(0, Math.min(1, weirdData?.chaos ?? 0.5));
    const harmonicRatio = 1.2 + texture * 1.8 + chaos * 0.45;

    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      weirdMachine.carrier.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
      weirdMachine.harmonic.frequency.setTargetAtTime(value * harmonicRatio, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      weirdMachine.carrier.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      weirdMachine.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
    return;
  }

  const chaosShrine = chaosShrines.get(id);
  if (chaosShrine) {
    const shrineData = nodeConfigs.get(id)?.data;
    const texture = Math.max(0, Math.min(1, shrineData?.texture ?? 0.55));
    const chaos = Math.max(0, Math.min(1, shrineData?.chaos ?? 0.72));
    const spread = shrineData?.spread ?? 8;
    const detune = shrineData?.detune ?? 18;

    if (param === 'frequency' && typeof value === 'number' && Number.isFinite(value)) {
      chaosShrine.carrier.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
      chaosShrine.sub.frequency.setTargetAtTime(Math.max(18, value / 2), ctx.currentTime, 0.03);
      chaosShrine.shimmer.frequency.setTargetAtTime(
        value * (1.48 + spread / 24 + texture * 0.55),
        ctx.currentTime,
        0.03,
      );
      chaosShrine.shimmer.detune.setTargetAtTime(detune * (0.8 + chaos * 0.8), ctx.currentTime, 0.03);
    } else if (param === 'type') {
      chaosShrine.carrier.type = value as OscillatorType;
    } else if (param === 'gain' && typeof value === 'number' && Number.isFinite(value)) {
      chaosShrine.output.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
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
