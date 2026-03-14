import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SoundNodeData, SyncDivision } from '../types';

const syncDivisions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const normalize = (value: number, min: number, max: number) => {
  if (max <= min) {
    return 0;
  }

  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const WeirdMachineNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSeqStep, setCurrentSeqStep] = useState(0);
  const frequency = data.frequency ?? 180;
  const modFrequency = data.modFrequency ?? 84;
  const modAmount = data.modAmount ?? 120;
  const texture = data.texture ?? 0.45;
  const chaos = data.chaos ?? 0.5;
  const tone = data.tone ?? 1800;
  const resonance = data.Q ?? 1.4;
  const wobbleRate = data.rate ?? 3.5;
  const sweep = data.depth ?? 900;
  const drive = data.drive ?? 2.2;
  const gain = data.gain ?? 0.22;
  const sync = data.sync ?? false;
  const syncDivision = data.syncDivision ?? '1/8';
  const steps = Array.from({ length: 8 }, (_, index) => data.steps?.[index] ?? (index % 2 === 0));
  const carrierType = (data.type as OscillatorType | undefined) ?? 'sawtooth';
  const modType = data.modType ?? 'square';

  useEffect(() => {
    const handleStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ step?: number }>;
      if (typeof customEvent.detail.step === 'number') {
        setCurrentStep(customEvent.detail.step);
      }
    };

    const handleWeirdStep = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string; stepIndex?: number }>;
      if (customEvent.detail.id === id && typeof customEvent.detail.stepIndex === 'number') {
        setCurrentSeqStep(customEvent.detail.stepIndex);
      }
    };

    window.addEventListener('transport-step', handleStep);
    window.addEventListener('weird-machine-step', handleWeirdStep);
    return () => {
      window.removeEventListener('transport-step', handleStep);
      window.removeEventListener('weird-machine-step', handleWeirdStep);
    };
  }, [id]);

  const ledValues = useMemo(
    () => [
      normalize(frequency, 40, 1200),
      normalize(modFrequency, 0.1, 1200),
      normalize(modAmount, 0, 800),
      normalize(texture, 0, 1),
      normalize(chaos, 0, 1),
      normalize(tone, 120, 8000),
      normalize(resonance, 0.1, 18),
      normalize(wobbleRate, 0.1, 16),
      normalize(sweep, 0, 2400),
      normalize(drive, 1, 6),
      normalize(gain, 0, 1),
      ((currentStep % 4) + 1) / 4,
    ],
    [chaos, currentStep, drive, frequency, gain, modAmount, modFrequency, resonance, sweep, texture, tone, wobbleRate],
  );

  const applyMood = (patch: Partial<SoundNodeData>) => {
    onDataChange(id, patch);
  };

  const toggleStep = (stepIndex: number) => {
    const nextSteps = [...steps];
    nextSteps[stepIndex] = !nextSteps[stepIndex];
    onDataChange(id, { steps: nextSteps });
  };

  return (
    <div className="bg-[linear-gradient(145deg,rgba(12,8,24,0.96),rgba(38,10,24,0.94))] backdrop-blur-xl border border-fuchsia-400/20 p-4 rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] min-w-[430px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-[0.3em] text-fuchsia-300 uppercase mb-1 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_14px_rgba(244,114,182,0.95)] animate-pulse" />
            Mutant Box
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Strange Sound Reactor</p>
        </div>

        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-black/25 p-2">
          {ledValues.map((value, index) => (
            <div
              key={`led-${index}`}
              className="h-5 w-5 rounded-full border border-white/10 transition-all"
              style={{
                background: `radial-gradient(circle, rgba(250,204,21,${0.35 + value * 0.55}) 0%, rgba(244,114,182,${0.1 + value * 0.55}) 55%, rgba(15,23,42,0.3) 100%)`,
                boxShadow:
                  currentStep % ledValues.length === index
                    ? '0 0 18px rgba(250,204,21,0.85), 0 0 32px rgba(244,114,182,0.45)'
                    : `0 0 ${6 + value * 16}px rgba(244,114,182,${0.18 + value * 0.4})`,
                transform: `scale(${1 + value * 0.08})`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 nodrag">
        <Knob label="Freq" min={40} max={1200} step={1} value={frequency} onChange={(value) => onDataChange(id, { frequency: value })} color="#f472b6" unit="Hz" size={52} />
        <Knob label="Mod" min={0.1} max={1200} step={0.1} value={modFrequency} onChange={(value) => onDataChange(id, { modFrequency: value })} color="#fb7185" unit="Hz" size={52} />
        <Knob label="Index" min={0} max={800} step={1} value={modAmount} onChange={(value) => onDataChange(id, { modAmount: value })} color="#f59e0b" size={52} />
        <Knob label="Texture" min={0} max={1} step={0.01} value={texture} onChange={(value) => onDataChange(id, { texture: value })} color="#22d3ee" size={52} />
        <Knob label="Chaos" min={0} max={1} step={0.01} value={chaos} onChange={(value) => onDataChange(id, { chaos: value })} color="#a78bfa" size={52} />
        <Knob label="Tone" min={120} max={8000} step={1} value={tone} onChange={(value) => onDataChange(id, { tone: value })} color="#34d399" unit="Hz" size={52} />
        <Knob label="Reso" min={0.1} max={18} step={0.1} value={resonance} onChange={(value) => onDataChange(id, { Q: value })} color="#fde047" size={52} />
        <Knob label="Wobble" min={0.1} max={16} step={0.1} value={wobbleRate} onChange={(value) => onDataChange(id, { rate: value })} color="#38bdf8" unit="Hz" size={52} />
        <Knob label="Sweep" min={0} max={2400} step={1} value={sweep} onChange={(value) => onDataChange(id, { depth: value })} color="#2dd4bf" size={52} />
        <Knob label="Drive" min={1} max={6} step={0.01} value={drive} onChange={(value) => onDataChange(id, { drive: value })} color="#f97316" size={52} />
        <Knob label="Gain" min={0} max={1} step={0.01} value={gain} onChange={(value) => onDataChange(id, { gain: value })} color="#f43f5e" size={52} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 nodrag">
        <button
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
            sync
              ? 'border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-200'
              : 'border-white/10 bg-white/5 text-white/55'
          }`}
        >
          {sync ? 'Sync On' : 'Sync Off'}
        </button>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="bg-black/40 text-white text-xs p-2 rounded-xl border border-fuchsia-400/20 outline-none focus:border-fuchsia-300"
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
          className="bg-black/40 text-white text-xs p-2 rounded-xl border border-fuchsia-400/20 outline-none focus:border-fuchsia-300"
        >
          <option value="sine">Carrier Sine</option>
          <option value="triangle">Carrier Triangle</option>
          <option value="sawtooth">Carrier Saw</option>
          <option value="square">Carrier Square</option>
        </select>
        <select
          value={modType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="bg-black/40 text-white text-xs p-2 rounded-xl border border-fuchsia-400/20 outline-none focus:border-fuchsia-300"
        >
          <option value="sine">Harmonic Sine</option>
          <option value="triangle">Harmonic Triangle</option>
          <option value="sawtooth">Harmonic Saw</option>
          <option value="square">Harmonic Square</option>
        </select>
      </div>

      <div className="mb-3 rounded-2xl border border-white/10 bg-black/25 p-3 nodrag">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Mutant Steps</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-fuchsia-300/80">
            {sync ? `Sync ${syncDivision}` : 'Free Reactor'}
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {steps.map((isHot, stepIndex) => {
            const isCurrent = currentSeqStep === stepIndex;
            return (
              <button
                key={`mut-step-${stepIndex}`}
                onClick={() => toggleStep(stepIndex)}
                className={`h-10 rounded-xl border text-[10px] font-black transition-all ${
                  isHot
                    ? 'border-fuchsia-300/40 bg-fuchsia-500/20 text-fuchsia-100'
                    : 'border-white/10 bg-white/5 text-white/35'
                } ${isCurrent ? 'shadow-[0_0_18px_rgba(244,114,182,0.65)] scale-[1.04]' : ''}`}
              >
                {stepIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 nodrag">
        <button
          onClick={() =>
            applyMood({
              frequency: 320,
              modFrequency: 480,
              modAmount: 90,
              texture: 0.18,
              chaos: 0.22,
              tone: 2800,
              Q: 1.2,
              rate: 2.2,
              depth: 700,
              drive: 1.6,
              sync: true,
              syncDivision: '1/8',
              steps: [true, false, false, true, false, false, true, false],
            })
          }
          className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200"
        >
          Glass
        </button>
        <button
          onClick={() =>
            applyMood({
              frequency: 140,
              modFrequency: 96,
              modAmount: 240,
              texture: 0.62,
              chaos: 0.56,
              tone: 1400,
              Q: 3.4,
              rate: 4.2,
              depth: 1200,
              drive: 2.8,
              sync: true,
              syncDivision: '1/16',
              steps: [true, true, false, true, false, true, false, true],
            })
          }
          className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200"
        >
          Grit
        </button>
        <button
          onClick={() =>
            applyMood({
              frequency: 82,
              modFrequency: 22,
              modAmount: 420,
              texture: 0.84,
              chaos: 0.9,
              tone: 900,
              Q: 7.5,
              rate: 7.6,
              depth: 1800,
              drive: 4.6,
              gain: 0.18,
              sync: true,
              syncDivision: '1/8',
              steps: [true, false, true, true, false, true, true, false],
            })
          }
          className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-200"
        >
          Beast
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="pitch"
        className="!bg-lime-400 !w-3 !h-3 !border-2 !border-white"
        style={{ top: '28%' }}
      />
      <div className="absolute left-[-38px] top-[23%] text-[8px] text-lime-400 font-bold uppercase pointer-events-none">
        Pitch
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-fuchsia-300 !w-4 !h-4 !border-2 !border-black"
      />
    </div>
  );
};

export default WeirdMachineNode;
