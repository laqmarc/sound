import type { EditableAudioNodeType, SoundNodeData } from './types';

export type ComponentTabId = 'all' | 'voices' | 'groove' | 'fx' | 'wiring' | 'sight';

export interface MachineSetTemplateNode {
  key: string;
  type: EditableAudioNodeType;
  offset: {
    x: number;
    y: number;
  };
  data?: Partial<SoundNodeData>;
}

export interface MachineSetTemplateEdge {
  source: string;
  target: string;
  targetHandle?: string;
}

export interface MachineSetTemplate {
  id: string;
  name: string;
  hint: string;
  tab: ComponentTabId;
  nodes: MachineSetTemplateNode[];
  edges: MachineSetTemplateEdge[];
}

export interface AddNodeButton {
  type: EditableAudioNodeType;
  label: string;
  color: string;
  tab: ComponentTabId;
}

export const componentTabs: Array<{
  id: ComponentTabId;
  label: string;
  hint: string;
}> = [
  { id: 'all', label: 'Tot el Caos', hint: 'Totes les joguines' },
  { id: 'voices', label: 'Bestiari Sonor', hint: 'Fonts i sintes' },
  { id: 'groove', label: 'Ritmes Toxics', hint: 'Loops i sequencies' },
  { id: 'fx', label: 'Spa Radioactiu', hint: 'Efectes i destrosses' },
  { id: 'wiring', label: 'Cablejat Fino', hint: 'Control i routing' },
  { id: 'sight', label: 'Ulls Mutants', hint: 'Analisi i visuals' },
];

export const machineSetTemplates: MachineSetTemplate[] = [
  {
    id: 'drum-bus',
    name: 'Drum Bus',
    hint: 'Kick, snare i hi-hat ja rutats a un mixer',
    tab: 'groove',
    nodes: [
      {
        key: 'kick',
        type: 'kickSynth',
        offset: { x: 0, y: 0 },
        data: {
          steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        },
      },
      {
        key: 'snare',
        type: 'snareSynth',
        offset: { x: 0, y: 180 },
        data: {
          steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        },
      },
      {
        key: 'hat',
        type: 'hiHatSynth',
        offset: { x: 0, y: 360 },
        data: {
          steps: Array.from({ length: 16 }, () => true),
        },
      },
      {
        key: 'mixer',
        type: 'mixer',
        offset: { x: 320, y: 150 },
        data: {
          ch1: 0.82,
          ch2: 0.68,
          ch3: 0.55,
          label_ch1: 'Kick',
          label_ch2: 'Snare',
          label_ch3: 'Hi-Hat',
        },
      },
    ],
    edges: [
      { source: 'kick', target: 'mixer', targetHandle: 'ch1' },
      { source: 'snare', target: 'mixer', targetHandle: 'ch2' },
      { source: 'hat', target: 'mixer', targetHandle: 'ch3' },
    ],
  },
  {
    id: 'mutant-rig',
    name: 'Mutant Rig',
    hint: 'Arp + weird machine + delay + scope',
    tab: 'voices',
    nodes: [
      {
        key: 'arp',
        type: 'arpeggiator',
        offset: { x: 0, y: 0 },
        data: {
          syncDivision: '1/8',
        },
      },
      {
        key: 'mutant',
        type: 'weirdMachine',
        offset: { x: 360, y: -40 },
      },
      {
        key: 'delay',
        type: 'delay',
        offset: { x: 760, y: 20 },
        data: {
          sync: true,
          syncDivision: '1/8',
          delayTime: 0.22,
        },
      },
      {
        key: 'scope',
        type: 'scope',
        offset: { x: 1040, y: 20 },
        data: {
          label: 'Scope',
        },
      },
    ],
    edges: [
      { source: 'arp', target: 'mutant', targetHandle: 'pitch' },
      { source: 'mutant', target: 'delay' },
      { source: 'delay', target: 'scope' },
    ],
  },
  {
    id: 'fx-ladder',
    name: 'FX Ladder',
    hint: 'Filter, chorus, delay i reverb en cadena',
    tab: 'fx',
    nodes: [
      {
        key: 'filter',
        type: 'filter',
        offset: { x: 0, y: 0 },
        data: {
          frequency: 1400,
          type: 'lowpass',
          Q: 1.1,
        },
      },
      {
        key: 'chorus',
        type: 'chorus',
        offset: { x: 240, y: 0 },
        data: {
          mix: 0.52,
        },
      },
      {
        key: 'delay',
        type: 'delay',
        offset: { x: 480, y: 0 },
        data: {
          sync: true,
          syncDivision: '1/8',
          delayTime: 0.24,
        },
      },
      {
        key: 'reverb',
        type: 'reverb',
        offset: { x: 720, y: 0 },
        data: {
          decay: 4.8,
          mix: 0.62,
        },
      },
    ],
    edges: [
      { source: 'filter', target: 'chorus' },
      { source: 'chorus', target: 'delay' },
      { source: 'delay', target: 'reverb' },
    ],
  },
];

