import type { EditableAudioNodeType, SoundNodeData } from '../types';
import type { AudioParamName, AudioParamValue } from './runtime';

import {
  audioContext,
  drumMachines,
  arpeggiators,
  arpeggiatorTargets,
  basslines,
  clockDividers,
  randomCvs,
  gateSeqs,
  chordSeqs,
  kickSynths,
  snareSynths,
  hiHatSynths,
  weirdMachines,
  chaosShrines,
  nodeConfigs,
  transportState,
  BASSLINE_OFFSETS,
  quantizeNoteToScale,
  dispatchTransportEvent,
  emitTransportState,
  getSyncedDurationSeconds,
  shouldTriggerOnTransportStep,
  noteToFrequency,
  getPlayableArpSteps,
  triggerKick,
  triggerKickVoice,
  triggerSnare,
  triggerSnareVoice,
  triggerHiHat,
  triggerHiHatVoice,
  triggerBasslineVoice,
  triggerChordSequenceVoice,
} from './runtime';

type UpdateNodeParam = (
  id: string,
  param: AudioParamName,
  value: AudioParamValue,
) => void;

type ApplyAudioNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
) => void;

type TransportCallbacks = {
  applyAudioNodeData: ApplyAudioNodeData;
  updateNodeParam: UpdateNodeParam;
};

const updateSyncedNodesForTransport = (applyAudioNodeData: ApplyAudioNodeData) => {
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
      config.type === 'granular' ||
      config.type === 'stutter' ||
      config.type === 'triggerDelay' ||
      config.type === 'weirdMachine' ||
      config.type === 'chaosShrine'
    ) {
      applyAudioNodeData(config.type, id, config.data);
    }
  });
};

