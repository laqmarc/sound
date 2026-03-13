import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  type Connection, 
  type Edge, 
  type Node, 
  type NodeChange,
  type EdgeChange,
  type OnConnect,
  type OnNodesDelete
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Volume2, VolumeX, Plus, Zap, Trash2 } from 'lucide-react';

import OscillatorNode from './nodes/OscillatorNode';
import GainNode from './nodes/GainNode';
import DestinationNode from './nodes/DestinationNode';
import FilterNode from './nodes/FilterNode';
import DelayNode from './nodes/DelayNode';
import NoiseNode from './nodes/NoiseNode';
import DistortionNode from './nodes/DistortionNode';
import ReverbNode from './nodes/ReverbNode';
import ScopeNode from './nodes/ScopeNode';
import MixerNode from './nodes/MixerNode';
import SpectrogramNode from './nodes/SpectrogramNode';
import PannerNode from './nodes/PannerNode';
import LFONode from './nodes/LFONode';
import { 
  getAudioContext, 
  createOscillator, 
  createGain, 
  createFilter,
  createDelay,
  createNoise,
  createDistortion,
  createReverb,
  createMixer,
  createAnalyser,
  createPanner,
  createLFO,
  connectNodes, 
  disconnectNodes, 
  removeNode,
  stopAudio 
} from './AudioEngine';

const initialNodes: Node[] = [
  {
    id: 'destination',
    type: 'destination',
    position: { x: 800, y: 300 },
    data: { label: 'Sortida' },
  },
  {
    id: 'osc_init',
    type: 'oscillator',
    position: { x: 100, y: 100 },
    data: { frequency: 440, type: 'sine' },
  },
];