export const addNodeButtons: AddNodeButton[] = [
  { type: 'oscillator', label: 'Osc', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', tab: 'voices' },
  { type: 'dualOsc', label: 'Dual', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'voices' },
  { type: 'dronePad', label: 'Drone', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', tab: 'voices' },
  { type: 'bassline', label: 'Bass', color: 'bg-green-500/10 text-green-300 border-green-500/20', tab: 'voices' },
  { type: 'leadVoice', label: 'Lead', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20', tab: 'voices' },
  { type: 'noise', label: 'Noise', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', tab: 'voices' },
  { type: 'monoSynth', label: 'Mono', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', tab: 'voices' },
  { type: 'fmSynth', label: 'FM', color: 'bg-teal-500/10 text-teal-300 border-teal-500/20', tab: 'voices' },
  { type: 'subOsc', label: 'Sub', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20', tab: 'voices' },
  { type: 'noiseLayer', label: 'Layer', color: 'bg-stone-500/10 text-stone-300 border-stone-500/20', tab: 'voices' },
  { type: 'weirdMachine', label: 'Mutant', color: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20', tab: 'voices' },
  { type: 'chaosShrine', label: 'Shrine', color: 'bg-rose-500/10 text-rose-200 border-rose-500/20', tab: 'voices' },
  { type: 'chordGenerator', label: 'Chord', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', tab: 'voices' },
  { type: 'drumMachine', label: 'Drums', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', tab: 'groove' },
  { type: 'kickSynth', label: 'Kick', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'groove' },
  { type: 'snareSynth', label: 'Snare', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20', tab: 'groove' },
  { type: 'hiHatSynth', label: 'HiHat', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', tab: 'groove' },
  { type: 'arpeggiator', label: 'Arp', color: 'bg-lime-500/10 text-lime-400 border-lime-500/20', tab: 'groove' },
  { type: 'arp2', label: 'Arp2', color: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20', tab: 'groove' },
  { type: 'looper', label: 'Looper', color: 'bg-lime-500/10 text-lime-300 border-lime-500/20', tab: 'groove' },
  { type: 'filter', label: 'Filter', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', tab: 'fx' },
  { type: 'distortion', label: 'Disto', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', tab: 'fx' },
  { type: 'delay', label: 'Delay', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', tab: 'fx' },
  { type: 'reverb', label: 'Reverb', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', tab: 'fx' },
  { type: 'compressor', label: 'Comp', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', tab: 'fx' },
  { type: 'chorus', label: 'Chorus', color: 'bg-sky-500/10 text-sky-300 border-sky-500/20', tab: 'fx' },
  { type: 'bitcrusher', label: 'Crusher', color: 'bg-orange-500/10 text-orange-300 border-orange-500/20', tab: 'fx' },
  { type: 'flanger', label: 'Flanger', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20', tab: 'fx' },
  { type: 'limiter', label: 'Limiter', color: 'bg-red-500/10 text-red-300 border-red-500/20', tab: 'fx' },
  { type: 'tremolo', label: 'Tremolo', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', tab: 'fx' },
  { type: 'ringMod', label: 'RingMod', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20', tab: 'fx' },
  { type: 'vibrato', label: 'Vibrato', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'fx' },
  { type: 'combFilter', label: 'Comb', color: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20', tab: 'fx' },
  { type: 'autoPan', label: 'AutoPan', color: 'bg-pink-500/10 text-pink-300 border-pink-500/20', tab: 'fx' },
  { type: 'autoFilter', label: 'AutoFilt', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20', tab: 'fx' },
  { type: 'resonator', label: 'Reso', color: 'bg-teal-500/10 text-teal-300 border-teal-500/20', tab: 'fx' },
  { type: 'wah', label: 'Wah', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20', tab: 'fx' },
  { type: 'stereoWidener', label: 'Wide', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20', tab: 'fx' },
  { type: 'foldback', label: 'Fold', color: 'bg-orange-500/10 text-orange-300 border-orange-500/20', tab: 'fx' },
  { type: 'tiltEq', label: 'Tilt', color: 'bg-lime-500/10 text-lime-300 border-lime-500/20', tab: 'fx' },
  { type: 'saturator', label: 'Sat', color: 'bg-red-500/10 text-red-300 border-red-500/20', tab: 'fx' },
  { type: 'equalizer8', label: 'EQ8', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'fx' },
  { type: 'phaser', label: 'Phaser', color: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20', tab: 'fx' },
  { type: 'gain', label: 'Gain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tab: 'wiring' },
  { type: 'mixer', label: 'Mixer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tab: 'wiring' },
  { type: 'panner', label: 'Panner', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', tab: 'wiring' },
  { type: 'lfo', label: 'LFO', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', tab: 'wiring' },
  { type: 'clockDivider', label: 'Clock', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20', tab: 'wiring' },
  { type: 'randomCv', label: 'RandCV', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', tab: 'wiring' },
  { type: 'sampleHold', label: 'S&H', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20', tab: 'wiring' },
  { type: 'gateSeq', label: 'Gate', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', tab: 'wiring' },
  { type: 'cvOffset', label: 'Offset', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20', tab: 'wiring' },
  { type: 'envelopeFollower', label: 'Env', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'wiring' },
  { type: 'quantizer', label: 'Quant', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20', tab: 'wiring' },
  { type: 'comparator', label: 'Comp>', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20', tab: 'wiring' },
  { type: 'lag', label: 'Lag', color: 'bg-teal-500/10 text-teal-300 border-teal-500/20', tab: 'wiring' },
  { type: 'chordSeq', label: 'ChordSeq', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', tab: 'wiring' },
  { type: 'cabSim', label: 'Cab', color: 'bg-stone-500/10 text-stone-300 border-stone-500/20', tab: 'fx' },
  { type: 'transientShaper', label: 'Punch', color: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20', tab: 'fx' },
  { type: 'freezeFx', label: 'Freeze', color: 'bg-sky-500/10 text-sky-300 border-sky-500/20', tab: 'fx' },
  { type: 'granular', label: 'Granular', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', tab: 'fx' },
  { type: 'stutter', label: 'Stutter', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20', tab: 'fx' },
  { type: 'humanizer', label: 'Human', color: 'bg-orange-500/10 text-orange-300 border-orange-500/20', tab: 'fx' },
  { type: 'triggerDelay', label: 'TrigDly', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20', tab: 'fx' },
  { type: 'scope', label: 'Scope', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', tab: 'sight' },
  { type: 'vuMeter', label: 'Agulla', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', tab: 'sight' },
  { type: 'phaseCorrelator', label: 'Fase', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20', tab: 'sight' },
  { type: 'lissajous', label: 'Mirall', color: 'bg-sky-500/10 text-sky-300 border-sky-500/20', tab: 'sight' },
  { type: 'tuner', label: 'Oracle', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', tab: 'sight' },
  { type: 'spectrogram', label: 'Spectrum', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', tab: 'sight' },
];
