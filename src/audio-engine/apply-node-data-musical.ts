import type { EditableAudioNodeType, SoundNodeData } from '../types';
import type { AudioParamName, AudioParamValue } from './runtime';
import {
  CHORD_INTERVALS,
  DEFAULT_HIHAT_STEPS,
  DEFAULT_KICK_STEPS,
  DEFAULT_SNARE_STEPS,
  arpeggiators,
  arp2s,
  basslines,
  chordGenerators,
  chordSeqs,
  clockDividers,
  cloneArpSteps,
  cloneArp2Steps,
  cloneDrumPattern,
  cloneDrum2Pattern,
  cloneDrum2Voices,
  cloneStepPattern,
  cvOffsets,
  dronePads,
  drumMachines,
  drum2s,
  dualOscs,
  envelopeFollowers,
  fmSynths,
  gateSeqs,
  getAudioContext,
  getSyncedLfoFrequency,
  hiHatSynths,
  kickSynths,
  leadVoices,
  monoSynths,
  noiseLayers,
  weirdMachines,
  chaosShrines,
  noteToFrequency,
  randomCvs,
  snareSynths,
  subOscs,
  transportState,
  buildSaturatorCurve,
} from './runtime';

interface ApplyMusicalNodeDataOptions {
  setTransportBpm: (bpm: number) => void;
  updateNodeParam: (id: string, param: AudioParamName, value: AudioParamValue) => void;
  changedData?: Partial<SoundNodeData>;
}

