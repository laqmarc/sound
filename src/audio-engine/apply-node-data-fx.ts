import type { EditableAudioNodeType, SoundNodeData } from '../types';
import {
  autoFilters,
  autoPans,
  bitcrushers,
  buildFoldbackCurve,
  buildSaturatorCurve,
  cabSims,
  channelStrips,
  choruses,
  combFilters,
  comparators,
  compressors,
  equalizers,
  flangers,
  foldbacks,
  freezeFxs,
  getAudioContext,
  getSyncedDurationSeconds,
  getSyncedLfoFrequency,
  granulars,
  humanizers,
  lags,
  limiters,
  loopers,
  phasers,
  quantizers,
  resonators,
  ringMods,
  sampleHolds,
  saturators,
  spectralDelays,
  stereoWideners,
  stutters,
  tiltEqs,
  transientShapers,
  transportState,
  tremolos,
  triggerDelays,
  vibratos,
  wahs,
} from './runtime';

export const applyFxNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
) => {
  switch (type) {
    case 'channelStrip': {
      const channelStrip = channelStrips.get(id);
      if (!channelStrip) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      const gateThreshold = data.gateThreshold ?? -72;
      const thresholdLinear = gateThreshold <= -72 ? 0 : Math.pow(10, gateThreshold / 20);
      const bandGains = [
        data.band1Gain ?? 0,
        data.band2Gain ?? 0,
        data.band3Gain ?? 0,
        data.band4Gain ?? 0,
      ];
      const bandQs = [
        data.band1Q ?? 0.7,
        data.band2Q ?? 0.9,
        data.band3Q ?? 1.1,
        data.band4Q ?? 0.7,
      ];

      channelStrip.highpass.frequency.setTargetAtTime(data.highpassFrequency ?? 30, currentTime, 0.03);
      channelStrip.lowpass.frequency.setTargetAtTime(data.lowpassFrequency ?? 18000, currentTime, 0.03);
      channelStrip.gateParams.threshold = thresholdLinear;
      channelStrip.gateThreshold?.setTargetAtTime(thresholdLinear, currentTime, 0.02);
      channelStrip.compressor.threshold.setTargetAtTime(data.threshold ?? -24, currentTime, 0.03);
      channelStrip.compressor.knee.setTargetAtTime(data.knee ?? 18, currentTime, 0.03);
      channelStrip.compressor.ratio.setTargetAtTime(data.ratio ?? 4, currentTime, 0.03);
      channelStrip.compressor.attack.setTargetAtTime(data.attack ?? 0.01, currentTime, 0.03);
      channelStrip.compressor.release.setTargetAtTime(data.release ?? 0.2, currentTime, 0.03);
      channelStrip.makeup.gain.setTargetAtTime(data.makeup ?? 1, currentTime, 0.03);

      channelStrip.bands.forEach((band, index) => {
        band.gain.setTargetAtTime(bandGains[index] ?? 0, currentTime, 0.03);
        band.Q.setTargetAtTime(bandQs[index] ?? 0.8, currentTime, 0.03);
      });
      return true;
    }
    case 'compressor': {
      const compressor = compressors.get(id);
      if (!compressor) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      compressor.compressor.threshold.setTargetAtTime(data.threshold ?? -24, currentTime, 0.03);
      compressor.compressor.knee.setTargetAtTime(data.knee ?? 18, currentTime, 0.03);
      compressor.compressor.ratio.setTargetAtTime(data.ratio ?? 6, currentTime, 0.03);
      compressor.compressor.attack.setTargetAtTime(data.attack ?? 0.01, currentTime, 0.03);
      compressor.compressor.release.setTargetAtTime(data.release ?? 0.25, currentTime, 0.03);
      compressor.makeup.gain.setTargetAtTime(data.makeup ?? 1, currentTime, 0.03);
      return true;
    }
    case 'chorus': {
      const chorus = choruses.get(id);
      if (!chorus) {
        return true;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.8);
      const depth = data.depth ?? 0.012;
      const delayTime = data.delay ?? 0.02;
      const mix = data.mix ?? 0.45;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      chorus.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      chorus.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      chorus.delay.delayTime.setTargetAtTime(delayTime, currentTime, 0.03);
      chorus.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      chorus.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'equalizer8': {
      const equalizer = equalizers.get(id);
      if (!equalizer) {
        return true;
      }

      const bands = data.eqBands ?? [];
      equalizer.filters.forEach((filter, index) => {
        const bandGain = bands[index] ?? 0;
        filter.gain.setTargetAtTime(bandGain, getAudioContext().currentTime, 0.03);
      });
      return true;
    }
    case 'phaser': {
      const phaser = phasers.get(id);
      if (!phaser) {
        return true;
      }

      const rate = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : (data.rate ?? 0.6);
      const depth = data.depth ?? 800;
      const feedback = data.feedback ?? 0.35;
      const mix = data.mix ?? 0.5;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      phaser.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      phaser.lfoGain.gain.setTargetAtTime(depth, currentTime, 0.03);
      phaser.feedbackGain.gain.setTargetAtTime(feedback, currentTime, 0.03);
      phaser.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      phaser.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'bitcrusher': {
      const bitcrusher = bitcrushers.get(id);
      if (!bitcrusher) {
        return true;
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
      return true;
    }
    case 'flanger': {
      const flanger = flangers.get(id);
      if (!flanger) {
        return true;
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
      return true;
    }
    case 'limiter': {
      const limiter = limiters.get(id);
      if (!limiter) {
        return true;
      }

      const currentTime = getAudioContext().currentTime;
      limiter.compressor.threshold.setTargetAtTime(data.threshold ?? -6, currentTime, 0.03);
      limiter.compressor.release.setTargetAtTime(data.release ?? 0.08, currentTime, 0.03);
      limiter.makeup.gain.setTargetAtTime(data.makeup ?? 1, currentTime, 0.03);
      return true;
    }
    case 'looper': {
      const looper = loopers.get(id);
      if (!looper) {
        return true;
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
      return true;
    }
    case 'tremolo': {
      const tremolo = tremolos.get(id);
      if (!tremolo) {
        return true;
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
      return true;
    }
    case 'ringMod': {
      const ringMod = ringMods.get(id);
      if (!ringMod) {
        return true;
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
      return true;
    }
    case 'vibrato': {
      const vibrato = vibratos.get(id);
      if (!vibrato) {
        return true;
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
      return true;
    }
    case 'combFilter': {
      const combFilter = combFilters.get(id);
      if (!combFilter) {
        return true;
      }

      const delayTime = data.delay ?? 0.015;
      const feedback = data.feedback ?? 0.65;
      const mix = data.mix ?? 0.7;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      combFilter.delay.delayTime.setTargetAtTime(delayTime, currentTime, 0.03);
      combFilter.feedbackGain.gain.setTargetAtTime(feedback, currentTime, 0.03);
      combFilter.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      combFilter.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'autoPan': {
      const autoPan = autoPans.get(id);
      if (!autoPan) {
        return true;
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
      return true;
    }
    case 'autoFilter': {
      const autoFilter = autoFilters.get(id);
      if (!autoFilter) {
        return true;
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
      return true;
    }
    case 'sampleHold': {
      const sampleHold = sampleHolds.get(id);
      if (!sampleHold) {
        return true;
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
      return true;
    }
    case 'quantizer': {
      const quantizer = quantizers.get(id);
      if (!quantizer) {
        return true;
      }

      const steps = Math.max(2, Math.round(data.divider ?? 12));
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;
      quantizer.params.steps = steps;
      quantizer.params.mix = mix;
      quantizer.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      quantizer.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'comparator': {
      const comparator = comparators.get(id);
      if (!comparator) {
        return true;
      }

      comparator.params.threshold = data.threshold ?? 0;
      return true;
    }
    case 'lag': {
      const lag = lags.get(id);
      if (!lag) {
        return true;
      }

      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;
      lag.params.rise = data.attack ?? 0.02;
      lag.params.fall = data.release ?? 0.08;
      lag.params.mix = mix;
      lag.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      lag.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'resonator': {
      const resonator = resonators.get(id);
      if (!resonator) {
        return true;
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
      return true;
    }
    case 'wah': {
      const wah = wahs.get(id);
      if (!wah) {
        return true;
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
      return true;
    }
    case 'stereoWidener': {
      const stereoWidener = stereoWideners.get(id);
      if (!stereoWidener) {
        return true;
      }

      const delayTime = Math.max(0.001, Math.min(0.03, data.delay ?? 0.012));
      const spread = Math.max(0, Math.min(2, data.spread ?? 1));
      const mix = data.mix ?? 0.65;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      stereoWidener.delayLeft.delayTime.setTargetAtTime(delayTime, currentTime, 0.03);
      stereoWidener.delayRight.delayTime.setTargetAtTime(
        Math.max(0.001, Math.min(0.05, delayTime * (1 + spread * 0.5))),
        currentTime,
        0.03,
      );
      stereoWidener.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      stereoWidener.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'foldback': {
      const foldback = foldbacks.get(id);
      if (!foldback) {
        return true;
      }

      const drive = data.drive ?? 2.2;
      const threshold = data.threshold ?? 0.55;
      const mix = data.mix ?? 0.75;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      foldback.shaper.curve = buildFoldbackCurve(drive, threshold);
      foldback.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      foldback.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'tiltEq': {
      const tiltEq = tiltEqs.get(id);
      if (!tiltEq) {
        return true;
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
      return true;
    }
    case 'saturator': {
      const saturator = saturators.get(id);
      if (!saturator) {
        return true;
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
      return true;
    }
    case 'cabSim': {
      const cabSim = cabSims.get(id);
      if (!cabSim) {
        return true;
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
      return true;
    }
    case 'transientShaper': {
      const transientShaper = transientShapers.get(id);
      if (!transientShaper) {
        return true;
      }

      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      transientShaper.params.attack = data.attack ?? 0.7;
      transientShaper.params.sustain = data.sustain ?? 0;
      transientShaper.params.mix = mix;
      transientShaper.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      transientShaper.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'freezeFx': {
      const freezeFx = freezeFxs.get(id);
      if (!freezeFx) {
        return true;
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
      return true;
    }
    case 'spectralDelay': {
      const spectralDelay = spectralDelays.get(id);
      if (!spectralDelay) {
        return true;
      }

      const baseDelay = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : Math.max(0.02, Math.min(0.8, data.delayTime ?? 0.18));
      const spread = Math.max(0, Math.min(1, data.spread ?? 0.45));
      const texture = Math.max(0, Math.min(1, data.texture ?? 0.55));
      const feedback = Math.max(0, Math.min(0.92, data.feedback ?? 0.42));
      const mix = Math.max(0, Math.min(1, data.mix ?? 0.72));
      const dryMix = 1 - mix;
      const tone = Math.max(180, Math.min(5200, data.tone ?? 1600));
      const currentTime = getAudioContext().currentTime;
      const bandMultipliers = [
        0.35 + spread * 0.25,
        0.7 + spread * 0.45,
        1.15 + spread * 0.75,
        1.75 + spread * 1.1,
      ];
      const frequencies = [
        Math.max(120, tone * (0.45 + texture * 0.12)),
        Math.max(220, tone * (0.8 + texture * 0.1)),
        Math.max(680, tone * (1.55 + spread * 0.35 + texture * 0.08)),
        Math.max(1800, tone * (2.7 + spread * 0.85)),
      ];
      const q = 0.8 + texture * 9;

      spectralDelay.filters[0]?.frequency.setTargetAtTime(frequencies[0], currentTime, 0.03);
      spectralDelay.filters[0]?.Q.setTargetAtTime(0.7 + texture * 1.8, currentTime, 0.03);
      spectralDelay.filters[1]?.frequency.setTargetAtTime(frequencies[1], currentTime, 0.03);
      spectralDelay.filters[1]?.Q.setTargetAtTime(q * 0.75, currentTime, 0.03);
      spectralDelay.filters[2]?.frequency.setTargetAtTime(frequencies[2], currentTime, 0.03);
      spectralDelay.filters[2]?.Q.setTargetAtTime(q, currentTime, 0.03);
      spectralDelay.filters[3]?.frequency.setTargetAtTime(frequencies[3], currentTime, 0.03);
      spectralDelay.filters[3]?.Q.setTargetAtTime(0.7 + texture * 1.2, currentTime, 0.03);

      spectralDelay.delays.forEach((delay, index) => {
        delay.delayTime.setTargetAtTime(Math.min(1.2, baseDelay * bandMultipliers[index]), currentTime, 0.03);
      });
      spectralDelay.feedbackGains.forEach((feedbackGain, index) => {
        feedbackGain.gain.setTargetAtTime(
          Math.max(0, Math.min(0.94, feedback * (0.85 + index * 0.06 + texture * 0.08))),
          currentTime,
          0.03,
        );
      });
      spectralDelay.panners.forEach((panner, index) => {
        const panBase = [-0.85, -0.3, 0.3, 0.85][index] ?? 0;
        panner.pan.setTargetAtTime(panBase * (0.35 + spread * 0.65), currentTime, 0.03);
      });
      spectralDelay.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      spectralDelay.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'granular': {
      const granular = granulars.get(id);
      if (!granular) {
        return true;
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
      return true;
    }
    case 'stutter': {
      const stutter = stutters.get(id);
      if (!stutter) {
        return true;
      }

      const repeatLength = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : (data.loopLength ?? 0.12);
      const mix = data.mix ?? 0.8;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      stutter.params.lengthSamples = Math.max(1, Math.floor(getAudioContext().sampleRate * repeatLength));
      stutter.params.mix = mix;
      stutter.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      stutter.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'humanizer': {
      const humanizer = humanizers.get(id);
      if (!humanizer) {
        return true;
      }

      const rate = data.rate ?? 2;
      const depth = data.depth ?? 0.35;
      const mix = data.mix ?? 0.7;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      humanizer.delay.delayTime.setTargetAtTime(0.008 + depth * 0.01, currentTime, 0.03);
      humanizer.lfo.frequency.setTargetAtTime(rate, currentTime, 0.03);
      humanizer.lfoGain.gain.setTargetAtTime(depth * 0.008, currentTime, 0.03);
      humanizer.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      humanizer.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    case 'triggerDelay': {
      const triggerDelay = triggerDelays.get(id);
      if (!triggerDelay) {
        return true;
      }

      const delayTime = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/16', transportState.bpm)
        : (data.delayTime ?? 0.08);
      const mix = data.mix ?? 1;
      const dryMix = 1 - mix;
      const currentTime = getAudioContext().currentTime;

      triggerDelay.delay.delayTime.setTargetAtTime(delayTime, currentTime, 0.03);
      triggerDelay.dry.gain.setTargetAtTime(dryMix, currentTime, 0.03);
      triggerDelay.wet.gain.setTargetAtTime(mix, currentTime, 0.03);
      return true;
    }
    default:
      return false;
  }
};
