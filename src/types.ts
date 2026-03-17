import type { Node, NodeProps } from 'reactflow';

export const editableNodeTypes = [
  'oscillator',
  'dualOsc',
  'dronePad',
  'bassline',
  'leadVoice',
  'sampler',
  'vocoder',
  'gain',
  'filter',
  'delay',
  'spectralDelay',
  'noise',
  'distortion',
  'reverb',
  'channelStrip',
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
  'drum2',
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
  sampleDataUrl?: string;
  sampleName?: string;
  playbackRate?: number;
  vocoderSource?: VocoderSource;
  micEnabled?: boolean;
  bands?: number;
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
  ch5?: number;
  ch6?: number;
  ch7?: number;
  ch8?: number;
  ch1_low?: number;
  ch1_mid?: number;
  ch1_high?: number;
  ch1_pan?: number;
  ch1_mute?: boolean;
  ch1_solo?: boolean;
  ch1_gate?: number;
  ch1_comp?: number;
  ch1_room?: number;
  ch1_delay?: number;
  ch2_low?: number;
  ch2_mid?: number;
  ch2_high?: number;
  ch2_pan?: number;
  ch2_mute?: boolean;
  ch2_solo?: boolean;
  ch2_gate?: number;
  ch2_comp?: number;
  ch2_room?: number;
  ch2_delay?: number;
  ch3_low?: number;
  ch3_mid?: number;
  ch3_high?: number;
  ch3_pan?: number;
  ch3_mute?: boolean;
  ch3_solo?: boolean;
  ch3_gate?: number;
  ch3_comp?: number;
  ch3_room?: number;
  ch3_delay?: number;
  ch4_low?: number;
  ch4_mid?: number;
  ch4_high?: number;
  ch4_pan?: number;
  ch4_mute?: boolean;
  ch4_solo?: boolean;
  ch4_gate?: number;
  ch4_comp?: number;
  ch4_room?: number;
  ch4_delay?: number;
  ch5_low?: number;
  ch5_mid?: number;
  ch5_high?: number;
  ch5_pan?: number;
  ch5_mute?: boolean;
  ch5_solo?: boolean;
  ch5_gate?: number;
  ch5_comp?: number;
  ch5_room?: number;
  ch5_delay?: number;
  ch6_low?: number;
  ch6_mid?: number;
  ch6_high?: number;
  ch6_pan?: number;
  ch6_mute?: boolean;
  ch6_solo?: boolean;
  ch6_gate?: number;
  ch6_comp?: number;
  ch6_room?: number;
  ch6_delay?: number;
  ch7_low?: number;
  ch7_mid?: number;
  ch7_high?: number;
  ch7_pan?: number;
  ch7_mute?: boolean;
  ch7_solo?: boolean;
  ch7_gate?: number;
  ch7_comp?: number;
  ch7_room?: number;
  ch7_delay?: number;
  ch8_low?: number;
  ch8_mid?: number;
  ch8_high?: number;
  ch8_pan?: number;
  ch8_mute?: boolean;
  ch8_solo?: boolean;
  ch8_gate?: number;
  ch8_comp?: number;
  ch8_room?: number;
  ch8_delay?: number;
  label_ch1?: string;
  label_ch2?: string;
  label_ch3?: string;
  label_ch4?: string;
  label_ch5?: string;
  label_ch6?: string;
  label_ch7?: string;
  label_ch8?: string;
  roomReturn?: number;
  delayReturn?: number;
  bpm?: number;
  drumPattern?: DrumPattern;
  drum2Pattern?: Drum2Pattern;
  drum2Length?: number;
  drum2Voices?: Drum2Voices;
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
  gateThreshold?: number;
  highpassFrequency?: number;
  lowpassFrequency?: number;
  band1Gain?: number;
  band1Q?: number;
  band2Gain?: number;
  band2Q?: number;
  band3Gain?: number;
  band3Q?: number;
  band4Gain?: number;
  band4Q?: number;
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
  loop?: boolean;
  mono?: boolean;
  limiterEnabled?: boolean;
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
  triggerNonce?: number;
  stopNonce?: number;
}

export interface DrumPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
}

export type Drum2VoiceId = 'kick' | 'snare' | 'hihat' | 'tom' | 'fx' | 'cymbal';

export interface Drum2Pattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  tom: boolean[];
  fx: boolean[];
  cymbal: boolean[];
}

export interface Drum2VoiceParams {
  tone: number;
  decay: number;
  gain: number;
  shape: number;
}

export type Drum2Voices = Record<Drum2VoiceId, Drum2VoiceParams>;

export type SyncDivision = '1/1' | '1/2' | '1/2.' | '1/4' | '1/4.' | '1/8' | '1/8.' | '1/16' | '1/16.';
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type ArpMode = 'up' | 'down' | 'random';
export type ArpScale = 'chromatic' | 'major' | 'minor' | 'pentatonic';
export type ChordType = 'major' | 'minor' | 'sus2' | 'sus4' | 'dim';
export type ShrineScene = 'nebula' | 'razor' | 'swarm' | 'ritual';
export type VocoderSource = 'sample' | 'microphone';

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
