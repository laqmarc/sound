import type { Node, NodeProps } from 'reactflow';

export const editableNodeTypes = [
  'oscillator',
  'gain',
  'filter',
  'delay',
  'noise',
  'distortion',
  'reverb',
  'scope',
  'mixer',
  'spectrogram',
  'panner',
  'lfo',
  'drumMachine',
  'arpeggiator',
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
}

export interface DrumPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
}

export type SyncDivision = '1/1' | '1/2' | '1/4' | '1/8' | '1/16';
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface ArpStep {
  note: NoteName;
  octave: number;
}

export type SoundFlowNode = Node<SoundNodeData, FlowNodeType>;
export type SoundNodeProps = NodeProps<SoundNodeData>;

export interface ControllableSoundNodeProps extends SoundNodeProps {
  onDataChange: (id: string, patch: Partial<SoundNodeData>) => void;
}
