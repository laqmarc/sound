import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type OnConnect,
  type OnNodesDelete,
  type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Volume2, VolumeX, Zap } from 'lucide-react';

import DestinationNode from './nodes/DestinationNode';
import DelayNode from './nodes/DelayNode';
import DistortionNode from './nodes/DistortionNode';
import FilterNode from './nodes/FilterNode';
import GainNode from './nodes/GainNode';
import LFONode from './nodes/LFONode';
import MixerNode from './nodes/MixerNode';
import NoiseNode from './nodes/NoiseNode';
import OscillatorNode from './nodes/OscillatorNode';
import DualOscNode from './nodes/DualOscNode';
import DronePadNode from './nodes/DronePadNode';
import BasslineNode from './nodes/BasslineNode';
import LeadVoiceNode from './nodes/LeadVoiceNode';
import PannerNode from './nodes/PannerNode';
import ReverbNode from './nodes/ReverbNode';
import ScopeNode from './nodes/ScopeNode';
import SpectrogramNode from './nodes/SpectrogramNode';
import DrumMachineNode from './nodes/DrumMachineNode';
import ArpeggiatorNode from './nodes/ArpeggiatorNode';
import Equalizer8Node from './nodes/Equalizer8Node';
import PhaserNode from './nodes/PhaserNode';
import CompressorNode from './nodes/CompressorNode';
import ChorusNode from './nodes/ChorusNode';
import BitcrusherNode from './nodes/BitcrusherNode';
import FlangerNode from './nodes/FlangerNode';
import LimiterNode from './nodes/LimiterNode';
import LooperNode from './nodes/LooperNode';
import FMSynthNode from './nodes/FMSynthNode';
import SubOscNode from './nodes/SubOscNode';
import NoiseLayerNode from './nodes/NoiseLayerNode';
import WeirdMachineNode from './nodes/WeirdMachineNode';
import TremoloNode from './nodes/TremoloNode';
import RingModNode from './nodes/RingModNode';
import VibratoNode from './nodes/VibratoNode';
import CombFilterNode from './nodes/CombFilterNode';
import MonoSynthNode from './nodes/MonoSynthNode';
import KickSynthNode from './nodes/KickSynthNode';
import SnareSynthNode from './nodes/SnareSynthNode';
import HiHatSynthNode from './nodes/HiHatSynthNode';
import ChordGeneratorNode from './nodes/ChordGeneratorNode';
import VUMeterNode from './nodes/VUMeterNode';
import PhaseCorrelatorNode from './nodes/PhaseCorrelatorNode';
import LissajousNode from './nodes/LissajousNode';
import TunerNode from './nodes/TunerNode';
import AutoPanNode from './nodes/AutoPanNode';
import AutoFilterNode from './nodes/AutoFilterNode';
import ClockDividerNode from './nodes/ClockDividerNode';
import RandomCVNode from './nodes/RandomCVNode';
import SampleHoldNode from './nodes/SampleHoldNode';
import GateSeqNode from './nodes/GateSeqNode';
import CVOffsetNode from './nodes/CVOffsetNode';
import EnvelopeFollowerNode from './nodes/EnvelopeFollowerNode';
import QuantizerNode from './nodes/QuantizerNode';
import ComparatorNode from './nodes/ComparatorNode';
import LagNode from './nodes/LagNode';
import ChordSeqNode from './nodes/ChordSeqNode';
import ResonatorNode from './nodes/ResonatorNode';
import WahNode from './nodes/WahNode';
import StereoWidenerNode from './nodes/StereoWidenerNode';
import FoldbackNode from './nodes/FoldbackNode';
import TiltEQNode from './nodes/TiltEQNode';
import SaturatorNode from './nodes/SaturatorNode';
import CabSimNode from './nodes/CabSimNode';
import TransientShaperNode from './nodes/TransientShaperNode';
import FreezeFxNode from './nodes/FreezeFxNode';
import GranularNode from './nodes/GranularNode';
import StutterNode from './nodes/StutterNode';
import HumanizerNode from './nodes/HumanizerNode';
import TriggerDelayNode from './nodes/TriggerDelayNode';
import Knob from './components/Knob';
import {
  applyAudioNodeData,
  connectNodes,
  createAudioNode,
  disconnectNodes,
  getAudioContext,
  getTransportState,
  removeNode,
  setTransportBpm,
  setTransportSwing,
  startTransport,
  stopAudio,
} from './AudioEngine';
import type { ArpStep, DrumPattern, EditableAudioNodeType, SoundFlowNode, SoundNodeData, SoundNodeProps } from './types';

const baseInitialNodes: SoundFlowNode[] = [
  {
    id: 'destination',
    type: 'destination',
    position: { x: 800, y: 300 },
    data: { label: 'Sortida' },
  },
  {
    id: 'osc_1',
    type: 'oscillator',
    position: { x: 100, y: 100 },
    data: {
      label: 'Oscillator',
      frequency: 440,
      type: 'sine',
    },
  },
];

const defaultDrumPattern = (): DrumPattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
});

const defaultArpSteps = (): ArpStep[] => [
  { note: 'C', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'C', octave: 5, enabled: true },
  { note: 'B', octave: 4, enabled: true },
  { note: 'G', octave: 4, enabled: true },
  { note: 'E', octave: 4, enabled: true },
];

const defaultEqBands = () => [0, 0, 0, 0, 0, 0, 0, 0];

