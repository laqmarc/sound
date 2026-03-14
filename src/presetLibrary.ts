import type { Edge } from 'reactflow';
import type { EditableAudioNodeType, SoundFlowNode, SoundNodeData } from './types';
import { defaultNodeData } from './nodeDefaults';

export interface PatchPreset {
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

export const clonePatchNodes = (nodes: SoundFlowNode[]) => cloneSerializable(nodes);

export const clonePatchEdges = (edges: Edge[]) => cloneSerializable(edges);

export const buildUserPatchHint = (nodes: SoundFlowNode[], edges: Edge[]) => {
  const moduleCount = nodes.filter((node) => node.type !== 'destination').length;
  const moduleLabel = `${moduleCount} modul${moduleCount === 1 ? '' : 's'}`;
  const cableLabel = `${edges.length} cable${edges.length === 1 ? '' : 's'}`;
  return `${moduleLabel} | ${cableLabel}`;
};

export const buildPatchPresetId = (name: string) => {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `patch-${Date.now()}`;
};

export const formatPatchPresetForCode = (preset: PatchPreset) => `${JSON.stringify(preset, null, 2)},`;

export const readUserPatchPresets = (): PatchPreset[] => {
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

export const writeUserPatchPresets = (presets: PatchPreset[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_PATCH_STORAGE_KEY, JSON.stringify(presets));
};

export const createPatchPresets = (defaultNodeData: Record<EditableAudioNodeType, SoundNodeData>): PatchPreset[] => [
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
  {
    id: 'quitusbass',
    name: 'quitusbass',
    hint: 'Bassline + drums + mutant arp through mixer',
    nodes: [
      {
        id: 'destination',
        type: 'destination',
        position: { x: 1804, y: 242 },
        data: { label: 'Sortida' },
      },
      {
        id: 'preset_bassline',
        type: 'bassline',
        position: { x: 45, y: -180 },
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
        id: 'compressor_6',
        type: 'compressor',
        position: { x: 536, y: -187 },
        data: {
          ...defaultNodeData.compressor,
          threshold: -49,
          knee: 18,
          ratio: 6,
          attack: 0.01,
          release: 0.1,
          makeup: 0.51,
        },
      },
      {
        id: 'drumMachine_2',
        type: 'drumMachine',
        position: { x: 43, y: 241 },
        data: {
          ...defaultNodeData.drumMachine,
          bpm: 120,
          drumPattern: {
            kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
            snare: [false, false, false, true, false, false, true, false, false, false, false, true, false, false, true, false],
            hihat: Array.from({ length: 16 }, () => true),
          },
        },
      },
      {
        id: 'mixer_3',
        type: 'mixer',
        position: { x: 1022, y: 127 },
        data: {
          ...defaultNodeData.mixer,
          ch1: 1,
          ch2: 0.39,
          ch3: 0.09,
          ch4: 0.5,
          ch1_low: 6.6,
          ch1_mid: 0,
          ch1_high: 0,
          ch1_pan: 0,
          ch2_low: 0,
          ch2_mid: 0,
          ch2_high: 0,
          ch2_pan: 0,
          ch3_low: 0,
          ch3_mid: 0,
          ch3_high: 0,
          ch3_pan: 0,
          ch4_low: 0,
          ch4_mid: 0,
          ch4_high: 0,
          ch4_pan: 0,
          label_ch1: 'Compressor',
          label_ch2: 'Drum Machine',
          label_ch3: 'Mutant Box',
        },
      },
      {
        id: 'weirdMachine_4',
        type: 'weirdMachine',
        position: { x: 1068, y: -845 },
        data: {
          ...defaultNodeData.weirdMachine,
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
          sync: true,
          syncDivision: '1/8',
          steps: [true, false, true, false, true, true, false, true],
        },
      },
      {
        id: 'arpeggiator_5',
        type: 'arpeggiator',
        position: { x: -19, y: -857 },
        data: {
          ...defaultNodeData.arpeggiator,
        },
      },
    ],
    edges: [
      { id: 'quitus-1', source: 'preset_bassline', target: 'compressor_6' },
      { id: 'quitus-2', source: 'compressor_6', target: 'mixer_3', targetHandle: 'ch1' },
      { id: 'quitus-3', source: 'drumMachine_2', target: 'mixer_3', targetHandle: 'ch2' },
      { id: 'quitus-4', source: 'arpeggiator_5', target: 'weirdMachine_4', targetHandle: 'pitch' },
      { id: 'quitus-5', source: 'weirdMachine_4', target: 'mixer_3', targetHandle: 'ch3' },
      { id: 'quitus-6', source: 'mixer_3', target: 'destination' },
    ],
  },
];

export const patchPresets = createPatchPresets(defaultNodeData);


