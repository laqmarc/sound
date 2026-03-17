import type { EditableAudioNodeType, SoundNodeData } from '../types';
import type { AudioParamName, AudioParamValue } from './runtime';

import {
  mixers,
  nodeConfigs,
  reverbs,
  transportState,
  getAudioContext,
  getSyncedDurationSeconds,
  getSyncedLfoFrequency,
  buildImpulseResponse,
} from './runtime';

type UpdateNodeParam = (
  id: string,
  param: AudioParamName,
  value: AudioParamValue,
) => void;

const updateIfDefined = (
  updateNodeParam: UpdateNodeParam,
  id: string,
  param: AudioParamName,
  value: AudioParamValue | undefined,
) => {
  if (value === undefined) {
    return;
  }

  updateNodeParam(id, param, value);
};

export const applyBasicNodeData = (
  type: EditableAudioNodeType,
  id: string,
  data: SoundNodeData,
  changedData: Partial<SoundNodeData>,
  updateNodeParam: UpdateNodeParam,
) => {
  nodeConfigs.set(id, {
    type,
    data: { ...data },
  });

  const hasChanged = (...keys: Array<keyof SoundNodeData>) => {
    return keys.some((key) => changedData[key] !== undefined);
  };

  switch (type) {
    case 'gain':
      updateIfDefined(updateNodeParam, id, 'gain', data.gain);
      return true;
    case 'filter':
      updateIfDefined(updateNodeParam, id, 'frequency', data.frequency);
      updateIfDefined(updateNodeParam, id, 'type', data.type);
      updateIfDefined(updateNodeParam, id, 'Q', data.Q);
      return true;
    case 'delay': {
      const syncedDelayTime = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : data.delayTime;
      updateIfDefined(updateNodeParam, id, 'delayTime', syncedDelayTime);
      return true;
    }
    case 'distortion':
      updateIfDefined(updateNodeParam, id, 'distortion', data.distortion);
      return true;
    case 'reverb':
      {
        const reverb = reverbs.get(id);
        if (!reverb) {
          updateIfDefined(updateNodeParam, id, 'decay', data.decay);
          return true;
        }

        const ctx = getAudioContext();
        const roomSize = Math.max(0.2, Math.min(1, data.roomSize ?? 0.55));
        const decay = Math.max(0.1, data.decay ?? 3);
        const preDelay = Math.max(0, Math.min(0.4, data.delayTime ?? 0.02));
        const tone = Math.max(400, Math.min(12000, data.tone ?? 4800));
        const mix = Math.max(0, Math.min(1, data.mix ?? 0.55));

        if (hasChanged('delayTime')) {
          reverb.preDelay.delayTime.setTargetAtTime(preDelay, ctx.currentTime, 0.03);
        }
        if (hasChanged('tone')) {
          reverb.tone.frequency.setTargetAtTime(tone, ctx.currentTime, 0.03);
        }
        if (hasChanged('mix')) {
          reverb.dry.gain.setTargetAtTime(1 - mix, ctx.currentTime, 0.03);
          reverb.wet.gain.setTargetAtTime(mix, ctx.currentTime, 0.03);
        }
        if (hasChanged('roomSize', 'decay')) {
          reverb.convolver.buffer = buildImpulseResponse(
            ctx,
            0.9 + roomSize * 5.1,
            decay,
          );
        }
      }
      return true;
    case 'panner':
      updateIfDefined(updateNodeParam, id, 'pan', data.pan);
      return true;
    case 'lfo': {
      const syncedFrequency = data.sync
        ? getSyncedLfoFrequency(data.syncDivision ?? '1/4', transportState.bpm)
        : data.frequency;
      updateIfDefined(updateNodeParam, id, 'frequency', syncedFrequency);
      updateIfDefined(updateNodeParam, id, 'type', data.type);
      updateIfDefined(updateNodeParam, `${id}_gain`, 'gain', data.gain);
      return true;
    }
    case 'mixer': {
      const mixer = mixers.get(id);
      if (!mixer) {
        return true;
      }

      const ctx = getAudioContext();
      const roomSize = Math.max(0.2, Math.min(1, data.roomSize ?? 0.58));
      const decay = Math.max(0.3, Math.min(8, data.decay ?? 2.8));
      const delayTime = data.sync
        ? getSyncedDurationSeconds(data.syncDivision ?? '1/8', transportState.bpm)
        : Math.max(0.05, Math.min(0.9, data.delayTime ?? 0.28));
      const feedback = Math.max(0, Math.min(0.92, data.feedback ?? 0.36));
      const tone = Math.max(900, Math.min(12000, data.tone ?? 4800));
      const roomReturn = Math.max(0, Math.min(1, data.roomReturn ?? 0.24));
      const delayReturn = Math.max(0, Math.min(1, data.delayReturn ?? 0.22));
      const soloKeys = Array.from({ length: 8 }, (_, index) => `ch${index + 1}_solo` as keyof SoundNodeData);
      const hasSoloActive = soloKeys.some((key) => Boolean(data[key] ?? false));
      const soloStateChanged = hasChanged(...soloKeys);

      mixer.channels.forEach((channel, index) => {
        const channelNumber = index + 1;
        const prefix = `ch${channelNumber}`;
        const levelKey = prefix as keyof SoundNodeData;
        const lowKey = `${prefix}_low` as keyof SoundNodeData;
        const midKey = `${prefix}_mid` as keyof SoundNodeData;
        const highKey = `${prefix}_high` as keyof SoundNodeData;
        const panKey = `${prefix}_pan` as keyof SoundNodeData;
        const muteKey = `${prefix}_mute` as keyof SoundNodeData;
        const soloKey = `${prefix}_solo` as keyof SoundNodeData;
        const gateKey = `${prefix}_gate` as keyof SoundNodeData;
        const compKey = `${prefix}_comp` as keyof SoundNodeData;
        const roomKey = `${prefix}_room` as keyof SoundNodeData;
        const delayKey = `${prefix}_delay` as keyof SoundNodeData;
        const level = Math.max(0, Math.min(1, Number(data[prefix as keyof SoundNodeData] ?? 0.5)));
        const mute = Boolean(data[muteKey] ?? false);
        const solo = Boolean(data[soloKey] ?? false);
        const gateAmount = Math.max(0, Math.min(1, Number(data[gateKey] ?? 0)));
        const compAmount = Math.max(0, Math.min(1, Number(data[compKey] ?? 0.18)));

        if (hasChanged(lowKey)) {
          channel.low.gain.setTargetAtTime(Number(data[lowKey] ?? 0), ctx.currentTime, 0.03);
        }
        if (hasChanged(midKey)) {
          channel.mid.gain.setTargetAtTime(Number(data[midKey] ?? 0), ctx.currentTime, 0.03);
        }
        if (hasChanged(highKey)) {
          channel.high.gain.setTargetAtTime(Number(data[highKey] ?? 0), ctx.currentTime, 0.03);
        }
        if (hasChanged(panKey)) {
          channel.pan.pan.setTargetAtTime(
            Math.max(-1, Math.min(1, Number(data[panKey] ?? 0))),
            ctx.currentTime,
            0.03,
          );
        }
        if (hasChanged(levelKey, muteKey)) {
          channel.gain.gain.setTargetAtTime(mute ? 0 : level, ctx.currentTime, 0.03);
        }
        if (soloStateChanged) {
          channel.soloGain.gain.setTargetAtTime(hasSoloActive ? (solo ? 1 : 0) : 1, ctx.currentTime, 0.02);
        }
        if (hasChanged(roomKey)) {
          channel.roomSend.gain.setTargetAtTime(
            Math.max(0, Math.min(1, Number(data[roomKey] ?? 0))),
            ctx.currentTime,
            0.03,
          );
        }
        if (hasChanged(delayKey)) {
          channel.delaySend.gain.setTargetAtTime(
            Math.max(0, Math.min(1, Number(data[delayKey] ?? 0))),
            ctx.currentTime,
            0.03,
          );
        }
        if (hasChanged(gateKey)) {
          channel.gateParams.threshold = gateAmount <= 0.001 ? 0 : Math.pow(10, (-72 + gateAmount * 54) / 20);
          channel.gateThreshold?.setTargetAtTime(channel.gateParams.threshold, ctx.currentTime, 0.02);
        }
        if (hasChanged(compKey)) {
          channel.compressor.threshold.setTargetAtTime(-2 - compAmount * 34, ctx.currentTime, 0.03);
          channel.compressor.ratio.setTargetAtTime(1.2 + compAmount * 10.8, ctx.currentTime, 0.03);
          channel.compressor.knee.setTargetAtTime(6 + compAmount * 24, ctx.currentTime, 0.03);
          channel.compressor.attack.setTargetAtTime(0.004 + (1 - compAmount) * 0.02, ctx.currentTime, 0.03);
          channel.compressor.release.setTargetAtTime(0.12 + compAmount * 0.2, ctx.currentTime, 0.03);
        }
      });

      if (hasChanged('roomSize')) {
        mixer.roomPreDelay.delayTime.setTargetAtTime(0.008 + roomSize * 0.03, ctx.currentTime, 0.03);
      }
      if (hasChanged('tone')) {
        mixer.roomTone.frequency.setTargetAtTime(tone, ctx.currentTime, 0.03);
        mixer.delayTone.frequency.setTargetAtTime(Math.max(900, tone * 0.85), ctx.currentTime, 0.03);
      }
      if (hasChanged('roomSize', 'decay')) {
        mixer.roomConvolver.buffer = buildImpulseResponse(ctx, 0.9 + roomSize * 5.2, decay);
      }
      if (hasChanged('roomReturn')) {
        mixer.roomReturn.gain.setTargetAtTime(roomReturn, ctx.currentTime, 0.03);
      }
      if (hasChanged('delayTime', 'sync', 'syncDivision')) {
        mixer.delayNode.delayTime.setTargetAtTime(delayTime, ctx.currentTime, 0.03);
      }
      if (hasChanged('feedback')) {
        mixer.delayFeedback.gain.setTargetAtTime(feedback, ctx.currentTime, 0.03);
      }
      if (hasChanged('delayReturn')) {
        mixer.delayReturn.gain.setTargetAtTime(delayReturn, ctx.currentTime, 0.03);
      }
      return true;
    }
    case 'noise':
    case 'scope':
    case 'vuMeter':
    case 'phaseCorrelator':
    case 'lissajous':
    case 'tuner':
    case 'spectrogram':
      return true;
    default:
      return false;
  }
};