const defaultNodeData: Record<EditableAudioNodeType, SoundNodeData> = {
  oscillator: {
    label: 'Oscillator',
    frequency: 440,
    type: 'sine',
  },
  dualOsc: {
    label: 'Dual Osc',
    frequency: 220,
    gain: 0.35,
    type: 'sawtooth',
    modType: 'square',
    detune: 12,
    blend: 0.5,
  },
  dronePad: {
    label: 'Drone Pad',
    note: 'C',
    octave: 3,
    chordType: 'minor',
    spread: 14,
    gain: 0.25,
    type: 'sawtooth',
  },
  bassline: {
    label: 'Bassline',
    note: 'C',
    octave: 2,
    tone: 900,
    gain: 0.45,
    syncDivision: '1/16',
    steps: Array.from({ length: 16 }, (_, index) => index % 4 === 0),
  },
  leadVoice: {
    label: 'Lead Voice',
    frequency: 330,
    tone: 2200,
    Q: 0.8,
    gain: 0.3,
    glide: 0.04,
    type: 'sawtooth',
  },
  gain: {
    label: 'Gain',
    gain: 0.5,
  },
  filter: {
    label: 'Filter',
    frequency: 1000,
    type: 'lowpass',
    Q: 1,
  },
  delay: {
    label: 'Delay',
    delayTime: 0.3,
    sync: false,
    syncDivision: '1/8',
  },
  noise: {
    label: 'Noise',
  },
  distortion: {
    label: 'Distortion',
    distortion: 400,
  },
  reverb: {
    label: 'Reverb',
    decay: 3,
  },
  compressor: {
    label: 'Compressor',
    threshold: -24,
    knee: 18,
    ratio: 6,
    attack: 0.01,
    release: 0.25,
    makeup: 1,
  },
  chorus: {
    label: 'Chorus',
    rate: 0.8,
    depth: 0.012,
    delay: 0.02,
    mix: 0.45,
    sync: false,
    syncDivision: '1/4',
  },
  bitcrusher: {
    label: 'Bitcrusher',
    bits: 6,
    normFreq: 0.2,
    mix: 0.7,
  },
  flanger: {
    label: 'Flanger',
    rate: 0.25,
    depth: 0.003,
    feedback: 0.55,
    mix: 0.5,
    sync: false,
    syncDivision: '1/4',
  },
  limiter: {
    label: 'Limiter',
    threshold: -6,
    release: 0.08,
    makeup: 1,
  },
  looper: {
    label: 'Looper',
    loopLength: 0.5,
    feedback: 0.2,
    mix: 0.8,
    sync: true,
    syncDivision: '1/4',
    freeze: false,
  },
  tremolo: {
    label: 'Tremolo',
    rate: 4,
    depth: 0.75,
    mix: 1,
    sync: false,
    syncDivision: '1/8',
  },
  ringMod: {
    label: 'Ring Mod',
    modFrequency: 60,
    depth: 1,
    mix: 0.8,
    sync: false,
    syncDivision: '1/8',
  },
  vibrato: {
    label: 'Vibrato',
    rate: 5,
    depth: 0.004,
    mix: 1,
    sync: false,
    syncDivision: '1/8',
  },
  combFilter: {
    label: 'Comb Filter',
    delay: 0.015,
    feedback: 0.65,
    mix: 0.7,
  },
  autoPan: {
    label: 'AutoPan',
    rate: 0.5,
    depth: 1,
    mix: 1,
    sync: false,
    syncDivision: '1/4',
  },
  autoFilter: {
    label: 'AutoFilter',
    type: 'lowpass',
    rate: 0.8,
    depth: 2200,
    tone: 800,
    Q: 1.2,
    mix: 0.85,
    sync: false,
    syncDivision: '1/8',
  },
  clockDivider: {
    label: 'Clock Divider',
    syncDivision: '1/4',
  },
  randomCv: {
    label: 'Random CV',
    minValue: -300,
    maxValue: 300,
    syncDivision: '1/8',
  },
  sampleHold: {
    label: 'Sample Hold',
    rate: 8,
    mix: 1,
    sync: false,
    syncDivision: '1/16',
  },
  gateSeq: {
    label: 'Gate Seq',
    syncDivision: '1/16',
    steps: Array.from({ length: 16 }, (_, index) => index % 2 === 0),
  },
  cvOffset: {
    label: 'CV Offset',
    offset: 0,
    gain: 1,
  },
  envelopeFollower: {
    label: 'Envelope Follower',
    attack: 0.03,
    release: 0.18,
    gain: 200,
  },
  quantizer: {
    label: 'Quantizer',
    divider: 12,
    mix: 1,
  },
  comparator: {
    label: 'Comparator',
    threshold: 0,
  },
  lag: {
    label: 'Lag',
    attack: 0.02,
    release: 0.08,
    mix: 1,
  },
  chordSeq: {
    label: 'Chord Seq',
    note: 'C',
    octave: 3,
    chordType: 'major',
    spread: 10,
    gain: 0.22,
    syncDivision: '1/4',
    steps: Array.from({ length: 16 }, (_, index) => index % 4 === 0),
  },
  resonator: {
    label: 'Resonator',
    tone: 440,
    Q: 12,
    spread: 7,
    mix: 0.7,
  },
  wah: {
    label: 'Wah',
    rate: 1.5,
    depth: 900,
    tone: 700,
    Q: 8,
    mix: 0.75,
    sync: false,
    syncDivision: '1/8',
  },
  stereoWidener: {
    label: 'Stereo Widener',
    delay: 0.012,
    spread: 1,
    mix: 0.65,
  },
  foldback: {
    label: 'Foldback',
    drive: 2.2,
    threshold: 0.55,
    mix: 0.75,
  },
  tiltEq: {
    label: 'Tilt EQ',
    tone: 900,
    tilt: 0,
    mix: 1,
  },
  saturator: {
    label: 'Saturator',
    drive: 2.4,
    makeup: 1,
    mix: 0.8,
  },
  cabSim: {
    label: 'Cab Sim',
    tone: 2600,
    Q: 0.8,
    mix: 1,
  },
  transientShaper: {
    label: 'Transient',
    attack: 0.7,
    sustain: 0,
    mix: 1,
  },
  freezeFx: {
    label: 'Freeze',
    loopLength: 0.35,
    mix: 0.9,
    freeze: false,
    sync: false,
    syncDivision: '1/4',
  },
  granular: {
    label: 'Granular',
    grainSize: 0.12,
    spray: 0.35,
    mix: 0.8,
    sync: false,
    syncDivision: '1/8',
  },
  stutter: {
    label: 'Stutter',
    loopLength: 0.12,
    mix: 0.8,
    sync: false,
    syncDivision: '1/8',
  },
  humanizer: {
    label: 'Humanizer',
    rate: 2,
    depth: 0.35,
    mix: 0.7,
  },
  triggerDelay: {
    label: 'Trigger Delay',
    delayTime: 0.08,
    mix: 1,
    sync: false,
    syncDivision: '1/16',
  },
  monoSynth: {
    label: 'Mono Synth',
    frequency: 220,
    gain: 0.35,
    tone: 1800,
    Q: 0.8,
    type: 'sawtooth',
  },
  kickSynth: {
    label: 'Kick Synth',
    gain: 0.9,
    tone: 58,
    decay: 0.24,
    steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  },
  snareSynth: {
    label: 'Snare Synth',
    gain: 0.65,
    tone: 180,
    decay: 0.16,
    steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  },
  hiHatSynth: {
    label: 'HiHat Synth',
    gain: 0.4,
    tone: 9500,
    decay: 0.06,
    steps: Array.from({ length: 16 }, () => true),
  },
  chordGenerator: {
    label: 'Chord Generator',
    note: 'C',
    octave: 4,
    chordType: 'major',
    spread: 10,
    gain: 0.22,
    type: 'triangle',
  },
  scope: {
    label: 'Scope',
  },
  vuMeter: {
    label: 'VU Meter',
  },
  phaseCorrelator: {
    label: 'Phase Correlator',
  },
  lissajous: {
    label: 'Lissajous',
  },
  tuner: {
    label: 'Tuner',
  },
  mixer: {
    label: 'Mixer',
    ch1: 0.5,
    ch2: 0.5,
    ch3: 0.5,
    ch4: 0.5,
  },
  spectrogram: {
    label: 'Spectrogram',
  },
  panner: {
    label: 'Panner',
    pan: 0,
  },
  lfo: {
    label: 'LFO',
    frequency: 1,
    gain: 100,
    type: 'sine',
    sync: false,
    syncDivision: '1/4',
  },
  drumMachine: {
    label: 'Drum Machine',
    bpm: 120,
    drumPattern: defaultDrumPattern(),
  },
  arpeggiator: {
    label: 'Arpeggiator',
    syncDivision: '1/8',
    arpMode: 'up',
    arpScale: 'chromatic',
    arpSteps: defaultArpSteps(),
  },
  equalizer8: {
    label: 'EQ 8-Band',
    eqBands: defaultEqBands(),
  },
  phaser: {
    label: 'Phaser',
    rate: 0.6,
    depth: 800,
    feedback: 0.35,
    mix: 0.5,
    sync: false,
    syncDivision: '1/4',
  },
  fmSynth: {
    label: 'FM Synth',
    frequency: 220,
    modFrequency: 220,
    modAmount: 180,
    gain: 0.35,
    type: 'sine',
    modType: 'sine',
  },
  subOsc: {
    label: 'Sub Osc',
    frequency: 110,
    gain: 0.4,
    type: 'square',
    subOctave: 1,
  },
  noiseLayer: {
    label: 'Noise Layer',
    tone: 2800,
    Q: 0.8,
    gain: 0.18,
    type: 'lowpass',
  },
  weirdMachine: {
    label: 'Mutant Box',
    frequency: 180,
    modFrequency: 84,
    modAmount: 120,
    texture: 0.45,
    chaos: 0.5,
    tone: 1800,
    Q: 1.4,
    rate: 3.5,
    depth: 900,
    drive: 2.2,
    gain: 0.22,
    sync: false,
    syncDivision: '1/8',
    steps: [true, false, true, false, true, true, false, true],
    type: 'sawtooth',
    modType: 'square',
  },
};

