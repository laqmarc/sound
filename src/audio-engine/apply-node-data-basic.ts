import type { EditableAudioNodeType, SoundNodeData } from '../types';
import type { AudioParamName, AudioParamValue } from './runtime';

import {
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
  updateNodeParam: UpdateNodeParam,
) => {
  nodeConfigs.set(id, {
    type,
    data: { ...data },
  });

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

        reverb.preDelay.delayTime.setTargetAtTime(preDelay, ctx.currentTime, 0.03);
        reverb.tone.frequency.setTargetAtTime(tone, ctx.currentTime, 0.03);
        reverb.dry.gain.setTargetAtTime(1 - mix, ctx.currentTime, 0.03);
        reverb.wet.gain.setTargetAtTime(mix, ctx.currentTime, 0.03);
        reverb.convolver.buffer = buildImpulseResponse(
          ctx,
          0.9 + roomSize * 5.1,
          decay,
        );
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
    case 'mixer':
      updateIfDefined(updateNodeParam, `${id}_ch1_low`, 'gain', data.ch1_low);
      updateIfDefined(updateNodeParam, `${id}_ch1_mid`, 'gain', data.ch1_mid);
      updateIfDefined(updateNodeParam, `${id}_ch1_high`, 'gain', data.ch1_high);
      updateIfDefined(updateNodeParam, `${id}_ch1_pan`, 'pan', data.ch1_pan);
      updateIfDefined(updateNodeParam, `${id}_ch1_gain`, 'gain', data.ch1_mute ? 0 : data.ch1);
      updateIfDefined(updateNodeParam, `${id}_ch2_low`, 'gain', data.ch2_low);
      updateIfDefined(updateNodeParam, `${id}_ch2_mid`, 'gain', data.ch2_mid);
      updateIfDefined(updateNodeParam, `${id}_ch2_high`, 'gain', data.ch2_high);
      updateIfDefined(updateNodeParam, `${id}_ch2_pan`, 'pan', data.ch2_pan);
      updateIfDefined(updateNodeParam, `${id}_ch2_gain`, 'gain', data.ch2_mute ? 0 : data.ch2);
      updateIfDefined(updateNodeParam, `${id}_ch3_low`, 'gain', data.ch3_low);
      updateIfDefined(updateNodeParam, `${id}_ch3_mid`, 'gain', data.ch3_mid);
      updateIfDefined(updateNodeParam, `${id}_ch3_high`, 'gain', data.ch3_high);
      updateIfDefined(updateNodeParam, `${id}_ch3_pan`, 'pan', data.ch3_pan);
      updateIfDefined(updateNodeParam, `${id}_ch3_gain`, 'gain', data.ch3_mute ? 0 : data.ch3);
      updateIfDefined(updateNodeParam, `${id}_ch4_low`, 'gain', data.ch4_low);
      updateIfDefined(updateNodeParam, `${id}_ch4_mid`, 'gain', data.ch4_mid);
      updateIfDefined(updateNodeParam, `${id}_ch4_high`, 'gain', data.ch4_high);
      updateIfDefined(updateNodeParam, `${id}_ch4_pan`, 'pan', data.ch4_pan);
      updateIfDefined(updateNodeParam, `${id}_ch4_gain`, 'gain', data.ch4_mute ? 0 : data.ch4);
      return true;
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