export const applyMusicalNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
  options: ApplyMusicalNodeDataOptions,
) => {
  const updateIfDefined = (
    targetId: string,
    param: AudioParamName,
    value: AudioParamValue | undefined,
  ) => {
    if (value !== undefined) {
      options.updateNodeParam(targetId, param, value);
    }
  };

  switch (type) {
    case 'oscillator':
      updateIfDefined(id, 'frequency', data.frequency);
      updateIfDefined(id, 'type', data.type);
      return true;
    case 'dualOsc': {
      const dualOsc = dualOscs.get(id);
      if (!dualOsc) {
        return true;
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
      return true;
    }
    case 'dronePad': {
      const dronePad = dronePads.get(id);
      if (!dronePad) {
        return true;
      }

      const root = noteToFrequency(data.note ?? 'C', data.octave ?? 3);
      const intervals = CHORD_INTERVALS[data.chordType ?? 'minor'];
      const spread = data.spread ?? 14;
      const currentTime = getAudioContext().currentTime;
      const waveType = (data.type as OscillatorType | undefined) ?? 'sawtooth';

      dronePad.oscillators.forEach((oscillator, index) => {
        const semitones = intervals[index] ?? 0;
        oscillator.frequency.setTargetAtTime(root * Math.pow(2, semitones / 12), currentTime, 0.03);
        oscillator.detune.setTargetAtTime((index - 1) * spread, currentTime, 0.03);
        oscillator.type = waveType;
      });
      dronePad.output.gain.setTargetAtTime(data.gain ?? 0.25, currentTime, 0.03);
      return true;
    }
    case 'bassline': {
      const bassline = basslines.get(id);
      if (!bassline) {
        return true;
      }

      bassline.steps = cloneStepPattern(data.steps, Array.from({ length: 16 }, (_, index) => index % 4 === 0));
      bassline.syncDivision = data.syncDivision ?? '1/16';
      bassline.note = data.note ?? 'C';
      bassline.octave = data.octave ?? 2;
      bassline.tone = data.tone ?? 900;
      bassline.gain = data.gain ?? 0.45;
      return true;
    }
    case 'leadVoice': {
      const leadVoice = leadVoices.get(id);
      if (!leadVoice) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      const glide = data.glide ?? 0.04;
      leadVoice.glide = glide;
      leadVoice.oscillator.frequency.cancelScheduledValues(currentTime);
      leadVoice.oscillator.frequency.setTargetAtTime(data.frequency ?? 330, currentTime, Math.max(0.001, glide));
      leadVoice.oscillator.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      leadVoice.filter.type = 'lowpass';
      leadVoice.filter.frequency.setTargetAtTime(data.tone ?? 2200, currentTime, 0.03);
      leadVoice.filter.Q.setTargetAtTime(data.Q ?? 0.8, currentTime, 0.03);
      leadVoice.output.gain.setTargetAtTime(data.gain ?? 0.3, currentTime, 0.03);
      return true;
    }
    case 'drumMachine': {
      const drumMachine = drumMachines.get(id);
      if (!drumMachine) {
        return true;
      }

      drumMachine.pattern = cloneDrumPattern(data.drumPattern);
      if (options.changedData?.bpm !== undefined && data.bpm !== undefined) {
        options.setTransportBpm(data.bpm);
      }
      return true;
    }
    case 'drum2': {
      const drum2 = drum2s.get(id);
      if (!drum2) {
        return true;
      }

      drum2.pattern = cloneDrum2Pattern(data.drum2Pattern);
      drum2.length = Math.max(4, Math.min(32, Math.round(data.drum2Length ?? 16)));
      drum2.voices = cloneDrum2Voices(data.drum2Voices);
      drum2.stepIndex %= drum2.length;
      if (options.changedData?.bpm !== undefined && data.bpm !== undefined) {
        options.setTransportBpm(data.bpm);
      }
      return true;
    }
    case 'arpeggiator': {
      const arpeggiator = arpeggiators.get(id);
      if (!arpeggiator) {
        return true;
      }

      arpeggiator.syncDivision = data.syncDivision ?? '1/8';
      arpeggiator.steps = cloneArpSteps(data.arpSteps);
      arpeggiator.mode = data.arpMode ?? 'up';
      arpeggiator.scale = data.arpScale ?? 'chromatic';
      arpeggiator.stepIndex = 0;
      return true;
    }
    case 'arp2': {
      const arp2 = arp2s.get(id);
      if (!arp2) {
        return true;
      }

      arp2.syncDivision = data.syncDivision ?? '1/16';
      arp2.steps = cloneArp2Steps(data.arp2Steps);
      arp2.mode = data.arpMode ?? 'up';
      arp2.scale = data.arpScale ?? 'minor';
      arp2.length = Math.max(1, Math.min(16, Math.round(data.arpLength ?? 16)));
      arp2.octaveSpan = Math.max(1, Math.min(4, Math.round(data.arpOctaveSpan ?? 2)));
      arp2.transpose = Math.max(-24, Math.min(24, Math.round(data.arpTranspose ?? 0)));
      arp2.chance = Math.max(0, Math.min(100, data.arpChance ?? 100));
      arp2.ratchet = Math.max(1, Math.min(4, Math.round(data.arpRatchet ?? 1)));
      arp2.stepIndex = 0;
      return true;
    }
    case 'clockDivider': {
      const clockDivider = clockDividers.get(id);
      if (!clockDivider) {
        return true;
      }

      clockDivider.syncDivision = data.syncDivision ?? '1/4';
      return true;
    }
    case 'randomCv': {
      const randomCv = randomCvs.get(id);
      if (!randomCv) {
        return true;
      }

      randomCv.syncDivision = data.syncDivision ?? '1/8';
      randomCv.minValue = data.minValue ?? -300;
      randomCv.maxValue = data.maxValue ?? 300;
      return true;
    }
    case 'gateSeq': {
      const gateSeq = gateSeqs.get(id);
      if (!gateSeq) {
        return true;
      }

      gateSeq.steps = cloneStepPattern(data.steps, Array.from({ length: 16 }, (_, index) => index % 2 === 0));
      gateSeq.syncDivision = data.syncDivision ?? '1/16';
      return true;
    }
    case 'cvOffset': {
      const cvOffset = cvOffsets.get(id);
      if (!cvOffset) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      cvOffset.source.offset.setTargetAtTime(data.offset ?? 0, currentTime, 0.03);
      cvOffset.scaler.gain.setTargetAtTime(data.gain ?? 1, currentTime, 0.03);
      return true;
    }
    case 'envelopeFollower': {
      const envelopeFollower = envelopeFollowers.get(id);
      if (!envelopeFollower) {
        return true;
      }

      envelopeFollower.params.attack = data.attack ?? 0.03;
      envelopeFollower.params.release = data.release ?? 0.18;
      envelopeFollower.params.gain = data.gain ?? 200;
      envelopeFollower.scaler.gain.setTargetAtTime(envelopeFollower.params.gain, getAudioContext().currentTime, 0.03);
      return true;
    }
    case 'chordSeq': {
      const chordSeq = chordSeqs.get(id);
      if (!chordSeq) {
        return true;
      }

      chordSeq.steps = cloneStepPattern(data.steps, Array.from({ length: 16 }, (_, index) => index % 4 === 0));
      chordSeq.syncDivision = data.syncDivision ?? '1/4';
      chordSeq.note = data.note ?? 'C';
      chordSeq.octave = data.octave ?? 3;
      chordSeq.chordType = data.chordType ?? 'major';
      chordSeq.spread = data.spread ?? 10;
      chordSeq.gain = data.gain ?? 0.22;
      return true;
    }
    case 'monoSynth': {
      const monoSynth = monoSynths.get(id);
      if (!monoSynth) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      monoSynth.oscillator.frequency.setTargetAtTime(data.frequency ?? 220, currentTime, 0.03);
      monoSynth.oscillator.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      monoSynth.filter.type = 'lowpass';
      monoSynth.filter.frequency.setTargetAtTime(data.tone ?? 1800, currentTime, 0.03);
      monoSynth.filter.Q.setTargetAtTime(data.Q ?? 0.8, currentTime, 0.03);
      monoSynth.output.gain.setTargetAtTime(data.gain ?? 0.35, currentTime, 0.03);
      return true;
    }
    case 'kickSynth': {
      const synth = kickSynths.get(id);
      if (!synth) {
        return true;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_KICK_STEPS);
      synth.tone = data.tone ?? 58;
      synth.decay = data.decay ?? 0.24;
      synth.gain = data.gain ?? 0.9;
      return true;
    }
    case 'snareSynth': {
      const synth = snareSynths.get(id);
      if (!synth) {
        return true;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_SNARE_STEPS);
      synth.tone = data.tone ?? 180;
      synth.decay = data.decay ?? 0.16;
      synth.gain = data.gain ?? 0.65;
      return true;
    }
    case 'hiHatSynth': {
      const synth = hiHatSynths.get(id);
      if (!synth) {
        return true;
      }

      synth.pattern = cloneStepPattern(data.steps, DEFAULT_HIHAT_STEPS);
      synth.tone = data.tone ?? 9500;
      synth.decay = data.decay ?? 0.06;
      synth.gain = data.gain ?? 0.4;
      return true;
    }
    case 'chordGenerator': {
      const chordGenerator = chordGenerators.get(id);
      if (!chordGenerator) {
        return true;
      }

      const root = noteToFrequency(data.note ?? 'C', data.octave ?? 4);
      const intervals = CHORD_INTERVALS[data.chordType ?? 'major'];
      const spread = data.spread ?? 10;
      const level = (data.gain ?? 0.22) / chordGenerator.oscillators.length;
      const waveType = (data.type as OscillatorType | undefined) ?? 'triangle';
      const currentTime = getAudioContext().currentTime;

      chordGenerator.oscillators.forEach((oscillator, index) => {
        const semitones = intervals[index] ?? 0;
        const frequency = root * Math.pow(2, semitones / 12);
        oscillator.frequency.setTargetAtTime(frequency, currentTime, 0.03);
        oscillator.detune.setTargetAtTime((index - 1) * spread, currentTime, 0.03);
        oscillator.type = waveType;
      });
      chordGenerator.output.gain.setTargetAtTime(level * chordGenerator.oscillators.length, currentTime, 0.03);
      return true;
    }
    case 'fmSynth': {
      const fmSynth = fmSynths.get(id);
      if (!fmSynth) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      fmSynth.carrier.frequency.setTargetAtTime(data.frequency ?? 220, currentTime, 0.03);
      fmSynth.modulator.frequency.setTargetAtTime(data.modFrequency ?? 220, currentTime, 0.03);
      fmSynth.modGain.gain.setTargetAtTime(data.modAmount ?? 180, currentTime, 0.03);
      fmSynth.output.gain.setTargetAtTime(data.gain ?? 0.35, currentTime, 0.03);
      fmSynth.carrier.type = (data.type as OscillatorType | undefined) ?? 'sine';
      fmSynth.modulator.type = data.modType ?? 'sine';
      return true;
    }
    case 'subOsc': {
      const subOsc = subOscs.get(id);
      if (!subOsc) {
        return true;
      }

      const baseFrequency = data.frequency ?? 110;
      const divisor = Math.pow(2, data.subOctave ?? 1);
      const currentTime = getAudioContext().currentTime;
      subOsc.oscillator.frequency.setTargetAtTime(baseFrequency / divisor, currentTime, 0.03);
      subOsc.output.gain.setTargetAtTime(data.gain ?? 0.4, currentTime, 0.03);
      subOsc.oscillator.type = (data.type as OscillatorType | undefined) ?? 'square';
      return true;
    }
    case 'noiseLayer': {
      const noiseLayer = noiseLayers.get(id);
      if (!noiseLayer) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      noiseLayer.filter.type = (data.type as BiquadFilterType | undefined) ?? 'lowpass';
      noiseLayer.filter.frequency.setTargetAtTime(data.tone ?? 2800, currentTime, 0.03);
      noiseLayer.filter.Q.setTargetAtTime(data.Q ?? 0.8, currentTime, 0.03);
      noiseLayer.output.gain.setTargetAtTime(data.gain ?? 0.18, currentTime, 0.03);
      return true;
    }
    case 'weirdMachine': {
      const weirdMachine = weirdMachines.get(id);
      if (!weirdMachine) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      const frequency = data.frequency ?? 180;
      const texture = Math.max(0, Math.min(1, data.texture ?? 0.45));
      const chaos = Math.max(0, Math.min(1, data.chaos ?? 0.5));
      const harmonicRatio = 1.2 + texture * 1.8 + chaos * 0.45;
      const wobbleDepth = Math.max(0, data.depth ?? 900);
      const syncDivision = data.syncDivision ?? '1/8';
      const wobbleRate = data.sync
        ? getSyncedLfoFrequency(syncDivision, transportState.bpm)
        : data.rate ?? 3.5;

      weirdMachine.carrier.frequency.setTargetAtTime(frequency, currentTime, 0.03);
      weirdMachine.harmonic.frequency.setTargetAtTime(frequency * harmonicRatio, currentTime, 0.03);
      weirdMachine.harmonic.detune.setTargetAtTime((chaos - 0.5) * 120, currentTime, 0.03);
      weirdMachine.modulator.frequency.setTargetAtTime(data.modFrequency ?? 84, currentTime, 0.03);
      weirdMachine.modGain.gain.setTargetAtTime((data.modAmount ?? 120) * (0.7 + chaos), currentTime, 0.03);
      weirdMachine.noiseGain.gain.setTargetAtTime(0.04 + texture * 0.3, currentTime, 0.03);
      weirdMachine.harmonicGain.gain.setTargetAtTime(0.12 + texture * 0.5, currentTime, 0.03);
      weirdMachine.wobbleLfo.frequency.setTargetAtTime(wobbleRate, currentTime, 0.03);
      weirdMachine.wobbleGain.gain.setTargetAtTime(wobbleDepth, currentTime, 0.03);
      weirdMachine.filter.type = 'lowpass';
      weirdMachine.filter.frequency.setTargetAtTime(data.tone ?? 1800, currentTime, 0.03);
      weirdMachine.filter.Q.setTargetAtTime(data.Q ?? 1.4, currentTime, 0.03);
      weirdMachine.shaper.curve = buildSaturatorCurve(Math.max(1, data.drive ?? 2.2));
      weirdMachine.output.gain.setTargetAtTime(data.gain ?? 0.22, currentTime, 0.03);
      weirdMachine.carrier.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      weirdMachine.harmonic.type = data.modType ?? 'square';
      weirdMachine.syncDivision = syncDivision;
      weirdMachine.steps = Array.from({ length: 8 }, (_, index) => data.steps?.[index] ?? weirdMachine.steps[index] ?? (index % 2 === 0));
      return true;
    }
    case 'chaosShrine': {
      const chaosShrine = chaosShrines.get(id);
      if (!chaosShrine) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      const frequency = data.frequency ?? 110;
      const texture = Math.max(0, Math.min(1, data.texture ?? 0.55));
      const chaos = Math.max(0, Math.min(1, data.chaos ?? 0.72));
      const blend = Math.max(0, Math.min(1, data.blend ?? 0.58));
      const spread = data.spread ?? 8;
      const detune = data.detune ?? 18;
      const syncDivision = data.syncDivision ?? '1/16';
      const pan = Math.max(-1, Math.min(1, data.pan ?? 0));
      const stereoWidth = Math.max(0, Math.min(1, spread / 24));
      const pulseRate = data.sync
        ? getSyncedLfoFrequency(syncDivision, transportState.bpm)
        : data.rate ?? 2.5;

      chaosShrine.carrier.frequency.setTargetAtTime(frequency, currentTime, 0.03);
      chaosShrine.sub.frequency.setTargetAtTime(Math.max(18, frequency / 2), currentTime, 0.03);
      chaosShrine.shimmer.frequency.setTargetAtTime(
        frequency * (1.48 + spread / 24 + texture * 0.55),
        currentTime,
        0.03,
      );
      chaosShrine.shimmer.detune.setTargetAtTime(detune * (0.8 + chaos * 0.8), currentTime, 0.03);
      chaosShrine.modulator.frequency.setTargetAtTime(data.modFrequency ?? 72, currentTime, 0.03);
      chaosShrine.fmGain.gain.setTargetAtTime((data.modAmount ?? 140) * (0.65 + chaos * 0.6), currentTime, 0.03);
      chaosShrine.motionLfo.frequency.setTargetAtTime(pulseRate, currentTime, 0.03);
      chaosShrine.motionDepth.gain.setTargetAtTime(
        data.freeze
          ? 0
          : Math.max(0, Math.min(0.46, 0.08 + (data.depth ?? 1100) / 3600)),
        currentTime,
        0.03,
      );
      chaosShrine.motionBias.offset.setTargetAtTime(0.7 - chaos * 0.18, currentTime, 0.03);
      chaosShrine.noiseGain.gain.setTargetAtTime(0.03 + texture * 0.22 + chaos * 0.08, currentTime, 0.03);
      chaosShrine.carrierGain.gain.setTargetAtTime(0.28 + (1 - blend) * 0.36, currentTime, 0.03);
      chaosShrine.subGain.gain.setTargetAtTime(0.16 + (1 - blend) * 0.22, currentTime, 0.03);
      chaosShrine.shimmerGain.gain.setTargetAtTime(0.08 + blend * 0.42 + texture * 0.1, currentTime, 0.03);
      chaosShrine.filter.type = 'bandpass';
      chaosShrine.filter.frequency.setTargetAtTime(data.tone ?? 900, currentTime, 0.03);
      chaosShrine.filter.Q.setTargetAtTime(data.Q ?? 4.5, currentTime, 0.03);
      chaosShrine.colorFilter.type = 'lowpass';
      chaosShrine.colorFilter.frequency.setTargetAtTime((data.tone ?? 900) * (1.8 + texture), currentTime, 0.03);
      chaosShrine.colorFilter.Q.setTargetAtTime(0.8 + chaos * 2.4, currentTime, 0.03);
      chaosShrine.shaper.curve = buildSaturatorCurve(Math.max(1, data.drive ?? 2.8));
      chaosShrine.leftDelay.delayTime.setTargetAtTime(0.0008 + stereoWidth * 0.003, currentTime, 0.03);
      chaosShrine.rightDelay.delayTime.setTargetAtTime(0.004 + stereoWidth * 0.011, currentTime, 0.03);
      chaosShrine.leftPan.pan.setTargetAtTime(Math.max(-1, pan - stereoWidth * 0.8), currentTime, 0.03);
      chaosShrine.rightPan.pan.setTargetAtTime(Math.min(1, pan + stereoWidth * 0.8), currentTime, 0.03);
      chaosShrine.output.gain.setTargetAtTime(data.gain ?? 0.24, currentTime, 0.03);
      chaosShrine.carrier.type = (data.type as OscillatorType | undefined) ?? 'sawtooth';
      chaosShrine.shimmer.type = data.modType ?? 'triangle';
      chaosShrine.syncDivision = syncDivision;
      chaosShrine.steps = Array.from(
        { length: 16 },
        (_, index) => data.steps?.[index] ?? chaosShrine.steps[index] ?? index % 3 !== 1,
      );
      return true;
    }
    default:
      return false;
  }
};