const addNodeButtons: Array<{
  type: EditableAudioNodeType;
  label: string;
  color: string;
  tab: ComponentTabId;
}> = [
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
  { type: 'chordGenerator', label: 'Chord', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', tab: 'voices' },
  { type: 'drumMachine', label: 'Drums', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', tab: 'groove' },
  { type: 'kickSynth', label: 'Kick', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', tab: 'groove' },
  { type: 'snareSynth', label: 'Snare', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20', tab: 'groove' },
  { type: 'hiHatSynth', label: 'HiHat', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', tab: 'groove' },
  { type: 'arpeggiator', label: 'Arp', color: 'bg-lime-500/10 text-lime-400 border-lime-500/20', tab: 'groove' },
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

type ComponentTabId = 'all' | 'voices' | 'groove' | 'fx' | 'wiring' | 'sight';

const componentTabs: Array<{
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

interface PatchPreset {
  id: string;
  name: string;
  hint: string;
  nodes: SoundFlowNode[];
  edges: Edge[];
}

const USER_PATCH_STORAGE_KEY = 'soundlab-user-patches';

const cloneSerializable = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const clonePatchNodes = (nodes: SoundFlowNode[]) => cloneSerializable(nodes);

const clonePatchEdges = (edges: Edge[]) => cloneSerializable(edges);

const buildUserPatchHint = (nodes: SoundFlowNode[], edges: Edge[]) => {
  const moduleCount = nodes.filter((node) => node.type !== 'destination').length;
  const moduleLabel = `${moduleCount} modul${moduleCount === 1 ? '' : 's'}`;
  const cableLabel = `${edges.length} cable${edges.length === 1 ? '' : 's'}`;
  return `${moduleLabel} | ${cableLabel}`;
};

const readUserPatchPresets = (): PatchPreset[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(USER_PATCH_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter(
        (entry): entry is PatchPreset =>
          entry !== null &&
          typeof entry === 'object' &&
          typeof entry.id === 'string' &&
          typeof entry.name === 'string' &&
          typeof entry.hint === 'string' &&
          Array.isArray(entry.nodes) &&
          Array.isArray(entry.edges),
      )
      .map((entry) => ({
        ...entry,
        nodes: clonePatchNodes(entry.nodes),
        edges: clonePatchEdges(entry.edges),
      }));
  } catch {
    return [];
  }
};

const writeUserPatchPresets = (presets: PatchPreset[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_PATCH_STORAGE_KEY, JSON.stringify(presets));
};

const patchPresets: PatchPreset[] = [
  {
    id: 'acid-rat',
    name: 'Acid Rat',
    hint: 'Bassline + auto filter + foldback + delay',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1040, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_bassline',
        type: 'bassline',
        position: { x: 120, y: 210 },
        data: {
          ...defaultNodeData.bassline,
          note: 'F',
          octave: 2,
          tone: 1300,
          gain: 0.52,
          steps: [true, false, false, true, true, false, true, false, true, false, false, true, true, false, true, false],
        },
      },
      {
        id: 'preset_filter',
        type: 'autoFilter',
        position: { x: 360, y: 210 },
        data: {
          ...defaultNodeData.autoFilter,
          type: 'lowpass',
          tone: 900,
          depth: 2800,
          rate: 1.6,
          mix: 1,
          sync: true,
          syncDivision: '1/8',
        },
      },
      {
        id: 'preset_fold',
        type: 'foldback',
        position: { x: 600, y: 210 },
        data: {
          ...defaultNodeData.foldback,
          drive: 3.1,
          threshold: 0.48,
          mix: 0.6,
        },
      },
      {
        id: 'preset_delay',
        type: 'delay',
        position: { x: 820, y: 210 },
        data: {
          ...defaultNodeData.delay,
          sync: true,
          syncDivision: '1/8',
          delayTime: 0.2,
        },
      },
      {
        id: 'preset_scope',
        type: 'scope',
        position: { x: 820, y: 420 },
        data: { label: 'Scope' },
      },
    ],
    edges: [
      { id: 'acid-1', source: 'preset_bassline', target: 'preset_filter' },
      { id: 'acid-2', source: 'preset_filter', target: 'preset_fold' },
      { id: 'acid-3', source: 'preset_fold', target: 'preset_delay' },
      { id: 'acid-4', source: 'preset_delay', target: 'destination' },
      { id: 'acid-5', source: 'preset_delay', target: 'preset_scope' },
    ],
  },
  {
    id: 'glass-drone',
    name: 'Glass Drone',
    hint: 'Drone pad + phaser + wide + reverb',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1040, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_drone',
        type: 'dronePad',
        position: { x: 120, y: 210 },
        data: {
          ...defaultNodeData.dronePad,
          note: 'D',
          octave: 3,
          chordType: 'sus2',
          spread: 20,
          gain: 0.22,
          type: 'triangle',
        },
      },
      {
        id: 'preset_phaser',
        type: 'phaser',
        position: { x: 340, y: 210 },
        data: {
          ...defaultNodeData.phaser,
          sync: true,
          syncDivision: '1/4',
          depth: 1300,
          mix: 0.65,
        },
      },
      {
        id: 'preset_wide',
        type: 'stereoWidener',
        position: { x: 580, y: 210 },
        data: {
          ...defaultNodeData.stereoWidener,
          delay: 0.016,
          spread: 1.3,
          mix: 0.8,
        },
      },
      {
        id: 'preset_reverb',
        type: 'reverb',
        position: { x: 820, y: 210 },
        data: {
          ...defaultNodeData.reverb,
          decay: 4.2,
        },
      },
      {
        id: 'preset_spectrum',
        type: 'spectrogram',
        position: { x: 820, y: 430 },
        data: { label: 'Spectrogram' },
      },
    ],
    edges: [
      { id: 'drone-1', source: 'preset_drone', target: 'preset_phaser' },
      { id: 'drone-2', source: 'preset_phaser', target: 'preset_wide' },
      { id: 'drone-3', source: 'preset_wide', target: 'preset_reverb' },
      { id: 'drone-4', source: 'preset_reverb', target: 'destination' },
      { id: 'drone-5', source: 'preset_reverb', target: 'preset_spectrum' },
    ],
  },
  {
    id: 'toxic-club',
    name: 'Toxic Club',
    hint: 'Drums + kick/snare + compressor + cab',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1130, y: 300 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_mixer',
        type: 'mixer',
        position: { x: 620, y: 260 },
        data: { ...defaultNodeData.mixer },
      },
      {
        id: 'preset_drums',
        type: 'drumMachine',
        position: { x: 120, y: 130 },
        data: {
          ...defaultNodeData.drumMachine,
          bpm: 126,
          drumPattern: {
            kick: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
            snare: [false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false],
            hihat: [true, false, true, false, true, false, true, true, true, false, true, false, true, false, true, true],
          },
        },
      },
      {
        id: 'preset_kick',
        type: 'kickSynth',
        position: { x: 120, y: 360 },
        data: {
          ...defaultNodeData.kickSynth,
          tone: 52,
          gain: 1,
          steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, true, false],
        },
      },
      {
        id: 'preset_snare',
        type: 'snareSynth',
        position: { x: 120, y: 560 },
        data: {
          ...defaultNodeData.snareSynth,
          gain: 0.75,
          steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, true, false],
        },
      },
      {
        id: 'preset_comp',
        type: 'compressor',
        position: { x: 840, y: 260 },
        data: {
          ...defaultNodeData.compressor,
          threshold: -18,
          ratio: 8,
          makeup: 1.4,
        },
      },
      {
        id: 'preset_cab',
        type: 'cabSim',
        position: { x: 980, y: 260 },
        data: {
          ...defaultNodeData.cabSim,
          tone: 3000,
          mix: 0.75,
        },
      },
      {
        id: 'preset_vu',
        type: 'vuMeter',
        position: { x: 980, y: 500 },
        data: { label: 'VU Meter' },
      },
    ],
    edges: [
      { id: 'club-1', source: 'preset_drums', target: 'preset_mixer', targetHandle: 'ch1' },
      { id: 'club-2', source: 'preset_kick', target: 'preset_mixer', targetHandle: 'ch2' },
      { id: 'club-3', source: 'preset_snare', target: 'preset_mixer', targetHandle: 'ch3' },
      { id: 'club-4', source: 'preset_mixer', target: 'preset_comp' },
      { id: 'club-5', source: 'preset_comp', target: 'preset_cab' },
      { id: 'club-6', source: 'preset_cab', target: 'destination' },
      { id: 'club-7', source: 'preset_cab', target: 'preset_vu' },
    ],
  },
  {
    id: 'laser-lead',
    name: 'Laser Lead',
    hint: 'Arp + lead voice + phaser + delay',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1100, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_arp',
        type: 'arpeggiator',
        position: { x: 100, y: 220 },
        data: {
          ...defaultNodeData.arpeggiator,
          syncDivision: '1/16',
          arpMode: 'up',
          arpScale: 'minor',
          arpSteps: [
            { note: 'A', octave: 4, enabled: true },
            { note: 'C', octave: 5, enabled: true },
            { note: 'E', octave: 5, enabled: true },
            { note: 'G', octave: 5, enabled: true },
            { note: 'A', octave: 5, enabled: true },
            { note: 'G', octave: 5, enabled: false },
            { note: 'E', octave: 5, enabled: true },
            { note: 'C', octave: 5, enabled: true },
          ],
        },
      },
      {
        id: 'preset_lead',
        type: 'leadVoice',
        position: { x: 340, y: 220 },
        data: {
          ...defaultNodeData.leadVoice,
          tone: 2800,
          Q: 1.4,
          gain: 0.24,
          glide: 0.03,
          type: 'sawtooth',
        },
      },
      {
        id: 'preset_human',
        type: 'humanizer',
        position: { x: 560, y: 220 },
        data: {
          ...defaultNodeData.humanizer,
          rate: 2.4,
          depth: 0.28,
          mix: 0.55,
        },
      },
      {
        id: 'preset_phaser',
        type: 'phaser',
        position: { x: 770, y: 220 },
        data: {
          ...defaultNodeData.phaser,
          sync: true,
          syncDivision: '1/8',
          mix: 0.45,
          depth: 900,
        },
      },
      {
        id: 'preset_delay',
        type: 'delay',
        position: { x: 950, y: 220 },
        data: {
          ...defaultNodeData.delay,
          sync: true,
          syncDivision: '1/8',
        },
      },
      {
        id: 'preset_lissa',
        type: 'lissajous',
        position: { x: 950, y: 460 },
        data: { label: 'Lissajous' },
      },
    ],
    edges: [
      { id: 'lead-1', source: 'preset_arp', target: 'preset_lead', targetHandle: 'pitch' },
      { id: 'lead-2', source: 'preset_lead', target: 'preset_human' },
      { id: 'lead-3', source: 'preset_human', target: 'preset_phaser' },
      { id: 'lead-4', source: 'preset_phaser', target: 'preset_delay' },
      { id: 'lead-5', source: 'preset_delay', target: 'destination' },
      { id: 'lead-6', source: 'preset_delay', target: 'preset_lissa' },
    ],
  },
  {
    id: 'neon-bells',
    name: 'Neon Bells',
    hint: 'Arp + FM + chorus + delay',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1100, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_arp',
        type: 'arpeggiator',
        position: { x: 90, y: 220 },
        data: {
          ...defaultNodeData.arpeggiator,
          syncDivision: '1/8',
          arpMode: 'up',
          arpScale: 'major',
          arpSteps: [
            { note: 'C', octave: 5, enabled: true },
            { note: 'E', octave: 5, enabled: true },
            { note: 'G', octave: 5, enabled: true },
            { note: 'B', octave: 5, enabled: true },
            { note: 'D', octave: 6, enabled: true },
            { note: 'B', octave: 5, enabled: true },
            { note: 'G', octave: 5, enabled: true },
            { note: 'E', octave: 5, enabled: true },
          ],
        },
      },
      {
        id: 'preset_fm',
        type: 'fmSynth',
        position: { x: 320, y: 220 },
        data: {
          ...defaultNodeData.fmSynth,
          modFrequency: 660,
          modAmount: 120,
          gain: 0.26,
        },
      },
      {
        id: 'preset_chorus',
        type: 'chorus',
        position: { x: 560, y: 220 },
        data: {
          ...defaultNodeData.chorus,
          sync: true,
          syncDivision: '1/8',
          depth: 0.02,
          mix: 0.58,
        },
      },
      {
        id: 'preset_delay',
        type: 'delay',
        position: { x: 790, y: 220 },
        data: {
          ...defaultNodeData.delay,
          sync: true,
          syncDivision: '1/8',
        },
      },
      {
        id: 'preset_spectrum',
        type: 'spectrogram',
        position: { x: 790, y: 450 },
        data: { label: 'Spectrogram' },
      },
    ],
    edges: [
      { id: 'neon-1', source: 'preset_arp', target: 'preset_fm', targetHandle: 'pitch' },
      { id: 'neon-2', source: 'preset_fm', target: 'preset_chorus' },
      { id: 'neon-3', source: 'preset_chorus', target: 'preset_delay' },
      { id: 'neon-4', source: 'preset_delay', target: 'destination' },
      { id: 'neon-5', source: 'preset_delay', target: 'preset_spectrum' },
    ],
  },
  {
    id: 'swamp-sub',
    name: 'Swamp Sub',
    hint: 'Dual osc + sub + sat + EQ8',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1180, y: 260 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_dual',
        type: 'dualOsc',
        position: { x: 90, y: 140 },
        data: {
          ...defaultNodeData.dualOsc,
          frequency: 98,
          detune: 7,
          blend: 0.62,
          gain: 0.28,
        },
      },
      {
        id: 'preset_sub',
        type: 'subOsc',
        position: { x: 100, y: 380 },
        data: {
          ...defaultNodeData.subOsc,
          frequency: 98,
          subOctave: 2,
          gain: 0.46,
        },
      },
      {
        id: 'preset_mixer',
        type: 'mixer',
        position: { x: 370, y: 240 },
        data: {
          ...defaultNodeData.mixer,
          ch1: 0.65,
          ch2: 0.8,
        },
      },
      {
        id: 'preset_sat',
        type: 'saturator',
        position: { x: 650, y: 240 },
        data: {
          ...defaultNodeData.saturator,
          drive: 3.2,
          mix: 0.78,
          makeup: 1.08,
        },
      },
      {
        id: 'preset_eq',
        type: 'equalizer8',
        position: { x: 900, y: 240 },
        data: {
          ...defaultNodeData.equalizer8,
          eqBands: [5, 3, 1, -1, -2, 1, 2, 3],
        },
      },
      {
        id: 'preset_vu',
        type: 'vuMeter',
        position: { x: 900, y: 470 },
        data: { label: 'VU Meter' },
      },
    ],
    edges: [
      { id: 'swamp-1', source: 'preset_dual', target: 'preset_mixer', targetHandle: 'ch1' },
      { id: 'swamp-2', source: 'preset_sub', target: 'preset_mixer', targetHandle: 'ch2' },
      { id: 'swamp-3', source: 'preset_mixer', target: 'preset_sat' },
      { id: 'swamp-4', source: 'preset_sat', target: 'preset_eq' },
      { id: 'swamp-5', source: 'preset_eq', target: 'destination' },
      { id: 'swamp-6', source: 'preset_eq', target: 'preset_vu' },
    ],
  },
  {
    id: 'frozen-halo',
    name: 'Frozen Halo',
    hint: 'Drone + freeze + wide + reverb',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1100, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_drone',
        type: 'dronePad',
        position: { x: 100, y: 220 },
        data: {
          ...defaultNodeData.dronePad,
          note: 'F',
          octave: 4,
          chordType: 'major',
          spread: 18,
          gain: 0.18,
          type: 'triangle',
        },
      },
      {
        id: 'preset_freeze',
        type: 'freezeFx',
        position: { x: 330, y: 220 },
        data: {
          ...defaultNodeData.freezeFx,
          loopLength: 0.48,
          mix: 0.86,
        },
      },
      {
        id: 'preset_wide',
        type: 'stereoWidener',
        position: { x: 580, y: 220 },
        data: {
          ...defaultNodeData.stereoWidener,
          delay: 0.018,
          spread: 1.35,
          mix: 0.82,
        },
      },
      {
        id: 'preset_reverb',
        type: 'reverb',
        position: { x: 830, y: 220 },
        data: {
          ...defaultNodeData.reverb,
          decay: 5.6,
        },
      },
      {
        id: 'preset_lissa',
        type: 'lissajous',
        position: { x: 830, y: 450 },
        data: { label: 'Lissajous' },
      },
    ],
    edges: [
      { id: 'halo-1', source: 'preset_drone', target: 'preset_freeze' },
      { id: 'halo-2', source: 'preset_freeze', target: 'preset_wide' },
      { id: 'halo-3', source: 'preset_wide', target: 'preset_reverb' },
      { id: 'halo-4', source: 'preset_reverb', target: 'destination' },
      { id: 'halo-5', source: 'preset_reverb', target: 'preset_lissa' },
    ],
  },
  {
    id: 'broken-radio',
    name: 'Broken Radio',
    hint: 'Noise layer + wah + crush + cab',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1040, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_noise',
        type: 'noiseLayer',
        position: { x: 110, y: 220 },
        data: {
          ...defaultNodeData.noiseLayer,
          tone: 2200,
          Q: 1.6,
          gain: 0.28,
        },
      },
      {
        id: 'preset_wah',
        type: 'wah',
        position: { x: 340, y: 220 },
        data: {
          ...defaultNodeData.wah,
          sync: true,
          syncDivision: '1/8',
          depth: 1200,
          mix: 0.88,
        },
      },
      {
        id: 'preset_crush',
        type: 'bitcrusher',
        position: { x: 580, y: 220 },
        data: {
          ...defaultNodeData.bitcrusher,
          bits: 4,
          normFreq: 0.11,
          mix: 0.76,
        },
      },
      {
        id: 'preset_cab',
        type: 'cabSim',
        position: { x: 810, y: 220 },
        data: {
          ...defaultNodeData.cabSim,
          tone: 1800,
          Q: 1.2,
          mix: 0.92,
        },
      },
      {
        id: 'preset_scope',
        type: 'scope',
        position: { x: 810, y: 450 },
        data: { label: 'Scope' },
      },
    ],
    edges: [
      { id: 'radio-1', source: 'preset_noise', target: 'preset_wah' },
      { id: 'radio-2', source: 'preset_wah', target: 'preset_crush' },
      { id: 'radio-3', source: 'preset_crush', target: 'preset_cab' },
      { id: 'radio-4', source: 'preset_cab', target: 'destination' },
      { id: 'radio-5', source: 'preset_cab', target: 'preset_scope' },
    ],
  },
  {
    id: 'comb-cathedral',
    name: 'Comb Cathedral',
    hint: 'Chord gen + comb + phaser + reverb',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1080, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_chord',
        type: 'chordGenerator',
        position: { x: 100, y: 220 },
        data: {
          ...defaultNodeData.chordGenerator,
          note: 'A',
          octave: 4,
          chordType: 'minor',
          spread: 12,
          gain: 0.2,
        },
      },
      {
        id: 'preset_comb',
        type: 'combFilter',
        position: { x: 330, y: 220 },
        data: {
          ...defaultNodeData.combFilter,
          delay: 0.021,
          feedback: 0.72,
          mix: 0.8,
        },
      },
      {
        id: 'preset_phaser',
        type: 'phaser',
        position: { x: 560, y: 220 },
        data: {
          ...defaultNodeData.phaser,
          sync: true,
          syncDivision: '1/4',
          depth: 1100,
          mix: 0.58,
        },
      },
      {
        id: 'preset_reverb',
        type: 'reverb',
        position: { x: 800, y: 220 },
        data: {
          ...defaultNodeData.reverb,
          decay: 6.3,
        },
      },
      {
        id: 'preset_spectrum',
        type: 'spectrogram',
        position: { x: 800, y: 450 },
        data: { label: 'Spectrogram' },
      },
    ],
    edges: [
      { id: 'cathedral-1', source: 'preset_chord', target: 'preset_comb' },
      { id: 'cathedral-2', source: 'preset_comb', target: 'preset_phaser' },
      { id: 'cathedral-3', source: 'preset_phaser', target: 'preset_reverb' },
      { id: 'cathedral-4', source: 'preset_reverb', target: 'destination' },
      { id: 'cathedral-5', source: 'preset_reverb', target: 'preset_spectrum' },
    ],
  },
  {
    id: 'motorik-crash',
    name: 'Motorik Crash',
    hint: 'Drums + kick + hats + punch + limit',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1180, y: 300 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_mixer',
        type: 'mixer',
        position: { x: 640, y: 260 },
        data: {
          ...defaultNodeData.mixer,
          ch1: 0.7,
          ch2: 0.85,
          ch3: 0.45,
        },
      },
      {
        id: 'preset_drums',
        type: 'drumMachine',
        position: { x: 120, y: 120 },
        data: {
          ...defaultNodeData.drumMachine,
          bpm: 132,
          drumPattern: {
            kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, true, false],
            snare: [false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false],
            hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, true, true],
          },
        },
      },
      {
        id: 'preset_kick',
        type: 'kickSynth',
        position: { x: 120, y: 330 },
        data: {
          ...defaultNodeData.kickSynth,
          tone: 48,
          decay: 0.28,
          gain: 1,
          steps: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
        },
      },
      {
        id: 'preset_hat',
        type: 'hiHatSynth',
        position: { x: 120, y: 540 },
        data: {
          ...defaultNodeData.hiHatSynth,
          gain: 0.34,
          tone: 10500,
          decay: 0.05,
          steps: [true, false, true, true, true, false, true, false, true, false, true, true, true, false, true, false],
        },
      },
      {
        id: 'preset_punch',
        type: 'transientShaper',
        position: { x: 860, y: 260 },
        data: {
          ...defaultNodeData.transientShaper,
          attack: 0.92,
          sustain: -0.15,
          mix: 0.95,
        },
      },
      {
        id: 'preset_limit',
        type: 'limiter',
        position: { x: 1040, y: 260 },
        data: {
          ...defaultNodeData.limiter,
          threshold: -5,
          makeup: 1.15,
        },
      },
      {
        id: 'preset_vu',
        type: 'vuMeter',
        position: { x: 1040, y: 500 },
        data: { label: 'VU Meter' },
      },
    ],
    edges: [
      { id: 'motor-1', source: 'preset_drums', target: 'preset_mixer', targetHandle: 'ch1' },
      { id: 'motor-2', source: 'preset_kick', target: 'preset_mixer', targetHandle: 'ch2' },
      { id: 'motor-3', source: 'preset_hat', target: 'preset_mixer', targetHandle: 'ch3' },
      { id: 'motor-4', source: 'preset_mixer', target: 'preset_punch' },
      { id: 'motor-5', source: 'preset_punch', target: 'preset_limit' },
      { id: 'motor-6', source: 'preset_limit', target: 'destination' },
      { id: 'motor-7', source: 'preset_limit', target: 'preset_vu' },
    ],
  },
  {
    id: 'chrome-pluck',
    name: 'Chrome Pluck',
    hint: 'Arp + mono + resonator + chorus',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1120, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_arp',
        type: 'arpeggiator',
        position: { x: 90, y: 220 },
        data: {
          ...defaultNodeData.arpeggiator,
          syncDivision: '1/16',
          arpMode: 'down',
          arpScale: 'pentatonic',
          arpSteps: [
            { note: 'D', octave: 5, enabled: true },
            { note: 'A', octave: 5, enabled: true },
            { note: 'G', octave: 5, enabled: true },
            { note: 'E', octave: 5, enabled: true },
            { note: 'D', octave: 6, enabled: true },
            { note: 'A', octave: 5, enabled: false },
            { note: 'G', octave: 5, enabled: true },
            { note: 'E', octave: 5, enabled: true },
          ],
        },
      },
      {
        id: 'preset_mono',
        type: 'monoSynth',
        position: { x: 330, y: 220 },
        data: {
          ...defaultNodeData.monoSynth,
          tone: 1400,
          Q: 1.1,
          gain: 0.26,
          type: 'square',
        },
      },
      {
        id: 'preset_res',
        type: 'resonator',
        position: { x: 570, y: 220 },
        data: {
          ...defaultNodeData.resonator,
          tone: 680,
          Q: 16,
          spread: 9,
          mix: 0.74,
        },
      },
      {
        id: 'preset_chorus',
        type: 'chorus',
        position: { x: 800, y: 220 },
        data: {
          ...defaultNodeData.chorus,
          sync: true,
          syncDivision: '1/8',
          depth: 0.016,
          mix: 0.52,
        },
      },
      {
        id: 'preset_delay',
        type: 'delay',
        position: { x: 980, y: 220 },
        data: {
          ...defaultNodeData.delay,
          sync: true,
          syncDivision: '1/16',
        },
      },
      {
        id: 'preset_phase',
        type: 'phaseCorrelator',
        position: { x: 980, y: 460 },
        data: { label: 'Phase' },
      },
    ],
    edges: [
      { id: 'chrome-1', source: 'preset_arp', target: 'preset_mono', targetHandle: 'pitch' },
      { id: 'chrome-2', source: 'preset_mono', target: 'preset_res' },
      { id: 'chrome-3', source: 'preset_res', target: 'preset_chorus' },
      { id: 'chrome-4', source: 'preset_chorus', target: 'preset_delay' },
      { id: 'chrome-5', source: 'preset_delay', target: 'destination' },
      { id: 'chrome-6', source: 'preset_delay', target: 'preset_phase' },
    ],
  },
  {
    id: 'burnt-choir',
    name: 'Burnt Choir',
    hint: 'Chord seq + tremolo + wide + reverb',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1080, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_seq',
        type: 'chordSeq',
        position: { x: 110, y: 220 },
        data: {
          ...defaultNodeData.chordSeq,
          note: 'E',
          octave: 4,
          chordType: 'minor',
          spread: 16,
          gain: 0.24,
          syncDivision: '1/4',
          steps: [true, false, false, false, true, false, false, false, true, false, true, false, true, false, false, false],
        },
      },
      {
        id: 'preset_trem',
        type: 'tremolo',
        position: { x: 340, y: 220 },
        data: {
          ...defaultNodeData.tremolo,
          sync: true,
          syncDivision: '1/8',
          depth: 0.9,
        },
      },
      {
        id: 'preset_wide',
        type: 'stereoWidener',
        position: { x: 570, y: 220 },
        data: {
          ...defaultNodeData.stereoWidener,
          delay: 0.015,
          spread: 1.25,
          mix: 0.74,
        },
      },
      {
        id: 'preset_reverb',
        type: 'reverb',
        position: { x: 800, y: 220 },
        data: {
          ...defaultNodeData.reverb,
          decay: 5,
        },
      },
      {
        id: 'preset_phase',
        type: 'phaseCorrelator',
        position: { x: 800, y: 450 },
        data: { label: 'Phase' },
      },
    ],
    edges: [
      { id: 'choir-1', source: 'preset_seq', target: 'preset_trem' },
      { id: 'choir-2', source: 'preset_trem', target: 'preset_wide' },
      { id: 'choir-3', source: 'preset_wide', target: 'preset_reverb' },
      { id: 'choir-4', source: 'preset_reverb', target: 'destination' },
      { id: 'choir-5', source: 'preset_reverb', target: 'preset_phase' },
    ],
  },
  {
    id: 'glitch-factory',
    name: 'Glitch Factory',
    hint: 'Drums + stutter + granular + crush',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1160, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_drums',
        type: 'drumMachine',
        position: { x: 90, y: 220 },
        data: {
          ...defaultNodeData.drumMachine,
          bpm: 138,
          drumPattern: {
            kick: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
            snare: [false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false],
            hihat: [true, true, true, false, true, true, false, true, true, false, true, true, true, false, true, true],
          },
        },
      },
      {
        id: 'preset_stutter',
        type: 'stutter',
        position: { x: 330, y: 220 },
        data: {
          ...defaultNodeData.stutter,
          sync: true,
          syncDivision: '1/16',
          loopLength: 0.08,
          mix: 0.72,
        },
      },
      {
        id: 'preset_gran',
        type: 'granular',
        position: { x: 570, y: 220 },
        data: {
          ...defaultNodeData.granular,
          grainSize: 0.09,
          spray: 0.55,
          mix: 0.72,
        },
      },
      {
        id: 'preset_crush',
        type: 'bitcrusher',
        position: { x: 800, y: 220 },
        data: {
          ...defaultNodeData.bitcrusher,
          bits: 5,
          normFreq: 0.13,
          mix: 0.74,
        },
      },
      {
        id: 'preset_comp',
        type: 'compressor',
        position: { x: 980, y: 220 },
        data: {
          ...defaultNodeData.compressor,
          threshold: -22,
          ratio: 10,
          makeup: 1.3,
        },
      },
      {
        id: 'preset_scope',
        type: 'scope',
        position: { x: 980, y: 450 },
        data: { label: 'Scope' },
      },
    ],
    edges: [
      { id: 'glitch-1', source: 'preset_drums', target: 'preset_stutter' },
      { id: 'glitch-2', source: 'preset_stutter', target: 'preset_gran' },
      { id: 'glitch-3', source: 'preset_gran', target: 'preset_crush' },
      { id: 'glitch-4', source: 'preset_crush', target: 'preset_comp' },
      { id: 'glitch-5', source: 'preset_comp', target: 'destination' },
      { id: 'glitch-6', source: 'preset_comp', target: 'preset_scope' },
    ],
  },
  {
    id: 'orbit-wobble',
    name: 'Orbit Wobble',
    hint: 'Bassline + auto filter + flanger + fold',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1100, y: 280 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_bass',
        type: 'bassline',
        position: { x: 90, y: 220 },
        data: {
          ...defaultNodeData.bassline,
          note: 'G',
          octave: 2,
          tone: 1100,
          gain: 0.48,
          steps: [true, false, true, false, true, false, false, true, true, false, true, false, true, false, false, true],
        },
      },
      {
        id: 'preset_filter',
        type: 'autoFilter',
        position: { x: 330, y: 220 },
        data: {
          ...defaultNodeData.autoFilter,
          sync: true,
          syncDivision: '1/8',
          depth: 2600,
          tone: 720,
          mix: 0.92,
        },
      },
      {
        id: 'preset_flanger',
        type: 'flanger',
        position: { x: 580, y: 220 },
        data: {
          ...defaultNodeData.flanger,
          sync: true,
          syncDivision: '1/8',
          feedback: 0.62,
          mix: 0.55,
        },
      },
      {
        id: 'preset_fold',
        type: 'foldback',
        position: { x: 810, y: 220 },
        data: {
          ...defaultNodeData.foldback,
          drive: 2.8,
          threshold: 0.5,
          mix: 0.62,
        },
      },
      {
        id: 'preset_delay',
        type: 'delay',
        position: { x: 980, y: 220 },
        data: {
          ...defaultNodeData.delay,
          sync: true,
          syncDivision: '1/8',
        },
      },
      {
        id: 'preset_scope',
        type: 'scope',
        position: { x: 980, y: 450 },
        data: { label: 'Scope' },
      },
    ],
    edges: [
      { id: 'orbit-1', source: 'preset_bass', target: 'preset_filter' },
      { id: 'orbit-2', source: 'preset_filter', target: 'preset_flanger' },
      { id: 'orbit-3', source: 'preset_flanger', target: 'preset_fold' },
      { id: 'orbit-4', source: 'preset_fold', target: 'preset_delay' },
      { id: 'orbit-5', source: 'preset_delay', target: 'destination' },
      { id: 'orbit-6', source: 'preset_delay', target: 'preset_scope' },
    ],
  },
];