export const clearTransportTimer = () => {
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

const tickTransport = (callbacks: TransportCallbacks) => {
  const { updateNodeParam } = callbacks;
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

  basslines.forEach((bassline) => {
    if (!shouldTriggerOnTransportStep(step, bassline.syncDivision)) {
      return;
    }

    if (!(bassline.steps[step] ?? false)) {
      return;
    }

    const root = noteToFrequency(bassline.note, bassline.octave);
    const offset = BASSLINE_OFFSETS[step] ?? 0;
    const frequency = root * Math.pow(2, offset / 12);
    triggerBasslineVoice(ctx, bassline.output, frequency, bassline.tone, bassline.gain);
  });

  chordSeqs.forEach((chordSeq) => {
    if (!shouldTriggerOnTransportStep(step, chordSeq.syncDivision)) {
      return;
    }

    if (!(chordSeq.steps[step] ?? false)) {
      return;
    }

    const root = noteToFrequency(chordSeq.note, chordSeq.octave);
    const durationSeconds = getSyncedDurationSeconds(chordSeq.syncDivision, transportState.bpm) * 0.9;
    triggerChordSequenceVoice(
      ctx,
      chordSeq.output,
      root,
      chordSeq.chordType,
      chordSeq.spread,
      chordSeq.gain,
      durationSeconds,
    );
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

  weirdMachines.forEach((weirdMachine, id) => {
    if (!shouldTriggerOnTransportStep(step, weirdMachine.syncDivision)) {
      return;
    }

    const stepIndex = weirdMachine.stepIndex % weirdMachine.steps.length;
    const isHot = weirdMachine.steps[stepIndex] ?? false;
    const config = nodeConfigs.get(id)?.data;
    const texture = Math.max(0, Math.min(1, config?.texture ?? 0.45));
    const chaos = Math.max(0, Math.min(1, config?.chaos ?? 0.5));
    const baseTone = config?.tone ?? 1800;
    const baseGain = config?.gain ?? 0.22;
    const baseMod = config?.modAmount ?? 120;

    weirdMachine.filter.frequency.setTargetAtTime(
      isHot ? baseTone * (1.15 + texture * 0.35) : baseTone * (0.82 + chaos * 0.08),
      ctx.currentTime,
      0.015,
    );
    weirdMachine.output.gain.setTargetAtTime(
      isHot ? Math.min(1, baseGain * 1.2) : baseGain * 0.78,
      ctx.currentTime,
      0.02,
    );
    weirdMachine.modGain.gain.setTargetAtTime(
      isHot ? baseMod * (1.08 + chaos * 0.35) : baseMod * (0.8 + texture * 0.08),
      ctx.currentTime,
      0.02,
    );

    dispatchTransportEvent('weird-machine-step', {
      id,
      stepIndex,
      active: isHot,
    });

    weirdMachine.stepIndex = (weirdMachine.stepIndex + 1) % weirdMachine.steps.length;
  });

  chaosShrines.forEach((chaosShrine, id) => {
    if (!shouldTriggerOnTransportStep(step, chaosShrine.syncDivision)) {
      return;
    }

    const stepIndex = chaosShrine.stepIndex % chaosShrine.steps.length;
    const isHot = chaosShrine.steps[stepIndex] ?? false;
    const config = nodeConfigs.get(id)?.data;
    const isFrozen = config?.freeze ?? false;

    if (isFrozen) {
      dispatchTransportEvent('chaos-shrine-step', {
        id,
        stepIndex,
        active: isHot,
      });
      return;
    }

    const texture = Math.max(0, Math.min(1, config?.texture ?? 0.55));
    const chaos = Math.max(0, Math.min(1, config?.chaos ?? 0.72));
    const blend = Math.max(0, Math.min(1, config?.blend ?? 0.58));
    const baseTone = config?.tone ?? 900;
    const baseGain = config?.gain ?? 0.24;
    const baseMod = config?.modAmount ?? 140;

    chaosShrine.filter.frequency.setTargetAtTime(
      isHot ? baseTone * (1.3 + texture * 0.45) : baseTone * (0.78 + chaos * 0.12),
      ctx.currentTime,
      0.016,
    );
    chaosShrine.colorFilter.frequency.setTargetAtTime(
      isHot ? baseTone * (2.2 + texture * 1.1) : baseTone * (1.35 + blend * 0.35),
      ctx.currentTime,
      0.016,
    );
    chaosShrine.output.gain.setTargetAtTime(
      isHot ? Math.min(1, baseGain * 1.24) : baseGain * 0.72,
      ctx.currentTime,
      0.02,
    );
    chaosShrine.fmGain.gain.setTargetAtTime(
      isHot ? baseMod * (1.18 + chaos * 0.45) : baseMod * (0.72 + texture * 0.18),
      ctx.currentTime,
      0.02,
    );
    chaosShrine.shimmerGain.gain.setTargetAtTime(
      isHot ? 0.18 + blend * 0.52 + texture * 0.18 : 0.08 + blend * 0.28,
      ctx.currentTime,
      0.02,
    );

    dispatchTransportEvent('chaos-shrine-step', {
      id,
      stepIndex,
      active: isHot,
    });

    chaosShrine.stepIndex = (chaosShrine.stepIndex + 1) % chaosShrine.steps.length;
  });

  dispatchTransportEvent('transport-step', {
    step,
    bpm: transportState.bpm,
  });
  emitTransportState();

  transportState.step = (step + 1) % 16;
  if (transportState.isPlaying) {
    transportState.timerId = window.setTimeout(
      () => tickTransport(callbacks),
      getNextTransportIntervalMs(),
    );
  }
};

const restartTransportTimer = (callbacks: TransportCallbacks) => {
  clearTransportTimer();

  if (!transportState.isPlaying) {
    return;
  }

  transportState.timerId = window.setTimeout(
    () => tickTransport(callbacks),
    getNextTransportIntervalMs(),
  );
};

export const getTransportStateSnapshot = () => ({
  bpm: transportState.bpm,
  swing: transportState.swing,
  isPlaying: transportState.isPlaying,
  step: transportState.step,
});

export const startTransportEngine = (callbacks: TransportCallbacks) => {
  transportState.isPlaying = true;
  transportState.step = 0;
  emitTransportState();
  restartTransportTimer(callbacks);
  dispatchTransportEvent('transport-start', {
    bpm: transportState.bpm,
    step: 0,
  });
};

export const setTransportEngineBpm = (
  bpm: number,
  callbacks: TransportCallbacks,
) => {
  if (!Number.isFinite(bpm)) {
    return;
  }

  if (transportState.bpm === bpm) {
    return;
  }

  transportState.bpm = bpm;
  restartTransportTimer(callbacks);
  updateSyncedNodesForTransport(callbacks.applyAudioNodeData);
  emitTransportState();
  dispatchTransportEvent('transport-bpm', {
    bpm: transportState.bpm,
  });
};

export const setTransportEngineSwing = (
  swing: number,
  callbacks: TransportCallbacks,
) => {
  if (!Number.isFinite(swing)) {
    return;
  }

  const normalizedSwing = Math.max(0, Math.min(0.45, swing));

  if (transportState.swing === normalizedSwing) {
    return;
  }

  transportState.swing = normalizedSwing;
  restartTransportTimer(callbacks);
  emitTransportState();
  dispatchTransportEvent('transport-swing', {
    swing: transportState.swing,
  });
};
