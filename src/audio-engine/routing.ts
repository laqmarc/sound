import { audioContext, arpeggiatorTargets, getDestinationInput, nodeConfigs, nodes } from './runtime';

const PITCH_TARGET_TYPES = [
  'oscillator',
  'dualOsc',
  'leadVoice',
  'monoSynth',
  'fmSynth',
  'subOsc',
  'weirdMachine',
  'chaosShrine',
] as const;

const resolveTarget = (
  targetId: string,
  targetHandleId?: string | null,
): AudioNode | AudioParam | AudioDestinationNode | undefined => {
  if (!audioContext) {
    return undefined;
  }

  if (targetId === 'destination') {
    return getDestinationInput();
  }

  if (targetHandleId?.startsWith('ch')) {
    return nodes.get(`${targetId}_${targetHandleId}`);
  }

  if (targetHandleId === 'mod') {
    const targetNode = nodes.get(targetId);

    if (targetNode instanceof OscillatorNode || targetNode instanceof BiquadFilterNode) {
      return targetNode.frequency;
    }

    if (targetNode instanceof GainNode) {
      return targetNode.gain;
    }

    if (targetNode instanceof StereoPannerNode) {
      return targetNode.pan;
    }
  }

  return nodes.get(targetId);
};

const resolveSource = (sourceId: string) => {
  return nodes.get(`${sourceId}_out`) ?? nodes.get(`${sourceId}_gain`) ?? nodes.get(sourceId);
};

const isArpeggiatorPitchConnection = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  const sourceConfig = nodeConfigs.get(sourceId);
  const targetConfig = nodeConfigs.get(targetId);

  return (
    sourceConfig?.type === 'arpeggiator' &&
    targetHandleId === 'pitch' &&
    targetConfig !== undefined &&
    PITCH_TARGET_TYPES.includes(targetConfig.type as (typeof PITCH_TARGET_TYPES)[number])
  );
};

export const connectAudioGraphNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  if (isArpeggiatorPitchConnection(sourceId, targetId, targetHandleId)) {
    let targets = arpeggiatorTargets.get(sourceId);
    if (!targets) {
      targets = new Set<string>();
      arpeggiatorTargets.set(sourceId, targets);
    }
    targets.add(targetId);
    return;
  }

  const source = resolveSource(sourceId);
  const target = resolveTarget(targetId, targetHandleId);

  if (!source || !target) {
    return;
  }

  try {
    if (target instanceof AudioParam) {
      source.connect(target);
    } else {
      source.connect(target);
    }
  } catch {
    // Ignore invalid connections between unsupported node types.
  }
};

export const disconnectAudioGraphNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  if (isArpeggiatorPitchConnection(sourceId, targetId, targetHandleId)) {
    arpeggiatorTargets.get(sourceId)?.delete(targetId);
    return;
  }

  const source = resolveSource(sourceId);
  const target = resolveTarget(targetId, targetHandleId);

  if (!source || !target) {
    return;
  }

  try {
    if (target instanceof AudioParam) {
      source.disconnect(target);
    } else {
      source.disconnect(target);
    }
  } catch {
    // Ignore disconnects for links that no longer exist.
  }
};