let nodeSequence = 1;

const isEditableNode = (
  node: SoundFlowNode | undefined,
): node is SoundFlowNode & { type: EditableAudioNodeType } => {
  return node !== undefined && node.type !== undefined && node.type !== 'destination';
};

const getMixerLabelKey = (handleId?: string | null) => {
  switch (handleId) {
    case 'ch1':
      return 'label_ch1' as const;
    case 'ch2':
      return 'label_ch2' as const;
    case 'ch3':
      return 'label_ch3' as const;
    case 'ch4':
      return 'label_ch4' as const;
    default:
      return null;
  }
};

const nextNodePlacement = () => {
  nodeSequence += 1;
  const column = (nodeSequence - 1) % 4;
  const row = Math.floor((nodeSequence - 1) / 4) % 4;

  return {
    idSuffix: nodeSequence,
    position: {
      x: 220 + column * 60,
      y: 180 + row * 70,
    },
  };
};

function App() {
  const [nodes, setNodes] = useState<SoundFlowNode[]>(baseInitialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [audioStarted, setAudioStarted] = useState(false);
  const [transport, setTransport] = useState(() => getTransportState());
  const [activeComponentTab, setActiveComponentTab] = useState<ComponentTabId>('all');
  const [activePresetId, setActivePresetId] = useState(patchPresets[0]?.id ?? '');
  const [userPatchPresets, setUserPatchPresets] = useState<PatchPreset[]>(() => readUserPatchPresets());
  const [activeUserPresetId, setActiveUserPresetId] = useState('');
  const [userPresetName, setUserPresetName] = useState('');
  const nodesRef = useRef<SoundFlowNode[]>(baseInitialNodes);
  const edgesRef = useRef<Edge[]>([]);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    audioStartedRef.current = audioStarted;
  }, [audioStarted]);

  useEffect(() => {
    const syncTransport = () => {
      setTransport(getTransportState());
    };

    syncTransport();

    window.addEventListener('transport-state', syncTransport);
    window.addEventListener('transport-start', syncTransport);
    window.addEventListener('transport-stop', syncTransport);
    window.addEventListener('transport-bpm', syncTransport);
    window.addEventListener('transport-swing', syncTransport);

    return () => {
      window.removeEventListener('transport-state', syncTransport);
      window.removeEventListener('transport-start', syncTransport);
      window.removeEventListener('transport-stop', syncTransport);
      window.removeEventListener('transport-bpm', syncTransport);
      window.removeEventListener('transport-swing', syncTransport);
    };
  }, []);

  const handleNodeDataChange = useCallback(
    (id: string, patch: Partial<SoundNodeData>) => {
      const currentNode = nodesRef.current.find((node) => node.id === id);
      if (!isEditableNode(currentNode)) {
        return;
      }

      const nextData = { ...currentNode.data, ...patch };
      const nextNodes = nodesRef.current.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, ...patch },
            }
          : node,
      );

      nodesRef.current = nextNodes;
      setNodes(nextNodes);

      if (audioStartedRef.current) {
        applyAudioNodeData(currentNode.type, id, nextData);
      }
    },
    [],
  );

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      oscillator: (props: SoundNodeProps) => (
        <OscillatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      dualOsc: (props: SoundNodeProps) => (
        <DualOscNode {...props} onDataChange={handleNodeDataChange} />
      ),
      dronePad: (props: SoundNodeProps) => (
        <DronePadNode {...props} onDataChange={handleNodeDataChange} />
      ),
      bassline: (props: SoundNodeProps) => (
        <BasslineNode {...props} onDataChange={handleNodeDataChange} />
      ),
      leadVoice: (props: SoundNodeProps) => (
        <LeadVoiceNode {...props} onDataChange={handleNodeDataChange} />
      ),
      gain: (props: SoundNodeProps) => (
        <GainNode {...props} onDataChange={handleNodeDataChange} />
      ),
      destination: DestinationNode,
      filter: (props: SoundNodeProps) => (
        <FilterNode {...props} onDataChange={handleNodeDataChange} />
      ),
      delay: (props: SoundNodeProps) => (
        <DelayNode {...props} onDataChange={handleNodeDataChange} />
      ),
      noise: NoiseNode,
      distortion: (props: SoundNodeProps) => (
        <DistortionNode {...props} onDataChange={handleNodeDataChange} />
      ),
      reverb: (props: SoundNodeProps) => (
        <ReverbNode {...props} onDataChange={handleNodeDataChange} />
      ),
      compressor: (props: SoundNodeProps) => (
        <CompressorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      chorus: (props: SoundNodeProps) => (
        <ChorusNode {...props} onDataChange={handleNodeDataChange} />
      ),
      bitcrusher: (props: SoundNodeProps) => (
        <BitcrusherNode {...props} onDataChange={handleNodeDataChange} />
      ),
      flanger: (props: SoundNodeProps) => (
        <FlangerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      limiter: (props: SoundNodeProps) => (
        <LimiterNode {...props} onDataChange={handleNodeDataChange} />
      ),
      looper: (props: SoundNodeProps) => (
        <LooperNode {...props} onDataChange={handleNodeDataChange} />
      ),
      tremolo: (props: SoundNodeProps) => (
        <TremoloNode {...props} onDataChange={handleNodeDataChange} />
      ),
      ringMod: (props: SoundNodeProps) => (
        <RingModNode {...props} onDataChange={handleNodeDataChange} />
      ),
      vibrato: (props: SoundNodeProps) => (
        <VibratoNode {...props} onDataChange={handleNodeDataChange} />
      ),
      combFilter: (props: SoundNodeProps) => (
        <CombFilterNode {...props} onDataChange={handleNodeDataChange} />
      ),
      autoPan: (props: SoundNodeProps) => (
        <AutoPanNode {...props} onDataChange={handleNodeDataChange} />
      ),
      autoFilter: (props: SoundNodeProps) => (
        <AutoFilterNode {...props} onDataChange={handleNodeDataChange} />
      ),
      clockDivider: (props: SoundNodeProps) => (
        <ClockDividerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      randomCv: (props: SoundNodeProps) => (
        <RandomCVNode {...props} onDataChange={handleNodeDataChange} />
      ),
      sampleHold: (props: SoundNodeProps) => (
        <SampleHoldNode {...props} onDataChange={handleNodeDataChange} />
      ),
      gateSeq: (props: SoundNodeProps) => (
        <GateSeqNode {...props} onDataChange={handleNodeDataChange} />
      ),
      cvOffset: (props: SoundNodeProps) => (
        <CVOffsetNode {...props} onDataChange={handleNodeDataChange} />
      ),
      envelopeFollower: (props: SoundNodeProps) => (
        <EnvelopeFollowerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      quantizer: (props: SoundNodeProps) => (
        <QuantizerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      comparator: (props: SoundNodeProps) => (
        <ComparatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      lag: (props: SoundNodeProps) => (
        <LagNode {...props} onDataChange={handleNodeDataChange} />
      ),
      chordSeq: (props: SoundNodeProps) => (
        <ChordSeqNode {...props} onDataChange={handleNodeDataChange} />
      ),
      resonator: (props: SoundNodeProps) => (
        <ResonatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      wah: (props: SoundNodeProps) => (
        <WahNode {...props} onDataChange={handleNodeDataChange} />
      ),
      stereoWidener: (props: SoundNodeProps) => (
        <StereoWidenerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      foldback: (props: SoundNodeProps) => (
        <FoldbackNode {...props} onDataChange={handleNodeDataChange} />
      ),
      tiltEq: (props: SoundNodeProps) => (
        <TiltEQNode {...props} onDataChange={handleNodeDataChange} />
      ),
      saturator: (props: SoundNodeProps) => (
        <SaturatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      cabSim: (props: SoundNodeProps) => (
        <CabSimNode {...props} onDataChange={handleNodeDataChange} />
      ),
      transientShaper: (props: SoundNodeProps) => (
        <TransientShaperNode {...props} onDataChange={handleNodeDataChange} />
      ),
      freezeFx: (props: SoundNodeProps) => (
        <FreezeFxNode {...props} onDataChange={handleNodeDataChange} />
      ),
      granular: (props: SoundNodeProps) => (
        <GranularNode {...props} onDataChange={handleNodeDataChange} />
      ),
      stutter: (props: SoundNodeProps) => (
        <StutterNode {...props} onDataChange={handleNodeDataChange} />
      ),
      humanizer: (props: SoundNodeProps) => (
        <HumanizerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      triggerDelay: (props: SoundNodeProps) => (
        <TriggerDelayNode {...props} onDataChange={handleNodeDataChange} />
      ),
      monoSynth: (props: SoundNodeProps) => (
        <MonoSynthNode {...props} onDataChange={handleNodeDataChange} />
      ),
      kickSynth: (props: SoundNodeProps) => (
        <KickSynthNode {...props} onDataChange={handleNodeDataChange} />
      ),
      snareSynth: (props: SoundNodeProps) => (
        <SnareSynthNode {...props} onDataChange={handleNodeDataChange} />
      ),
      hiHatSynth: (props: SoundNodeProps) => (
        <HiHatSynthNode {...props} onDataChange={handleNodeDataChange} />
      ),
      chordGenerator: (props: SoundNodeProps) => (
        <ChordGeneratorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      scope: ScopeNode,
      vuMeter: VUMeterNode,
      phaseCorrelator: PhaseCorrelatorNode,
      lissajous: LissajousNode,
      tuner: TunerNode,
      mixer: (props: SoundNodeProps) => (
        <MixerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      spectrogram: SpectrogramNode,
      panner: (props: SoundNodeProps) => (
        <PannerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      lfo: (props: SoundNodeProps) => (
        <LFONode {...props} onDataChange={handleNodeDataChange} />
      ),
      drumMachine: (props: SoundNodeProps) => (
        <DrumMachineNode {...props} onDataChange={handleNodeDataChange} />
      ),
      arpeggiator: (props: SoundNodeProps) => (
        <ArpeggiatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      equalizer8: (props: SoundNodeProps) => (
        <Equalizer8Node {...props} onDataChange={handleNodeDataChange} />
      ),
      phaser: (props: SoundNodeProps) => (
        <PhaserNode {...props} onDataChange={handleNodeDataChange} />
      ),
      fmSynth: (props: SoundNodeProps) => (
        <FMSynthNode {...props} onDataChange={handleNodeDataChange} />
      ),
      subOsc: (props: SoundNodeProps) => (
        <SubOscNode {...props} onDataChange={handleNodeDataChange} />
      ),
      noiseLayer: (props: SoundNodeProps) => (
        <NoiseLayerNode {...props} onDataChange={handleNodeDataChange} />
      ),
      weirdMachine: (props: SoundNodeProps) => (
        <WeirdMachineNode {...props} onDataChange={handleNodeDataChange} />
      ),
    }),
    [handleNodeDataChange],
  );

  const visibleAddNodeButtons = useMemo(() => {
    if (activeComponentTab === 'all') {
      return addNodeButtons;
    }

    return addNodeButtons.filter((button) => button.tab === activeComponentTab);
  }, [activeComponentTab]);

  const updateMixerLabel = useCallback((targetId: string, handleId?: string | null, label?: string) => {
    const labelKey = getMixerLabelKey(handleId);
    if (!labelKey) {
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id !== targetId || node.type !== 'mixer') {
          return node;
        }

        const nextData = { ...node.data };
        if (label) {
          nextData[labelKey] = label;
        } else {
          delete nextData[labelKey];
        }

        return {
          ...node,
          data: nextData,
        };
      }),
    );
  }, []);

  const buildAudioGraph = useCallback((graphNodes: SoundFlowNode[], graphEdges: Edge[]) => {
    getAudioContext();
    graphNodes.forEach((node) => {
      if (isEditableNode(node)) {
        createAudioNode(node.type, node.id, node.data);
      }
    });

    graphEdges.forEach((edge) => {
      if (edge.source && edge.target) {
        connectNodes(edge.source, edge.target, edge.targetHandle);
      }
    });

    startTransport();
    setAudioStarted(true);
    audioStartedRef.current = true;
  }, []);

  const startAudio = () => {
    buildAudioGraph(nodesRef.current, edgesRef.current);
  };

  const handleStopAudio = () => {
    void stopAudio();
    setAudioStarted(false);
    audioStartedRef.current = false;
  };

  const applyPresetGraph = useCallback(
    async (preset: PatchPreset) => {
      const shouldRestartAudio = audioStartedRef.current;

      if (shouldRestartAudio) {
        await stopAudio();
        setAudioStarted(false);
        audioStartedRef.current = false;
      }

      const nextNodes = clonePatchNodes(preset.nodes);
      const nextEdges = clonePatchEdges(preset.edges);

      nodesRef.current = nextNodes;
      edgesRef.current = nextEdges;
      setNodes(nextNodes);
      setEdges(nextEdges);

      if (shouldRestartAudio) {
        buildAudioGraph(nextNodes, nextEdges);
      }
    },
    [buildAudioGraph],
  );

  const loadPreset = useCallback(
    async (presetId: string) => {
      const preset = patchPresets.find((entry) => entry.id === presetId);
      if (!preset) {
        return;
      }

      setActivePresetId(presetId);
      setActiveUserPresetId('');
      await applyPresetGraph(preset);
    },
    [applyPresetGraph],
  );

  const loadUserPreset = useCallback(
    async (presetId: string) => {
      const preset = userPatchPresets.find((entry) => entry.id === presetId);
      if (!preset) {
        return;
      }

      setActiveUserPresetId(presetId);
      await applyPresetGraph(preset);
    },
    [applyPresetGraph, userPatchPresets],
  );

  const saveCurrentPatchAsPreset = useCallback(() => {
    const trimmedName = userPresetName.trim();
    const fallbackIndex = userPatchPresets.length + 1;
    const nextName = trimmedName || `Patch ${fallbackIndex}`;
    const presetHint = buildUserPatchHint(nodesRef.current, edgesRef.current);
    const existingPreset = userPatchPresets.find(
      (preset) => preset.name.toLowerCase() === nextName.toLowerCase(),
    );

    const nextPreset: PatchPreset = {
      id: existingPreset?.id ?? `user-${Date.now()}`,
      name: nextName,
      hint: presetHint,
      nodes: clonePatchNodes(nodesRef.current),
      edges: clonePatchEdges(edgesRef.current),
    };

    const nextUserPresets = existingPreset
      ? userPatchPresets.map((preset) => (preset.id === existingPreset.id ? nextPreset : preset))
      : [...userPatchPresets, nextPreset];

    writeUserPatchPresets(nextUserPresets);
    setUserPatchPresets(nextUserPresets);
    setActiveUserPresetId(nextPreset.id);
    setUserPresetName(nextName);
  }, [userPatchPresets, userPresetName]);

  const deleteUserPreset = useCallback(() => {
    if (!activeUserPresetId) {
      return;
    }

    const nextUserPresets = userPatchPresets.filter((preset) => preset.id !== activeUserPresetId);
    writeUserPatchPresets(nextUserPresets);
    setUserPatchPresets(nextUserPresets);
    setActiveUserPresetId('');
  }, [activeUserPresetId, userPatchPresets]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes) as SoundFlowNode[]);
    },
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
    },
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((currentEdges) => addEdge(params, currentEdges));

      if (params.source && params.target) {
        const sourceNode = nodes.find((node) => node.id === params.source);
        const sourceLabel = sourceNode?.data.label ?? sourceNode?.type ?? 'Unknown';
        updateMixerLabel(params.target, params.targetHandle, sourceLabel);

        if (audioStarted) {
          connectNodes(params.source, params.target, params.targetHandle);
        }
      }
    },
    [audioStarted, nodes, updateMixerLabel],
  );

  const onNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {
    deletedNodes.forEach((node) => {
      removeNode(node.id);
    });
  }, []);

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      deletedEdges.forEach((edge) => {
        if (!edge.source || !edge.target) {
          return;
        }

        updateMixerLabel(edge.target, edge.targetHandle);

        if (audioStarted) {
          disconnectNodes(edge.source, edge.target, edge.targetHandle);
        }
      });
    },
    [audioStarted, updateMixerLabel],
  );

  const addNode = (type: EditableAudioNodeType) => {
    const placement = nextNodePlacement();
    const id = `${type}_${placement.idSuffix}`;

    const newNode: SoundFlowNode = {
      id,
      type,
      position: placement.position,
      data: { ...defaultNodeData[type] },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);

    if (audioStarted) {
      createAudioNode(type, id, newNode.data);
    }
  };

  const testSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.error('Test sound error:', error);
    }
  };

  const onEdgeClick = useCallback(
    (_event: ReactMouseEvent, edge: Edge) => {
      setEdges((currentEdges) => currentEdges.filter((currentEdge) => currentEdge.id !== edge.id));

      if (!edge.source || !edge.target) {
        return;
      }

      updateMixerLabel(edge.target, edge.targetHandle);

      if (audioStarted) {
        disconnectNodes(edge.source, edge.target, edge.targetHandle);
      }
    },
    [audioStarted, updateMixerLabel],
  );

  return (
    <div className="w-full h-full flex flex-col bg-black text-white selection:bg-sky-500/30">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#3a7bd5" />
          </linearGradient>
        </defs>
      </svg>

      <header className="px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-50 gap-4">
        <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0" onClick={testSound}>
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent hidden sm:block">
            SOUND<span className="text-sky-500">LAB</span>
          </h1>
        </div>

        <div className="flex-1 mx-2 min-w-0 bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {componentTabs.map((tab) => {
              const isActive = activeComponentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveComponentTab(tab.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border transition-all ${
                    isActive
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 text-white/55 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title={tab.hint}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
            <div className="text-[9px] uppercase tracking-[0.22em] text-white/40">Patch Presets</div>
            <select
              value={activePresetId}
              onChange={(event) => setActivePresetId(event.target.value)}
              className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-sky-400 min-w-[180px]"
            >
              {patchPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <button
              onClick={(event) => {
                event.stopPropagation();
                void loadPreset(activePresetId);
              }}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25 transition-all"
              title={patchPresets.find((preset) => preset.id === activePresetId)?.hint}
            >
              Load Patch
            </button>
            <div className="text-[10px] text-white/40 truncate">
              {patchPresets.find((preset) => preset.id === activePresetId)?.hint}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
            <div className="text-[9px] uppercase tracking-[0.22em] text-white/40">My Patches</div>
            <input
              type="text"
              value={userPresetName}
              onChange={(event) => setUserPresetName(event.target.value)}
              onMouseDown={(event) => event.stopPropagation()}
              placeholder="Nom del patch"
              className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-emerald-400 min-w-[170px]"
            />
            <button
              onClick={(event) => {
                event.stopPropagation();
                saveCurrentPatchAsPreset();
              }}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
            >
              Save Current
            </button>
            <select
              value={activeUserPresetId}
              onChange={(event) => setActiveUserPresetId(event.target.value)}
              className="bg-slate-950/80 text-white text-xs p-2 rounded-xl border border-white/10 outline-none focus:border-emerald-400 min-w-[180px]"
            >
              <option value="">Tria un patch guardat</option>
              {userPatchPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <button
              onClick={(event) => {
                event.stopPropagation();
                if (activeUserPresetId) {
                  void loadUserPreset(activeUserPresetId);
                }
              }}
              disabled={!activeUserPresetId}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-white/5 text-white/75 border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Load Saved
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteUserPreset();
              }}
              disabled={!activeUserPresetId}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <div className="text-[10px] text-white/40 truncate">
              {userPatchPresets.find((preset) => preset.id === activeUserPresetId)?.hint ?? 'Guarda el graf actual al navegador'}
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5 min-w-0">
            {visibleAddNodeButtons.map((button) => (
              <button
                key={button.type}
                onClick={(event) => {
                  event.stopPropagation();
                  addNode(button.type);
                }}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter border ${button.color} hover:bg-white/10 hover:scale-105 transition-all active:scale-95 flex-shrink-0 whitespace-nowrap shadow-lg`}
              >
                + {button.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden xl:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 16 }, (_, step) => (
                <div
                  key={`transport-step-${step}`}
                  className={`w-2 h-6 rounded-full transition-all ${
                    transport.step % 16 === step && transport.isPlaying
                      ? 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.85)]'
                      : 'bg-white/10'
                  } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''}`}
                />
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/45 whitespace-nowrap">
              {transport.isPlaying ? 'Running' : 'Stopped'}
            </div>
            <Knob
              label="BPM"
              min={60}
              max={180}
              step={1}
              value={transport.bpm}
              onChange={setTransportBpm}
              color="#38bdf8"
              size={46}
            />
            <div className="min-w-[96px]">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Swing</label>
              <input
                type="range"
                min={0}
                max={0.45}
                step={0.01}
                value={transport.swing}
                onChange={(event) => setTransportSwing(Number(event.target.value))}
                className="w-full accent-rose-400"
              />
              <div className="text-[10px] text-white/55 mt-1 font-mono">{Math.round(transport.swing * 100)}%</div>
            </div>
          </div>

          {!audioStarted ? (
            <button
              onClick={startAudio}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              START ENGINE
            </button>
          ) : (
            <button
              onClick={handleStopAudio}
              className="bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white/60 border border-white/10 px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center gap-2 active:scale-95"
            >
              <VolumeX className="w-4 h-4" />
              STOP
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 relative">
        {!audioStarted && (
          <div className="absolute inset-0 bg-slate-950/80 z-40 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-sky-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Benvingut al Manipulador de So</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Fes clic al boto superior per activar l'audio i comencar a crear el teu sintetitzador modular.
              </p>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-black"
        >
          <Background color="#111" gap={20} />
          <Controls className="glass-panel !fill-white !bg-transparent !border-white/10" />
        </ReactFlow>

        <div className="absolute bottom-4 left-4 z-50 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md p-3 border border-slate-800 rounded-lg text-[10px] text-slate-400 uppercase tracking-widest">
            <p className="mb-1">Comandes:</p>
            <ul className="list-none p-0 m-0">
              <li>- Arrossega per moure moduls</li>
              <li>- Clic sobre un cable per esborrar-lo</li>
              <li>- Tecla Del per esborrar modul/cable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