const nodeTypes = {
  oscillator: OscillatorNode,
  gain: GainNode,
  destination: DestinationNode,
  filter: FilterNode,
  delay: DelayNode,
  noise: NoiseNode,
  distortion: DistortionNode,
  reverb: ReverbNode,
  scope: ScopeNode,
  mixer: MixerNode,
  spectrogram: SpectrogramNode,
  panner: PannerNode,
  lfo: LFONode,
};

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [audioStarted, setAudioStarted] = useState(false);

  // Memoitzem nodeTypes per evitar re-renders innecessaris i warnings de React Flow
  const nodeTypesMemo = useMemo(() => nodeTypes, []);

  const startAudio = () => {
    getAudioContext();
    setAudioStarted(true);
    // Registrem TOTS els nodes que ja estan a la pantalla al motor d'àudio
    nodes.forEach(node => {
      if (node.type === 'oscillator') {
        createOscillator(node.id);
      } else if (node.type === 'gain') {
        createGain(node.id);
      } else if (node.type === 'filter') {
        createFilter(node.id);
      } else if (node.type === 'delay') {
        createDelay(node.id);
      } else if (node.type === 'noise') {
        createNoise(node.id);
      } else if (node.type === 'distortion') {
        createDistortion(node.id);
      } else if (node.type === 'reverb') {
        createReverb(node.id);
      } else if (node.type === 'mixer') {
        createMixer(node.id);
      } else if (node.type === 'spectrogram') {
        createAnalyser(node.id);
      } else if (node.type === 'panner') {
        createPanner(node.id);
      } else if (node.type === 'lfo') {
        createLFO(node.id);
      } else if (node.type === 'scope') {
        createAnalyser(node.id);
      }
    });
    // Re-connectem els edges existents
    edges.forEach(edge => {
      if (edge.source && edge.target) {
        connectNodes(edge.source, edge.target, edge.targetHandle);
      }
    });
  };

  const handleStopAudio = () => {
    stopAudio();
    setAudioStarted(false);
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
    if (params.source && params.target) {
      connectNodes(params.source, params.target, params.targetHandle);
      
      // Si el target és un mixer, actualitzem el seu data amb el nom del component connectat
      setNodes((nds) => nds.map(node => {
        if (node.id === params.target && node.type === 'mixer') {
          const sourceNode = nds.find(n => n.id === params.source);
          const sourceLabel = sourceNode?.data.label || sourceNode?.type || 'Unknown';
          return {
            ...node,
            data: {
              ...node.data,
              [`label_${params.targetHandle}`]: sourceLabel
            }
          };
        }
        return node;
      }));
    }
  }, []);

  const onNodesDelete: OnNodesDelete = useCallback((deleted: Node[]) => {
    deleted.forEach((node) => {
      removeNode(node.id);
    });
  }, []);

  const onEdgesDelete = useCallback((deleted: Edge[]) => {
    deleted.forEach((edge) => {
      if (edge.source && edge.target) {
        disconnectNodes(edge.source, edge.target, edge.targetHandle);
        
        // Si el target era un mixer, netegem el label del canal
        setNodes((nds) => nds.map(node => {
          if (node.id === edge.target && node.type === 'mixer') {
            const newData = { ...node.data };
            delete newData[`label_${edge.targetHandle}`];
            return {
              ...node,
              data: newData
            };
          }
          return node;
        }));
      }
    });
  }, []);

  const addNode = (type: 'oscillator' | 'gain' | 'filter' | 'delay' | 'noise' | 'distortion' | 'reverb' | 'scope' | 'mixer' | 'spectrogram' | 'panner' | 'lfo') => {
    const id = `${type}_${Math.random().toString(36).substr(2, 9)}`;
    const position = { 
      x: 300 + Math.random() * 50, 
      y: 300 + Math.random() * 50 
    };
    
    const labels = {
      oscillator: 'Oscil·lador',
      gain: 'Amplificador',
      filter: 'Filtre',
      delay: 'Eco',
      noise: 'Soroll',
      distortion: 'Distorsió',
      reverb: 'Reverb',
      scope: 'Visualitzador',
      mixer: 'Mesclador',
      spectrogram: 'Espectrograma',
      panner: 'Panoramitzador',
      lfo: 'LFO'
    };

    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: labels[type],
        frequency: type === 'filter' ? 1000 : 440,
        gain: type === 'lfo' ? 100 : 0.5,
        type: type === 'filter' ? 'lowpass' : 'sine',
        Q: 1,
        delayTime: 0.3,
        distortion: 400,
        decay: 3,
        pan: 0
      },
    };

    setNodes((nds) => [...nds, newNode]);

    // Creem el node d'àudio immediatament si el motor està iniciat
    if (audioStarted) {
      try {
        if (type === 'oscillator') createOscillator(id);
        else if (type === 'gain') createGain(id);
        else if (type === 'filter') createFilter(id);
        else if (type === 'delay') createDelay(id);
        else if (type === 'noise') createNoise(id);
        else if (type === 'distortion') createDistortion(id);
        else if (type === 'reverb') createReverb(id);
        else if (type === 'mixer') createMixer(id);
        else if (type === 'spectrogram') createAnalyser(id);
        else if (type === 'panner') createPanner(id);
        else if (type === 'lfo') createLFO(id);
        else if (type === 'scope') createAnalyser(id);
      } catch (error) {
        console.error('Error creating audio node:', error);
      }
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
    } catch (e) {
      console.error('Test sound error:', e);
    }
  };

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    if (edge.source && edge.target) {
      disconnectNodes(edge.source, edge.target, edge.targetHandle);
    }
  }, []);

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
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0" onClick={testSound}>
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent hidden sm:block">
            SOUND<span className="text-sky-500">LAB</span>
          </h1>
        </div>
        
        {/* Scrollable Navigation */}
        <nav className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth shadow-inner flex-1 mx-2">
          {[
            { type: 'oscillator', label: 'Osc', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
            { type: 'noise', label: 'Noise', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
            { type: 'lfo', label: 'LFO', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { type: 'gain', label: 'Gain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { type: 'filter', label: 'Filter', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            { type: 'distortion', label: 'Disto', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
            { type: 'delay', label: 'Eco', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { type: 'reverb', label: 'Reverb', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
            { type: 'mixer', label: 'Mixer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { type: 'panner', label: 'Panner', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
            { type: 'scope', label: 'Scope', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
            { type: 'spectrogram', label: 'Spectrum', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={(e) => {
                e.stopPropagation();
                addNode(btn.type as any);
              }}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter border ${btn.color} hover:bg-white/10 hover:scale-105 transition-all active:scale-95 flex-shrink-0 whitespace-nowrap shadow-lg`}
            >
              + {btn.label}
            </button>
          ))}
        </nav>

        {/* Engine Controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
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

      {/* Workspace */}
      <div className="flex-1 relative">
        {!audioStarted && (
          <div className="absolute inset-0 bg-slate-950/80 z-40 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-sky-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Benvingut al Manipulador de So</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Fes clic al botó superior per activar l'àudio i començar a crear el teu sintetitzador modular.
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
          nodeTypes={nodeTypesMemo}
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
              <li>• Arrossega per moure mòduls</li>
              <li>• Clic sobre un cable per esborrar-lo</li>
              <li>• Tecla 'Del' per esborrar mòdul/cable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
