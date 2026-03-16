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
import './App.css';
import DestinationNode from './nodes/DestinationNode';
import DelayNode from './nodes/DelayNode';
import SpectralDelayNode from './nodes/SpectralDelayNode';
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
import SamplerNode from './nodes/SamplerNode';
import PannerNode from './nodes/PannerNode';
import ReverbNode from './nodes/ReverbNode';
import ScopeNode from './nodes/ScopeNode';
import SpectrogramNode from './nodes/SpectrogramNode';
import DrumMachineNode from './nodes/DrumMachineNode';
import Drum2Node from './nodes/Drum2Node';
import ArpeggiatorNode from './nodes/ArpeggiatorNode';
import Arp2Node from './nodes/Arp2Node';
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
import ChaosShrineNode from './nodes/ChaosShrineNode';
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
import { SoundLabHeader } from './components/header/SoundLabHeader';
import { TransportAside } from './components/layout/TransportAside';
import { TutorialModal } from './components/layout/TutorialModal';
import {
  applyAudioNodeData,
  connectNodes,
  createAudioNode,
  disconnectNodes,
  getAudioContext,
  getDestinationInput,
  getRecordingState,
  getTransportState,
  removeNode,
  setTransportBpm,
  setTransportSwing,
  startRecording,
  startTransport,
  stopRecording,
  stopAudio,
} from './AudioEngine';
import { addNodeButtons, machineSetTemplates, type ComponentTabId } from './editorConfig';
import { defaultNodeData } from './nodeDefaults';
import {
  buildPatchPresetId,
  buildUserPatchHint,
  clonePatchEdges,
  clonePatchNodes,
  formatPatchPresetForCode,
  patchPresets,
  readUserPatchPresets,
  writeUserPatchPresets,
  type PatchPreset,
} from './presetLibrary';
import type { EditableAudioNodeType, SoundFlowNode, SoundNodeData, SoundNodeProps } from './types';
import type { RecordingChannelMode } from './AudioEngine';

const baseInitialNodes: SoundFlowNode[] = [
  {
    id: 'destination',
    type: 'destination',
    position: { x: 1230, y: 260 },
    data: { label: 'Sortida' },
  },
  {
    id: 'drum2_1',
    type: 'drum2',
    position: { x: -1000, y: 260 },
    data: {
      ...defaultNodeData.drum2,
      label: 'DRUM2',
    },
  },
  {
    id: 'arp2_1',
    type: 'arp2',
    position: { x: -1000, y: -540 },
    data: {
      ...defaultNodeData.arp2,
      label: 'ARP2',
      arpMode: 'down',
      arpScale: 'pentatonic',
      arpOctaveSpan: 2,
      arpRatchet: 2,
      arp2Steps: [
        { note: 'F#', octave: 3, enabled: true },
        { note: 'C#', octave: 4, enabled: true },
        { note: 'F#', octave: 4, enabled: true },
        { note: 'A', octave: 4, enabled: true },
        { note: 'C#', octave: 5, enabled: true },
        { note: 'F#', octave: 5, enabled: true },
        { note: 'A', octave: 5, enabled: true },
        { note: 'C#', octave: 6, enabled: true },
        { note: 'A', octave: 5, enabled: true },
        { note: 'F#', octave: 5, enabled: true },
        { note: 'C#', octave: 5, enabled: true },
        { note: 'A', octave: 4, enabled: true },
        { note: 'F#', octave: 4, enabled: true },
        { note: 'C#', octave: 4, enabled: true },
        { note: 'A', octave: 3, enabled: true },
        { note: 'F#', octave: 3, enabled: true },
      ],
    },
  },
  {
    id: 'leadVoice_1',
    type: 'leadVoice',
    position: { x: 220, y: -540 },
    data: {
      ...defaultNodeData.leadVoice,
      label: 'Lead Voice',
      frequency: 20,
      tone: 1280,
      Q: 0.1,
      glide: 0,
      type: 'sine',
      gain: 0.3,
    },
  },
  {
    id: 'arpeggiator_1',
    type: 'arpeggiator',
    position: { x: -996, y:  -912 },
    data: {
      ...defaultNodeData.arpeggiator,
      label: 'Arpeggiator',
      syncDivision: '1/1',
      arpSteps: [
        { note: 'C', octave: 3, enabled: true },
        { note: 'G', octave: 3, enabled: true },
        { note: 'A', octave: 3, enabled: true },
        { note: 'F', octave: 3, enabled: true },
        { note: 'C', octave: 3, enabled: true },
        { note: 'G', octave: 3, enabled: true },
        { note: 'A', octave: 3, enabled: true },
        { note: 'F', octave: 3, enabled: true },
      ],
    },
  },
  {
    id: 'subOsc_1',
    type: 'subOsc',
    position: { x: 220, y: -912 },
    data: {
      ...defaultNodeData.subOsc,
      label: 'Sub Osc',
      type: 'triangle',
    },
  },
  {
    id: 'mixer_1',
    type: 'mixer',
    position: { x: 650, y: 260 },
    data: {
      ...defaultNodeData.mixer,
      label: 'Mixer',
      label_ch1: 'DRUM2',
      label_ch2: 'Lead Voice',
      label_ch3: 'Sub Osc',
    },
  },
];

