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
import PannerNode from './nodes/PannerNode';
import ReverbNode from './nodes/ReverbNode';
import ScopeNode from './nodes/ScopeNode';
import SpectrogramNode from './nodes/SpectrogramNode';
import DrumMachineNode from './nodes/DrumMachineNode';
import ArpeggiatorNode from './nodes/ArpeggiatorNode';
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
  { note: 'C', octave: 4 },
  { note: 'E', octave: 4 },
  { note: 'G', octave: 4 },
  { note: 'B', octave: 4 },
  { note: 'C', octave: 5 },
  { note: 'B', octave: 4 },
  { note: 'G', octave: 4 },
  { note: 'E', octave: 4 },
];

const defaultNodeData: Record<EditableAudioNodeType, SoundNodeData> = {
  oscillator: {
    label: 'Oscillator',
    frequency: 440,
    type: 'sine',
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
  scope: {
    label: 'Scope',
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
    arpSteps: defaultArpSteps(),
  },
};

const addNodeButtons: Array<{
  type: EditableAudioNodeType;
  label: string;
  color: string;
}> = [
  { type: 'oscillator', label: 'Osc', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { type: 'noise', label: 'Noise', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { type: 'lfo', label: 'LFO', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { type: 'gain', label: 'Gain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { type: 'filter', label: 'Filter', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { type: 'distortion', label: 'Disto', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { type: 'delay', label: 'Delay', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { type: 'reverb', label: 'Reverb', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { type: 'mixer', label: 'Mixer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { type: 'panner', label: 'Panner', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { type: 'scope', label: 'Scope', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { type: 'spectrogram', label: 'Spectrum', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { type: 'drumMachine', label: 'Drums', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { type: 'arpeggiator', label: 'Arp', color: 'bg-lime-500/10 text-lime-400 border-lime-500/20' },
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
  const nodesRef = useRef<SoundFlowNode[]>(baseInitialNodes);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

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
      scope: ScopeNode,
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
    }),
    [handleNodeDataChange],
  );

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

  const startAudio = () => {
    getAudioContext();
    nodes.forEach((node) => {
      if (isEditableNode(node)) {
        createAudioNode(node.type, node.id, node.data);
      }
    });

    edges.forEach((edge) => {
      if (edge.source && edge.target) {
        connectNodes(edge.source, edge.target, edge.targetHandle);
      }
    });

    startTransport();
    setAudioStarted(true);
  };

  const handleStopAudio = () => {
    void stopAudio();
    setAudioStarted(false);
  };

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

        <nav className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth shadow-inner flex-1 mx-2">
          {addNodeButtons.map((button) => (
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
