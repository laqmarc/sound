import type { Edge } from 'reactflow';
import type { SoundFlowNode } from '../../types';

const pitchSources = new Set(['arpeggiator', 'arp2']);
const pitchTargets = new Set([
  'oscillator',
  'dualOsc',
  'leadVoice',
  'monoSynth',
  'fmSynth',
  'subOsc',
  'weirdMachine',
  'chaosShrine',
]);
const sourceOnly = new Set([
  'oscillator',
  'dualOsc',
  'dronePad',
  'bassline',
  'leadVoice',
  'sampler',
  'daftVoice',
  'noise',
  'monoSynth',
  'fmSynth',
  'subOsc',
  'noiseLayer',
  'weirdMachine',
  'chaosShrine',
  'chordGenerator',
  'drumMachine',
  'drum2',
  'kickSynth',
  'snareSynth',
  'hiHatSynth',
  'arpeggiator',
  'arp2',
  'lfo',
  'clockDivider',
  'randomCv',
  'cvOffset',
  'chordSeq',
]);
const controlSources = new Set([
  'lfo',
  'clockDivider',
  'randomCv',
  'cvOffset',
  'sampleHold',
  'envelopeFollower',
  'quantizer',
  'comparator',
  'lag',
]);

export interface InputPort {
  id: string | null;
  label: string;
}

// These are the handles supported by the existing audio graph, not screen coordinates.
export function inputPorts(
  source: SoundFlowNode,
  target: SoundFlowNode,
): InputPort[] {
  if (source.id === target.id || source.type === 'destination') return [];
  if (pitchSources.has(source.type ?? '')) {
    return pitchTargets.has(target.type ?? '')
      ? [{ id: 'pitch', label: 'Notes · Pitch' }]
      : [];
  }
  const ports: InputPort[] = [];
  if (target.type === 'mixer') {
    for (let channel = 1; channel <= 8; channel++)
      ports.push({ id: `ch${channel}`, label: `Canal ${channel}` });
  } else if (target.type === 'vocoder') {
    ports.push({ id: 'carrier', label: 'So portador · Carrier' });
  } else if (target.type && !sourceOnly.has(target.type)) {
    ports.push({
      id: null,
      label:
        target.type === 'destination'
          ? 'Sortida principal'
          : 'Entrada de senyal',
    });
  }
  if (
    controlSources.has(source.type ?? '') &&
    ['oscillator', 'filter', 'gain'].includes(target.type ?? '')
  ) {
    ports.push({ id: 'mod', label: 'Modulació · Mod' });
  }
  return ports;
}

export function canConnect(
  source: SoundFlowNode,
  target: SoundFlowNode,
  handle: string | null,
  edges: Edge[],
) {
  return (
    inputPorts(source, target).some((port) => port.id === handle) &&
    !edges.some(
      (edge) =>
        edge.source === source.id &&
        edge.target === target.id &&
        (edge.targetHandle ?? null) === handle,
    )
  );
}