const baseInitialEdges: Edge[] = [
  {
    id: 'reactflow__edge-arp2_1-leadVoice_1pitch',
    source: 'arp2_1',
    target: 'leadVoice_1',
    targetHandle: 'pitch',
  },
  {
    id: 'reactflow__edge-drum2_1-mixer_1ch1',
    source: 'drum2_1',
    target: 'mixer_1',
    targetHandle: 'ch1',
  },
  {
    id: 'reactflow__edge-leadVoice_1-mixer_1ch2',
    source: 'leadVoice_1',
    target: 'mixer_1',
    targetHandle: 'ch2',
  },
  {
    id: 'reactflow__edge-arpeggiator_1-subOsc_1pitch',
    source: 'arpeggiator_1',
    target: 'subOsc_1',
    targetHandle: 'pitch',
  },
  {
    id: 'reactflow__edge-subOsc_1-mixer_1ch3',
    source: 'subOsc_1',
    target: 'mixer_1',
    targetHandle: 'ch3',
  },
  {
    id: 'reactflow__edge-mixer_1-destination',
    source: 'mixer_1',
    target: 'destination',
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
  const [edges, setEdges] = useState<Edge[]>(baseInitialEdges);
  const [audioStarted, setAudioStarted] = useState(false);
  const [transport, setTransport] = useState(() => getTransportState());
  const [recording, setRecording] = useState(() => getRecordingState());
  const [recordingFeedback, setRecordingFeedback] = useState('');
  const [recordingFileName, setRecordingFileName] = useState('');
  const [recordingNormalize, setRecordingNormalize] = useState(false);
  const [recordingChannelMode, setRecordingChannelMode] = useState<RecordingChannelMode>('stereo');
  const [activeComponentTab, setActiveComponentTab] = useState<ComponentTabId>('all');
  const [activePresetId, setActivePresetId] = useState(patchPresets[0]?.id ?? '');
  const [userPatchPresets, setUserPatchPresets] = useState<PatchPreset[]>(() => readUserPatchPresets());
  const [activeUserPresetId, setActiveUserPresetId] = useState('');
  const [userPresetName, setUserPresetName] = useState('');
  const [exportedPresetCode, setExportedPresetCode] = useState('');
  const [exportPresetFeedback, setExportPresetFeedback] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const nodesRef = useRef<SoundFlowNode[]>(baseInitialNodes);
  const edgesRef = useRef<Edge[]>(baseInitialEdges);
  const audioStartedRef = useRef(false);
  const recordingRef = useRef(getRecordingState());

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
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    if (!exportPresetFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setExportPresetFeedback('');
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [exportPresetFeedback]);

  useEffect(() => {
    if (!recordingFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecordingFeedback('');
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [recordingFeedback]);

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

  useEffect(() => {
    const syncRecording = () => {
      setRecording(getRecordingState());
    };

    syncRecording();
    window.addEventListener('recording-state', syncRecording);

    return () => {
      window.removeEventListener('recording-state', syncRecording);
    };
  }, []);

  const downloadRecordingExport = useCallback(
    (
      exportedRecording: ReturnType<typeof stopRecording>,
      feedbackMessage: string,
    ) => {
      if (!exportedRecording) {
        return;
      }

      const downloadUrl = URL.createObjectURL(exportedRecording.blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = exportedRecording.fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setRecordingFeedback(feedbackMessage);
    },
    [],
  );

  const flushRecordingIfNeeded = useCallback(
    (feedbackMessage: string) => {
      if (!recordingRef.current.isRecording) {
        return;
      }

      downloadRecordingExport(stopRecording(), feedbackMessage);
    },
    [downloadRecordingExport],
  );

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
        applyAudioNodeData(currentNode.type, id, nextData, patch);
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
      sampler: (props: SoundNodeProps) => (
        <SamplerNode {...props} onDataChange={handleNodeDataChange} />
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
      spectralDelay: (props: SoundNodeProps) => (
        <SpectralDelayNode {...props} onDataChange={handleNodeDataChange} />
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
      drum2: (props: SoundNodeProps) => (
        <Drum2Node {...props} onDataChange={handleNodeDataChange} />
      ),
      arpeggiator: (props: SoundNodeProps) => (
        <ArpeggiatorNode {...props} onDataChange={handleNodeDataChange} />
      ),
      arp2: (props: SoundNodeProps) => (
        <Arp2Node {...props} onDataChange={handleNodeDataChange} />
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
      chaosShrine: (props: SoundNodeProps) => (
        <ChaosShrineNode {...props} onDataChange={handleNodeDataChange} />
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

  const visibleMachineSets = useMemo(() => {
    if (activeComponentTab === 'all') {
      return machineSetTemplates;
    }

    return machineSetTemplates.filter((setTemplate) => setTemplate.tab === activeComponentTab);
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
    const finish = async () => {
      flushRecordingIfNeeded('WAV exportat en aturar el motor');

      await stopAudio();
      setAudioStarted(false);
      audioStartedRef.current = false;
    };

    void finish();
  };

  const applyPresetGraph = useCallback(
    async (preset: PatchPreset) => {
      const shouldRestartAudio = audioStartedRef.current;

      if (shouldRestartAudio) {
        flushRecordingIfNeeded('WAV exportat en canviar de patch');
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

  const resetCanvas = useCallback(async () => {
    nodeSequence = 1;
    setActiveUserPresetId('');
    await applyPresetGraph({
      id: 'reset-canvas',
      name: 'Reset Canvas',
      hint: 'Canvas net',
      nodes: clonePatchNodes(baseInitialNodes),
      edges: clonePatchEdges(baseInitialEdges),
    });
  }, [applyPresetGraph]);

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

  const exportCurrentPatchPreset = useCallback(async () => {
    const trimmedName = userPresetName.trim();
    const fallbackIndex = userPatchPresets.length + 1;
    const nextName = trimmedName || `Patch ${fallbackIndex}`;
    const nextPreset: PatchPreset = {
      id: buildPatchPresetId(nextName),
      name: nextName,
      hint: buildUserPatchHint(nodesRef.current, edgesRef.current),
      nodes: clonePatchNodes(nodesRef.current),
      edges: clonePatchEdges(edgesRef.current),
    };
    const presetCode = formatPatchPresetForCode(nextPreset);

    setUserPresetName(nextName);
    setExportedPresetCode(presetCode);

    try {
      await navigator.clipboard.writeText(presetCode);
      setExportPresetFeedback('Preset copiat al porta-retalls');
    } catch {
      setExportPresetFeedback('No s\'ha pogut copiar, pero el codi ha quedat aci baix');
    }
  }, [userPatchPresets.length, userPresetName]);

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

  const addMachineSet = useCallback(
    (setId: string) => {
      const template = machineSetTemplates.find((entry) => entry.id === setId);
      if (!template || template.nodes.length === 0) {
        return;
      }

      const anchorPlacement = nextNodePlacement();
      const idsByKey = new Map<string, string>();

      const nextNodes = template.nodes.map((nodeTemplate, index) => {
        const placement = index === 0 ? anchorPlacement : nextNodePlacement();
        const id = `${nodeTemplate.type}_${placement.idSuffix}`;
        idsByKey.set(nodeTemplate.key, id);

        return {
          id,
          type: nodeTemplate.type,
          position: {
            x: anchorPlacement.position.x + nodeTemplate.offset.x,
            y: anchorPlacement.position.y + nodeTemplate.offset.y,
          },
          data: {
            ...defaultNodeData[nodeTemplate.type],
            ...nodeTemplate.data,
          },
        } satisfies SoundFlowNode;
      });

      const nextEdges: Edge[] = template.edges.reduce<Edge[]>((accumulator, edgeTemplate, index) => {
        const sourceId = idsByKey.get(edgeTemplate.source);
        const targetId = idsByKey.get(edgeTemplate.target);

        if (!sourceId || !targetId) {
          return accumulator;
        }

        accumulator.push({
          id: `${template.id}-${index}-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          targetHandle: edgeTemplate.targetHandle ?? null,
        });

        return accumulator;
      }, []);

      setNodes((currentNodes) => [...currentNodes, ...nextNodes]);
      setEdges((currentEdges) => [...currentEdges, ...nextEdges]);

      if (!audioStarted) {
        return;
      }

      nextNodes.forEach((node) => {
        createAudioNode(node.type, node.id, node.data);
      });

      nextEdges.forEach((edge) => {
        if (edge.source && edge.target) {
          connectNodes(edge.source, edge.target, edge.targetHandle);
        }
      });
    },
    [audioStarted],
  );

  const testSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(getDestinationInput());
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

  const handleStartRecording = () => {
    if (!audioStartedRef.current) {
      setRecordingFeedback('Engega el motor abans de gravar');
      return;
    }

    const didStartRecording = startRecording({
      fileNameBase: recordingFileName,
      normalize: recordingNormalize,
      channelMode: recordingChannelMode,
    });
    if (didStartRecording) {
      setRecordingFeedback(
        `Gravacio en marxa (${recordingChannelMode}${recordingNormalize ? ', normalize' : ''})`,
      );
    }
  };

  const handleStopRecording = () => {
    downloadRecordingExport(stopRecording(), 'WAV descarregat');
  };

  return (
    <div className="app-shell" data-tutorial="app-shell">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#3a7bd5" />
          </linearGradient>
        </defs>
      </svg>

      <SoundLabHeader
        patchPresets={patchPresets}
        activePresetId={activePresetId}
        onActivePresetIdChange={setActivePresetId}
        onLoadPreset={() => {
          void loadPreset(activePresetId);
        }}
        userPresetName={userPresetName}
        onUserPresetNameChange={setUserPresetName}
        onSaveCurrent={saveCurrentPatchAsPreset}
        onExportPreset={() => {
          void exportCurrentPatchPreset();
        }}
        activeUserPresetId={activeUserPresetId}
        onActiveUserPresetIdChange={setActiveUserPresetId}
        userPatchPresets={userPatchPresets}
        onLoadUserPreset={() => {
          if (activeUserPresetId) {
            void loadUserPreset(activeUserPresetId);
          }
        }}
        onDeleteUserPreset={deleteUserPreset}
        exportPresetFeedback={exportPresetFeedback}
        exportedPresetCode={exportedPresetCode}
        activeComponentTab={activeComponentTab}
        onSelectComponentTab={setActiveComponentTab}
        visibleMachineSets={visibleMachineSets}
        onAddMachineSet={addMachineSet}
        onTestSound={testSound}
      />

      <div className="app-shell__body">
        <aside className="app-shell__sidebar">
          <section className="app-shell__sidebar-panel" data-tutorial="components-sidebar">
            <div className="app-shell__sidebar-header">
              <div className="app-shell__sidebar-title">Components</div>
              <div className="app-shell__sidebar-count">{visibleAddNodeButtons.length}</div>
            </div>
            <nav className="app-shell__sidebar-nav" data-tutorial="components-list">
              {visibleAddNodeButtons.map((button) => (
                <button
                  key={button.type}
                  onClick={(event) => {
                    event.stopPropagation();
                    addNode(button.type);
                  }}
                  className={`app-shell__sidebar-button ${button.color}`}
                >
                  + {button.label}
                </button>
              ))}
            </nav>
          </section>
        </aside>

        <main className="app-shell__main" data-tutorial="patch-canvas">
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
            proOptions={{ hideAttribution: true }}
            fitView
            className="app-shell__flow"
          >
            <Background color="#111" gap={20} />
            <Controls className="glass-panel app-flow-controls" />
          </ReactFlow>

          
        </main>

        <TransportAside
          transport={transport}
          audioStarted={audioStarted}
          recording={recording}
          recordingFeedback={recordingFeedback}
          recordingFileName={recordingFileName}
          recordingNormalize={recordingNormalize}
          recordingChannelMode={recordingChannelMode}
          onSetTransportBpm={setTransportBpm}
          onSetTransportSwing={setTransportSwing}
          onStartAudio={startAudio}
          onStopAudio={handleStopAudio}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onRecordingFileNameChange={setRecordingFileName}
          onRecordingNormalizeChange={setRecordingNormalize}
          onRecordingChannelModeChange={setRecordingChannelMode}
          onResetCanvas={() => {
            void resetCanvas();
          }}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />
      </div>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}

export default App;
