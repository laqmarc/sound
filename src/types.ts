import type { Node, NodeProps } from 'reactflow';

export const editableNodeTypes = [
  'oscillator',
  'dualOsc',
  'gain',
  'filter',
  'delay',
  'noise',
  'distortion',
  'reverb',
  'compressor',
  'chorus',
  'bitcrusher',
  'flanger',
  'limiter',
  'looper',
  'tremolo',
  'ringMod',
  'vibrato',
  'combFilter',
  'autoPan',
  'autoFilter',
  'clockDivider',
  'randomCv',
  'sampleHold',
  'gateSeq',
  'resonator',
  'wah',
  'stereoWidener',
  'foldback',
  'tiltEq',
  'saturator',
  'cabSim',
  'transientShaper',
  'freezeFx',
  'granular',
  'monoSynth',
  'kickSynth',
  'snareSynth',
  'hiHatSynth',
  'chordGenerator',
  'scope',
  'vuMeter',
  'phaseCorrelator',
  'lissajous',
  'tuner',
  'mixer',
  'spectrogram',
  'panner',
  'lfo',
  'drumMachine',
  'arpeggiator',
  'equalizer8',
  'phaser',
  'fmSynth',
  'subOsc',
  'noiseLayer',
] as const;

export type EditableAudioNodeType = (typeof editableNodeTypes)[number];
export type FlowNodeType = EditableAudioNodeType | 'destination';

export interface SoundNodeData {
  label?: string;
  frequency?: number;
  gain?: number;
  type?: OscillatorType | BiquadFilterType;
  Q?: number;
  delayTime?: number;
  distortion?: number;
  decay?: number;
  pan?: number;
  ch1?: number;
  ch2?: number;
  ch3?: number;
  ch4?: number;
  label_ch1?: string;
  label_ch2?: string;
  label_ch3?: string;
  label_ch4?: string;
  bpm?: number;
  drumPattern?: DrumPattern;
  currentStep?: number;
  sync?: boolean;
  syncDivision?: SyncDivision;
  arpSteps?: ArpStep[];
  arpMode?: ArpMode;
  arpScale?: ArpScale;
  eqBands?: number[];
  rate?: number;
  depth?: number;
  feedback?: number;
  mix?: number;
  threshold?: number;
  knee?: number;
  ratio?: number;
  attack?: number;
  release?: number;
  makeup?: number;
  delay?: number;
  bits?: number;
  normFreq?: number;
  modFrequency?: number;
  modAmount?: number;
  modType?: OscillatorType;
  subOctave?: number;
  tone?: number;
  loopLength?: number;
  freeze?: boolean;
  steps?: boolean[];
  note?: NoteName;
  octave?: number;
  chordType?: ChordType;
  spread?: number;
  drive?: number;
  detune?: number;
  blend?: number;
  tilt?: number;
  minValue?: number;
  maxValue?: number;
  divider?: number;
  sustain?: number;
  grainSize?: number;
  spray?: number;
}

export interface DrumPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
}

export type SyncDivision = '1/1' | '1/2' | '1/4' | '1/8' | '1/16';
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type ArpMode = 'up' | 'down' | 'random';
export type ArpScale = 'chromatic' | 'major' | 'minor' | 'pentatonic';
export type ChordType = 'major' | 'minor' | 'sus2' | 'sus4' | 'dim';

export interface ArpStep {
  note: NoteName;
  octave: number;
  enabled: boolean;
}

export type SoundFlowNode = Node<SoundNodeData, FlowNodeType>;
export type SoundNodeProps = NodeProps<SoundNodeData>;

export interface ControllableSoundNodeProps extends SoundNodeProps {
  onDataChange: (id: string, patch: Partial<SoundNodeData>) => void;
}
