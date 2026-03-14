import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type {
  ControllableSoundNodeProps,
  ShrineScene,
  SoundNodeData,
  SyncDivision,
} from '../types';
import './nodeChrome.css';
import './ChaosShrineNode.css';

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
    <div className="node-chrome chaos-shrine-node">
      <div className="chaos-shrine-node__header">
        <div>
          <div className="node-chrome__title chaos-shrine-node__title">
            <div className="node-chrome__dot chaos-shrine-node__dot" />
            Chaos Shrine
          </div>
          <p className="chaos-shrine-node__description">Hyper Ritual Tone Engine</p>
        </div>

        <div className="chaos-shrine-node__led-grid">
          {ledValues.map((value, index) => (
            <div
              key={`chaos-led-${index}`}
              className="chaos-shrine-node__led"
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

      <div className="chaos-shrine-node__knobs nodrag">
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

      <div className="chaos-shrine-node__card nodrag">
        <div className="chaos-shrine-node__card-header">
          <div className="chaos-shrine-node__card-title">Scene Morph</div>
          <div className="chaos-shrine-node__card-value chaos-shrine-node__card-value--fuchsia">{Math.round(morph * 100)}%</div>
        </div>
        <div className="chaos-shrine-node__morph-grid">
          <select
            value={sceneA}
            onChange={(event) => applyMorphScenes(event.target.value as ShrineScene, sceneB, morph)}
            className="chaos-shrine-node__select"
          >
            <option value="nebula">Scene A Nebula</option>
            <option value="razor">Scene A Razor</option>
            <option value="swarm">Scene A Swarm</option>
            <option value="ritual">Scene A Ritual</option>
          </select>
          <div className="chaos-shrine-node__to-label">to</div>
          <select
            value={sceneB}
            onChange={(event) => applyMorphScenes(sceneA, event.target.value as ShrineScene, morph)}
            className="chaos-shrine-node__select"
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

      <div className="chaos-shrine-node__toolbar nodrag">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`chaos-shrine-node__button ${sync ? 'chaos-shrine-node__button--active-rose' : ''}`}
        >
          {sync ? 'Sync On' : 'Sync Off'}
        </button>
        <button
          type="button"
          onClick={() => onDataChange(id, { freeze: !freeze })}
          className={`chaos-shrine-node__button ${freeze ? 'chaos-shrine-node__button--active-cyan' : ''}`}
        >
          {freeze ? 'Freeze On' : 'Freeze Off'}
        </button>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="chaos-shrine-node__select"
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
          className="chaos-shrine-node__select"
        >
          <option value="sine">Core Sine</option>
          <option value="triangle">Core Triangle</option>
          <option value="sawtooth">Core Saw</option>
          <option value="square">Core Square</option>
        </select>
        <select
          value={shimmerType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="chaos-shrine-node__select"
        >
          <option value="sine">Shimmer Sine</option>
          <option value="triangle">Shimmer Triangle</option>
          <option value="sawtooth">Shimmer Saw</option>
          <option value="square">Shimmer Square</option>
        </select>
        <button
          type="button"
          onClick={randomizeAll}
          className="chaos-shrine-node__button chaos-shrine-node__button--fuchsia"
        >
          Randomize
        </button>
      </div>

      <div className="chaos-shrine-node__card chaos-shrine-node__card--grid nodrag">
        <div className="chaos-shrine-node__card-header">
          <div className="chaos-shrine-node__card-title">Ritual Grid</div>
          <div className="chaos-shrine-node__card-value chaos-shrine-node__card-value--rose">
            {sync ? `Pulse ${syncDivision}` : 'Loose Pulse'}
          </div>
        </div>
        <div className="chaos-shrine-node__step-grid">
          {steps.map((isHot, stepIndex) => {
            const isCurrent = currentSeqStep === stepIndex;
            return (
              <button
                type="button"
                key={`chaos-step-${stepIndex}`}
                onClick={() => toggleStep(stepIndex)}
                className={`chaos-shrine-node__step ${isHot ? 'chaos-shrine-node__step--active' : ''} ${isCurrent ? 'chaos-shrine-node__step--current' : ''}`}
              >
                {stepIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="chaos-shrine-node__pattern-grid nodrag">
        <button
          type="button"
          onClick={() => setPattern([true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false])}
          className="chaos-shrine-node__pattern-button chaos-shrine-node__pattern-button--cyan"
        >
          Sparse
        </button>
        <button
          type="button"
          onClick={() => setPattern([true, true, false, false, true, false, true, false, false, true, true, false, true, false, false, true])}
          className="chaos-shrine-node__pattern-button chaos-shrine-node__pattern-button--lime"
        >
          Snake
        </button>
        <button
          type="button"
          onClick={() => setPattern([true, false, true, true, true, false, false, true, true, true, false, true, false, true, true, false])}
          className="chaos-shrine-node__pattern-button chaos-shrine-node__pattern-button--amber"
        >
          Rave
        </button>
        <button
          type="button"
          onClick={() => setPattern(Array.from({ length: 16 }, () => true))}
          className="chaos-shrine-node__pattern-button chaos-shrine-node__pattern-button--rose"
        >
          Wall
        </button>
      </div>

      <div className="chaos-shrine-node__scene-grid nodrag">
        <button
          type="button"
          onClick={() => applyScene({ sceneA: 'nebula', sceneB, morph: 0, ...scenePresets.nebula })}
          className="chaos-shrine-node__scene-button chaos-shrine-node__scene-button--sky"
        >
          Nebula
        </button>
        <button
          type="button"
          onClick={() => applyScene({ sceneA: 'razor', sceneB, morph: 0, ...scenePresets.razor })}
          className="chaos-shrine-node__scene-button chaos-shrine-node__scene-button--amber"
        >
          Razor
        </button>
        <button
          type="button"
          onClick={() => applyScene({ sceneA: 'swarm', sceneB, morph: 0, ...scenePresets.swarm })}
          className="chaos-shrine-node__scene-button chaos-shrine-node__scene-button--rose"
        >
          Swarm
        </button>
        <button
          type="button"
          onClick={() => applyScene({ sceneA: 'ritual', sceneB, morph: 0, ...scenePresets.ritual })}
          className="chaos-shrine-node__scene-button chaos-shrine-node__scene-button--fuchsia"
        >
          Ritual
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="pitch"
        className="node-handle--pitch"
        style={{ top: '26%' }}
      />
      <div className="node-chrome__pitch-label" style={{ top: '21%' }}>Pitch</div>

      <Handle
        type="source"
        position={Position.Right}
        className="node-handle--source node-handle--source-rose"
      />
    </div>
  );
};

export default ChaosShrineNode;
