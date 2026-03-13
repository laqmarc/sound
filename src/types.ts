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
}

export interface DrumPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
}

export type SoundFlowNode = Node<SoundNodeData, FlowNodeType>;
export type SoundNodeProps = NodeProps<SoundNodeData>;

export interface ControllableSoundNodeProps extends SoundNodeProps {
  onDataChange: (id: string, patch: Partial<SoundNodeData>) => void;
}
