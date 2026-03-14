import type { Node, NodeProps } from 'reactflow';

export const editableNodeTypes = [
  'oscillator',
  'dualOsc',
  'dronePad',
  'bassline',
  'leadVoice',
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
  'cvOffset',
  'envelopeFollower',
  'quantizer',
  'comparator',
  'lag',
  'chordSeq',
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
  'stutter',
  'humanizer',
  'triggerDelay',
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
  'arp2',
  'equalizer8',
  'phaser',
  'fmSynth',
  'subOsc',
  'noiseLayer',
  'weirdMachine',
  'chaosShrine',
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
  ch1_low?: number;
  ch1_mid?: number;
  ch1_high?: number;
  ch1_pan?: number;
  ch1_mute?: boolean;
  ch2_low?: number;
  ch2_mid?: number;
  ch2_high?: number;
  ch2_pan?: number;
  ch2_mute?: boolean;
  ch3_low?: number;
  ch3_mid?: number;
  ch3_high?: number;
  ch3_pan?: number;
  ch3_mute?: boolean;
  ch4_low?: number;
  ch4_mid?: number;
  ch4_high?: number;
  ch4_pan?: number;
  ch4_mute?: boolean;
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
  arp2Steps?: ArpStep[];
  arpMode?: ArpMode;
  arpScale?: ArpScale;
  arpLength?: number;
  arpOctaveSpan?: number;
  arpTranspose?: number;
  arpChance?: number;
  arpRatchet?: number;
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
  texture?: number;
  chaos?: number;
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
  roomSize?: number;
  morph?: number;
  sceneA?: ShrineScene;
  sceneB?: ShrineScene;
  minValue?: number;
  maxValue?: number;
  divider?: number;
  sustain?: number;
  grainSize?: number;
  spray?: number;
  offset?: number;
  glide?: number;
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
export type ShrineScene = 'nebula' | 'razor' | 'swarm' | 'ritual';

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
