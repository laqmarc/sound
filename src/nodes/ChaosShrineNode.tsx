import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type {
  ControllableSoundNodeProps,
  ShrineScene,
  SoundNodeData,
  SyncDivision,
} from '../types';

const syncDivisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const normalize = (value: number, min: number, max: number) => {
  if (max <= min) {
    return 0;
  }

  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const defaultSteps = [true, false, true, true, false, true, false, true, true, false, false, true, false, true, true, false];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const randomPattern = () => Array.from({ length: 16 }, () => Math.random() > 0.35);

const scenePresets: Record<ShrineScene, Partial<SoundNodeData>> = {
  nebula: {
    frequency: 260,
    modFrequency: 240,
    modAmount: 110,
    texture: 0.22,
    chaos: 0.25,
    tone: 1600,
    Q: 3.2,
    rate: 2.2,
    depth: 920,
    drive: 1.9,
    detune: 10,
    blend: 0.42,
    spread: 6,
    pan: -0.15,
    gain: 0.22,
    sync: true,
    syncDivision: '1/8',
    freeze: false,
    steps: [true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false],
    type: 'triangle',
    modType: 'sine',
  },
  razor: {
    frequency: 150,
    modFrequency: 128,
    modAmount: 220,
    texture: 0.46,
    chaos: 0.58,
    tone: 1100,
    Q: 5.8,
    rate: 3.6,
    depth: 1380,
    drive: 3.1,
    detune: 22,
    blend: 0.66,
    spread: 10,
    pan: 0.05,
    gain: 0.25,
    sync: true,
    syncDivision: '1/16',
    freeze: false,
    steps: [true, true, false, false, true, false, true, false, false, true, true, false, true, false, false, true],
    type: 'sawtooth',
    modType: 'triangle',
  },
  swarm: {
    frequency: 82,
    modFrequency: 36,
    modAmount: 340,
    texture: 0.88,
    chaos: 0.94,
    tone: 760,
    Q: 8.2,
    rate: 6.5,
    depth: 1900,
    drive: 4.4,
    detune: 34,
    blend: 0.74,
    spread: 14,
    pan: 0.18,
    gain: 0.18,
    sync: true,
    syncDivision: '1/16',
    freeze: false,
    steps: [true, false, true, true, false, true, true, false, true, false, true, true, false, true, true, false],
    type: 'square',
    modType: 'sawtooth',
  },
  ritual: {
    frequency: 124,
    modFrequency: 540,
    modAmount: 420,
    texture: 0.74,
    chaos: 0.82,
    tone: 2100,
    Q: 6.6,
    rate: 1.2,
    depth: 2100,
    drive: 5.2,
    detune: 28,
    blend: 0.82,
    spread: 18,
    pan: 0,
    gain: 0.26,
    sync: true,
    syncDivision: '1/4',
    freeze: false,
    steps: Array.from({ length: 16 }, (_, index) => index % 2 === 0 || index % 5 === 0),
    type: 'sawtooth',
    modType: 'square',
  },
};

const interpolate = (a: number, b: number, morph: number) => a + (b - a) * morph;

const ChaosShrineNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const [transportStep, setTransportStep] = useState(0);
  const [currentSeqStep, setCurrentSeqStep] = useState(0);
  const frequency = data.frequency ?? 110;
  const modFrequency = data.modFrequency ?? 72;
  const modAmount = data.modAmount ?? 140;
  const texture = data.texture ?? 0.55;
  const chaos = data.chaos ?? 0.72;
  const tone = data.tone ?? 900;
  const resonance = data.Q ?? 4.5;
  const pulse = data.rate ?? 2.5;
  const flux = data.depth ?? 1100;
  const drive = data.drive ?? 2.8;
  const gain = data.gain ?? 0.24;
  const detune = data.detune ?? 18;
  const blend = data.blend ?? 0.58;
  const spread = data.spread ?? 8;
  const pan = data.pan ?? 0;
  const morph = data.morph ?? 0;
  const sceneA = data.sceneA ?? 'nebula';
  const sceneB = data.sceneB ?? 'ritual';
  const sync = data.sync ?? true;
  const syncDivision = data.syncDivision ?? '1/16';
  const freeze = data.freeze ?? false;
  const steps = Array.from({ length: 16 }, (_, index) => data.steps?.[index] ?? defaultSteps[index]);
  const carrierType = (data.type as OscillatorType | undefined) ?? 'sawtooth';
  const shimmerType = data.modType ?? 'triangle';

  useEffect(() => {
    const handleTransportStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ step?: number }>;
      if (typeof customEvent.detail.step === 'number') {
        setTransportStep(customEvent.detail.step);
      }
    };

    const handleShrineStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string; stepIndex?: number }>;
      if (customEvent.detail.id === id && typeof customEvent.detail.stepIndex === 'number') {
        setCurrentSeqStep(customEvent.detail.stepIndex);
      }
    };

    window.addEventListener('transport-step', handleTransportStep);
    window.addEventListener('chaos-shrine-step', handleShrineStep);

    return () => {
      window.removeEventListener('transport-step', handleTransportStep);
      window.removeEventListener('chaos-shrine-step', handleShrineStep);
    };
  }, [id]);

  const ledValues = useMemo(
    () => [
      normalize(frequency, 30, 1200),
      normalize(modFrequency, 0.1, 1200),
      normalize(modAmount, 0, 900),
      normalize(texture, 0, 1),
      normalize(chaos, 0, 1),
      normalize(tone, 120, 9000),
      normalize(resonance, 0.1, 18),
      normalize(pulse, 0.1, 16),
      normalize(flux, 0, 2400),
      normalize(drive, 1, 6),
      normalize(gain, 0, 1),
      normalize(detune, 0, 48),
      normalize(blend, 0, 1),
      normalize(spread, 0, 24),
      normalize(pan, -1, 1),
      ((transportStep % 4) + 1) / 4,
      ((currentSeqStep % 8) + 1) / 8,
    ],
    [
      blend,
      chaos,
      currentSeqStep,
      detune,
      drive,
      flux,
      frequency,
      gain,
      modAmount,
      modFrequency,
      pulse,
      pan,
      resonance,
      spread,
      texture,
      tone,
      transportStep,
    ],
  );

  const applyScene = (patch: Partial<SoundNodeData>) => {
    onDataChange(id, patch);
  };

  const setPattern = (nextSteps: boolean[]) => {
    onDataChange(id, { steps: nextSteps });
  };

  const toggleStep = (stepIndex: number) => {
    const nextSteps = [...steps];
    nextSteps[stepIndex] = !nextSteps[stepIndex];
    setPattern(nextSteps);
  };

  const applyMorphScenes = (
    nextSceneA: ShrineScene,
    nextSceneB: ShrineScene,
    nextMorph: number,
  ) => {
    const sceneAPatch = scenePresets[nextSceneA];
    const sceneBPatch = scenePresets[nextSceneB];

    onDataChange(id, {
      sceneA: nextSceneA,
      sceneB: nextSceneB,
      morph: nextMorph,
      frequency: interpolate(sceneAPatch.frequency ?? frequency, sceneBPatch.frequency ?? frequency, nextMorph),
      modFrequency: interpolate(sceneAPatch.modFrequency ?? modFrequency, sceneBPatch.modFrequency ?? modFrequency, nextMorph),
      modAmount: interpolate(sceneAPatch.modAmount ?? modAmount, sceneBPatch.modAmount ?? modAmount, nextMorph),
      texture: interpolate(sceneAPatch.texture ?? texture, sceneBPatch.texture ?? texture, nextMorph),
      chaos: interpolate(sceneAPatch.chaos ?? chaos, sceneBPatch.chaos ?? chaos, nextMorph),
      tone: interpolate(sceneAPatch.tone ?? tone, sceneBPatch.tone ?? tone, nextMorph),
      Q: interpolate(sceneAPatch.Q ?? resonance, sceneBPatch.Q ?? resonance, nextMorph),
      rate: interpolate(sceneAPatch.rate ?? pulse, sceneBPatch.rate ?? pulse, nextMorph),
      depth: interpolate(sceneAPatch.depth ?? flux, sceneBPatch.depth ?? flux, nextMorph),
      drive: interpolate(sceneAPatch.drive ?? drive, sceneBPatch.drive ?? drive, nextMorph),
      detune: interpolate(sceneAPatch.detune ?? detune, sceneBPatch.detune ?? detune, nextMorph),
      blend: interpolate(sceneAPatch.blend ?? blend, sceneBPatch.blend ?? blend, nextMorph),
      spread: interpolate(sceneAPatch.spread ?? spread, sceneBPatch.spread ?? spread, nextMorph),
      pan: interpolate(sceneAPatch.pan ?? pan, sceneBPatch.pan ?? pan, nextMorph),
      gain: interpolate(sceneAPatch.gain ?? gain, sceneBPatch.gain ?? gain, nextMorph),
      sync: nextMorph < 0.5 ? sceneAPatch.sync ?? sync : sceneBPatch.sync ?? sync,
      syncDivision: nextMorph < 0.5 ? sceneAPatch.syncDivision ?? syncDivision : sceneBPatch.syncDivision ?? syncDivision,
      freeze: nextMorph < 0.5 ? sceneAPatch.freeze ?? freeze : sceneBPatch.freeze ?? freeze,
      type: nextMorph < 0.5 ? sceneAPatch.type ?? carrierType : sceneBPatch.type ?? carrierType,
      modType: nextMorph < 0.5 ? sceneAPatch.modType ?? shimmerType : sceneBPatch.modType ?? shimmerType,
      steps: nextMorph < 0.5 ? sceneAPatch.steps ?? steps : sceneBPatch.steps ?? steps,
    });
  };

  const randomizeAll = () => {
    onDataChange(id, {
      frequency: randomBetween(50, 340),
      modFrequency: randomBetween(18, 640),
      modAmount: randomBetween(60, 520),
      texture: randomBetween(0.08, 0.96),
      chaos: randomBetween(0.18, 0.98),
      tone: randomBetween(500, 3200),
      Q: randomBetween(1.2, 10.5),
      rate: randomBetween(0.6, 8.5),
      depth: randomBetween(350, 2200),
      drive: randomBetween(1.4, 5.6),
      gain: randomBetween(0.14, 0.3),
      detune: randomBetween(4, 36),
      blend: randomBetween(0.2, 0.9),
      spread: randomBetween(2, 20),
      pan: randomBetween(-0.65, 0.65),
      sync: Math.random() > 0.35,
      syncDivision: syncDivisions[Math.floor(Math.random() * syncDivisions.length)],
      freeze: false,
      steps: randomPattern(),
      type: (['sine', 'triangle', 'sawtooth', 'square'] as const)[Math.floor(Math.random() * 4)],
      modType: (['sine', 'triangle', 'sawtooth', 'square'] as const)[Math.floor(Math.random() * 4)],
    });
  };

  return (
    <div className="bg-[linear-gradient(145deg,rgba(16,6,16,0.98),rgba(62,10,26,0.96))] backdrop-blur-xl border border-rose-300/20 p-4 rounded-[30px] shadow-[0_24px_90px_rgba(0,0,0,0.52)] min-w-[540px] text-white">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.34em] text-rose-200">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-300 shadow-[0_0_16px_rgba(253,164,175,0.95)] animate-pulse" />
            Chaos Shrine
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Hyper Ritual Tone Engine</p>
        </div>

        <div className="grid grid-cols-8 gap-1 rounded-[22px] border border-white/10 bg-black/30 p-2">
          {ledValues.map((value, index) => (
            <div
              key={`chaos-led-${index}`}
              className="h-4 w-4 rounded-full border border-white/10 transition-all"
              style={{
                background: `radial-gradient(circle, rgba(254,215,170,${0.25 + value * 0.65}) 0%, rgba(251,113,133,${0.08 + value * 0.58}) 55%, rgba(17,24,39,0.2) 100%)`,
                boxShadow:
                  currentSeqStep % ledValues.length === index
                    ? '0 0 18px rgba(251,113,133,0.9), 0 0 28px rgba(253,186,116,0.55)'
                    : `0 0 ${5 + value * 16}px rgba(251,113,133,${0.14 + value * 0.34})`,
                transform: `scale(${1 + value * 0.1})`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3 nodrag">
        <Knob label="Freq" min={30} max={1200} step={1} value={frequency} onChange={(value) => onDataChange(id, { frequency: value })} color="#fb7185" unit="Hz" size={52} />
        <Knob label="Mod" min={0.1} max={1200} step={0.1} value={modFrequency} onChange={(value) => onDataChange(id, { modFrequency: value })} color="#f97316" unit="Hz" size={52} />
        <Knob label="Index" min={0} max={900} step={1} value={modAmount} onChange={(value) => onDataChange(id, { modAmount: value })} color="#f59e0b" size={52} />
        <Knob label="Texture" min={0} max={1} step={0.01} value={texture} onChange={(value) => onDataChange(id, { texture: value })} color="#2dd4bf" size={52} />
        <Knob label="Chaos" min={0} max={1} step={0.01} value={chaos} onChange={(value) => onDataChange(id, { chaos: value })} color="#c084fc" size={52} />
        <Knob label="Tone" min={120} max={9000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#fde047" unit="Hz" size={52} />
        <Knob label="Q" min={0.1} max={18} step={0.1} value={resonance} onChange={(value) => onDataChange(id, { Q: value })} color="#facc15" size={52} />
        <Knob label="Pulse" min={0.1} max={16} step={0.1} value={pulse} onChange={(value) => onDataChange(id, { rate: value })} color="#38bdf8" unit="Hz" size={52} />
        <Knob label="Flux" min={0} max={2400} step={1} value={flux} onChange={(value) => onDataChange(id, { depth: value })} color="#22d3ee" size={52} />
        <Knob label="Detune" min={0} max={48} step={0.1} value={detune} onChange={(value) => onDataChange(id, { detune: value })} color="#a78bfa" size={52} />
        <Knob label="Blend" min={0} max={1} step={0.01} value={blend} onChange={(value) => onDataChange(id, { blend: value })} color="#34d399" size={52} />
        <Knob label="Spread" min={0} max={24} step={0.1} value={spread} onChange={(value) => onDataChange(id, { spread: value })} color="#60a5fa" size={52} />
        <Knob label="Pan" min={-1} max={1} step={0.01} value={pan} onChange={(value) => onDataChange(id, { pan: value })} color="#67e8f9" size={52} />
        <Knob label="Drive" min={1} max={6} step={0.01} value={drive} onChange={(value) => onDataChange(id, { drive: value })} color="#fb923c" size={52} />
        <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#f43f5e" size={52} />
      </div>

      <div className="mb-3 rounded-[22px] border border-white/10 bg-black/25 p-3 nodrag">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Scene Morph</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-fuchsia-200/80">{Math.round(morph * 100)}%</div>
        </div>
        <div className="grid grid-cols-[1fr_56px_1fr_80px] items-center gap-2">
          <select
            value={sceneA}
            onChange={(event) => applyMorphScenes(event.target.value as ShrineScene, sceneB, morph)}
            className="rounded-xl border border-fuchsia-400/20 bg-black/40 p-2 text-xs outline-none focus:border-fuchsia-300"
          >
            <option value="nebula">Scene A Nebula</option>
            <option value="razor">Scene A Razor</option>
            <option value="swarm">Scene A Swarm</option>
            <option value="ritual">Scene A Ritual</option>
          </select>
          <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">to</div>
          <select
            value={sceneB}
            onChange={(event) => applyMorphScenes(sceneA, event.target.value as ShrineScene, morph)}
            className="rounded-xl border border-fuchsia-400/20 bg-black/40 p-2 text-xs outline-none focus:border-fuchsia-300"
          >
            <option value="nebula">Scene B Nebula</option>
            <option value="razor">Scene B Razor</option>
            <option value="swarm">Scene B Swarm</option>
            <option value="ritual">Scene B Ritual</option>
          </select>
          <Knob
            label="Morph"
            min={0}
            max={1}
            step={0.01}
            value={morph}
            onChange={(value) => applyMorphScenes(sceneA, sceneB, value)}
            color="#e879f9"
            size={54}
          />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-5 gap-2 nodrag">
        <button
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
            sync ? 'border-rose-300/40 bg-rose-500/15 text-rose-100' : 'border-white/10 bg-white/5 text-white/55'
          }`}
        >
          {sync ? 'Sync On' : 'Sync Off'}
        </button>
        <button
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
            freeze ? 'border-cyan-300/40 bg-cyan-500/15 text-cyan-100' : 'border-white/10 bg-white/5 text-white/55'
          }`}
        >
          {freeze ? 'Freeze On' : 'Freeze Off'}
        </button>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="rounded-xl border border-rose-400/20 bg-black/40 p-2 text-xs outline-none focus:border-rose-300"
        >
          {syncDivisions.map((division) => (
            <option key={division} value={division}>
              Division {division}
            </option>
          ))}
        </select>
        <select
          value={carrierType}
          onChange={(event) => onDataChange(id, { type: event.target.value as OscillatorType })}
          className="rounded-xl border border-rose-400/20 bg-black/40 p-2 text-xs outline-none focus:border-rose-300"
        >
          <option value="sine">Core Sine</option>
          <option value="triangle">Core Triangle</option>
          <option value="sawtooth">Core Saw</option>
          <option value="square">Core Square</option>
        </select>
        <select
          value={shimmerType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="rounded-xl border border-rose-400/20 bg-black/40 p-2 text-xs outline-none focus:border-rose-300"
        >
          <option value="sine">Shimmer Sine</option>
          <option value="triangle">Shimmer Triangle</option>
          <option value="sawtooth">Shimmer Saw</option>
          <option value="square">Shimmer Square</option>
        </select>
        <button
          onClick={randomizeAll}
          className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-200"
        >
          Randomize
        </button>
      </div>

      <div className="mb-3 rounded-[22px] border border-white/10 bg-black/28 p-3 nodrag">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Ritual Grid</div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-rose-200/80">
            {sync ? `Pulse ${syncDivision}` : 'Loose Pulse'}
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {steps.map((isHot, stepIndex) => {
            const isCurrent = currentSeqStep === stepIndex;
            return (
              <button
                key={`chaos-step-${stepIndex}`}
                onClick={() => toggleStep(stepIndex)}
                className={`h-9 rounded-xl border text-[10px] font-black transition-all ${
                  isHot ? 'border-rose-300/40 bg-rose-500/18 text-rose-100' : 'border-white/10 bg-white/5 text-white/35'
                } ${isCurrent ? 'scale-[1.05] shadow-[0_0_18px_rgba(251,113,133,0.7)]' : ''}`}
              >
                {stepIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 nodrag">
        <button
          onClick={() => setPattern([true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false])}
          className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200"
        >
          Sparse
        </button>
        <button
          onClick={() => setPattern([true, true, false, false, true, false, true, false, false, true, true, false, true, false, false, true])}
          className="rounded-xl border border-lime-400/25 bg-lime-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-lime-200"
        >
          Snake
        </button>
        <button
          onClick={() => setPattern([true, false, true, true, true, false, false, true, true, true, false, true, false, true, true, false])}
          className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200"
        >
          Rave
        </button>
        <button
          onClick={() => setPattern(Array.from({ length: 16 }, () => true))}
          className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-200"
        >
          Wall
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 nodrag">
        <button
          onClick={() => applyScene({ sceneA: 'nebula', sceneB, morph: 0, ...scenePresets.nebula })}
          className="rounded-xl border border-sky-400/25 bg-sky-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200"
        >
          Nebula
        </button>
        <button
          onClick={() => applyScene({ sceneA: 'razor', sceneB, morph: 0, ...scenePresets.razor })}
          className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200"
        >
          Razor
        </button>
        <button
          onClick={() => applyScene({ sceneA: 'swarm', sceneB, morph: 0, ...scenePresets.swarm })}
          className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-100"
        >
          Swarm
        </button>
        <button
          onClick={() => applyScene({ sceneA: 'ritual', sceneB, morph: 0, ...scenePresets.ritual })}
          className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-200"
        >
          Ritual
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="pitch"
        className="!h-3 !w-3 !border-2 !border-white !bg-lime-400"
        style={{ top: '26%' }}
      />
      <div className="pointer-events-none absolute left-[-38px] top-[21%] text-[8px] font-bold uppercase text-lime-400">Pitch</div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !border-2 !border-black !bg-rose-300"
      />
    </div>
  );
};

export default ChaosShrineNode;
