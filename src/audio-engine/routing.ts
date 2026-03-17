import { arp2Targets, arpeggiatorTargets, audioContext, getDestinationInput, nodeConfigs, nodes } from './runtime';

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

  if (targetHandleId === 'carrier') {
    return nodes.get(`${targetId}_carrier`) ?? nodes.get(targetId);
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

const isPitchSequencerConnection = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  const sourceConfig = nodeConfigs.get(sourceId);
  const targetConfig = nodeConfigs.get(targetId);

  return (
    (sourceConfig?.type === 'arpeggiator' || sourceConfig?.type === 'arp2') &&
    targetHandleId === 'pitch' &&
    targetConfig !== undefined &&
    PITCH_TARGET_TYPES.includes(targetConfig.type as (typeof PITCH_TARGET_TYPES)[number])
  );
};

const resolvePitchSequencerTargets = (sourceId: string) => {
  const sourceType = nodeConfigs.get(sourceId)?.type;

  if (sourceType === 'arpeggiator') {
    return arpeggiatorTargets;
  }

  if (sourceType === 'arp2') {
    return arp2Targets;
  }

  return null;
};

export const connectAudioGraphNodes = (
  sourceId: string,
  targetId: string,
  targetHandleId?: string | null,
) => {
  if (isPitchSequencerConnection(sourceId, targetId, targetHandleId)) {
    const targetStore = resolvePitchSequencerTargets(sourceId);
    if (!targetStore) {
      return;
    }

    let targets = targetStore.get(sourceId);
    if (!targets) {
      targets = new Set<string>();
      targetStore.set(sourceId, targets);
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
  if (isPitchSequencerConnection(sourceId, targetId, targetHandleId)) {
    resolvePitchSequencerTargets(sourceId)?.get(sourceId)?.delete(targetId);
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
