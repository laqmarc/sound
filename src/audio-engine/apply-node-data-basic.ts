import type { EditableAudioNodeType, SoundNodeData } from '../types';
import type { AudioParamName, AudioParamValue } from './runtime';

import { nodeConfigs, transportState, getSyncedDurationSeconds, getSyncedLfoFrequency } from './runtime';

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
      updateIfDefined(updateNodeParam, id, 'decay', data.decay);
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
      updateIfDefined(updateNodeParam, `${id}_ch1`, 'gain', data.ch1);
      updateIfDefined(updateNodeParam, `${id}_ch2`, 'gain', data.ch2);
      updateIfDefined(updateNodeParam, `${id}_ch3`, 'gain', data.ch3);
      updateIfDefined(updateNodeParam, `${id}_ch4`, 'gain', data.ch4);
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
