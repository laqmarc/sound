import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { ArpMode, ArpScale, ArpStep, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';

const noteOptions: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const divisionOptions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];
const modeOptions: ArpMode[] = ['up', 'down', 'random'];
const scaleOptions: ArpScale[] = ['chromatic', 'major', 'minor', 'pentatonic'];

const makeSteps = (entries: Array<[NoteName, number, boolean?]>): ArpStep[] =>
  entries.map(([note, octave, enabled = true]) => ({
    note,
    octave,
    enabled,
  }));

const arp2Presets = [
  {
    name: 'Neon Snake',
    steps: makeSteps([
      ['C', 3], ['G', 3, false], ['A#', 3], ['D', 4], ['F', 4], ['A', 4, false], ['C', 5], ['D#', 5],
      ['C', 4], ['G', 3, false], ['F', 3], ['A#', 3], ['D', 4, false], ['F', 4], ['G', 4], ['C', 5],
    ]),
    scale: 'minor' as ArpScale,
    mode: 'up' as ArpMode,
    octaveSpan: 2,
    ratchet: 1,
  },
  {
    name: 'Broken Clock',
    steps: makeSteps([
      ['D', 4], ['F', 4], ['A', 4, false], ['C', 5], ['D', 5], ['A', 4], ['F', 4, false], ['C', 4],
      ['G', 4], ['A#', 4], ['D', 5], ['F', 5, false], ['C', 5], ['A#', 4], ['G', 4, false], ['D', 4],
    ]),
    scale: 'minor' as ArpScale,
    mode: 'random' as ArpMode,
    octaveSpan: 1,
    ratchet: 2,
  },
  {
    name: 'Major Laser',
    steps: makeSteps([
      ['C', 4], ['E', 4], ['G', 4], ['B', 4], ['D', 5], ['G', 5], ['E', 5], ['C', 5],
      ['A', 4], ['E', 4], ['G', 4], ['B', 4], ['D', 5], ['A', 5], ['G', 5], ['E', 5],
    ]),
    scale: 'major' as ArpScale,
    mode: 'up' as ArpMode,
    octaveSpan: 3,
    ratchet: 1,
  },
  {
    name: 'Razor Bounce',
    steps: makeSteps([
      ['F#', 3], ['C#', 4], ['F#', 4], ['A', 4], ['C#', 5], ['F#', 5], ['A', 5], ['C#', 6],
      ['A', 5], ['F#', 5], ['C#', 5], ['A', 4], ['F#', 4], ['C#', 4], ['A', 3], ['F#', 3],
    ]),
    scale: 'pentatonic' as ArpScale,
    mode: 'down' as ArpMode,
    octaveSpan: 2,
    ratchet: 2,
  },
  {
    name: 'Glass Runner',
    steps: makeSteps([
      ['A', 4], ['C', 5], ['E', 5], ['G', 5], ['A', 5], ['E', 5], ['C', 5], ['A', 4],
      ['G', 4], ['E', 4], ['C', 4], ['A', 3], ['C', 4], ['E', 4], ['G', 4], ['A', 4],
    ]),
    scale: 'minor' as ArpScale,
    mode: 'up' as ArpMode,
    octaveSpan: 2,
    ratchet: 3,
  },
  {
    name: 'Club Teeth',
    steps: makeSteps([
      ['C', 3], ['C', 4], ['G', 3], ['G', 4], ['A#', 3], ['A#', 4], ['F', 3], ['F', 4],
      ['C', 3], ['D', 4], ['G', 3], ['A', 4], ['A#', 3], ['C', 5], ['F', 4], ['G', 5],
    ]),
    scale: 'chromatic' as ArpScale,
    mode: 'random' as ArpMode,
    octaveSpan: 1,
    ratchet: 4,
  },
] as const;

const defaultSteps = (): ArpStep[] => arp2Presets[0].steps.map((step) => ({ ...step }));

const normalizeSteps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultSteps();
  return Array.from({ length: 16 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
    enabled: base[index]?.enabled ?? true,
  }));
};

interface Arp2StepEventDetail {
  id?: string;
  stepIndex?: number;
  active?: boolean;
}

const Arp2Node = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.arp2Steps);
  const syncDivision = data.syncDivision ?? '1/16';
  const arpMode = data.arpMode ?? 'up';
  const arpScale = data.arpScale ?? 'minor';
  const arpLength = Math.max(1, Math.min(16, Math.round(data.arpLength ?? 16)));
  const octaveSpan = Math.max(1, Math.min(4, Math.round(data.arpOctaveSpan ?? 2)));
  const transpose = Math.max(-24, Math.min(24, Math.round(data.arpTranspose ?? 0)));
  const chance = Math.max(0, Math.min(100, Math.round(data.arpChance ?? 100)));
  const ratchet = Math.max(1, Math.min(4, Math.round(data.arpRatchet ?? 1)));
  const [activeStep, setActiveStep] = useState(0);
  const [stepTriggered, setStepTriggered] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(0);

  useEffect(() => {
    const handleArp2Step = (event: Event) => {
      const customEvent = event as CustomEvent<Arp2StepEventDetail>;
      if (customEvent.detail.id !== id || typeof customEvent.detail.stepIndex !== 'number') {
        return;
      }

      setActiveStep(customEvent.detail.stepIndex);
      setStepTriggered(customEvent.detail.active ?? true);
    };

    window.addEventListener('arp2-step', handleArp2Step);
    return () => window.removeEventListener('arp2-step', handleArp2Step);
  }, [id]);

  const updateStep = (index: number, patch: Partial<ArpStep>) => {
    const nextSteps = normalizeSteps(steps);
    nextSteps[index] = {
      ...nextSteps[index],
      ...patch,
    };

    onDataChange(id, { arp2Steps: nextSteps });
  };

  const applyPreset = (presetIndex: number) => {
    const preset = arp2Presets[presetIndex];
    if (!preset) {
      return;
    }

    onDataChange(id, {
      arp2Steps: preset.steps.map((step) => ({ ...step })),
      arpScale: preset.scale,
      arpMode: preset.mode,
      arpOctaveSpan: preset.octaveSpan,
      arpRatchet: preset.ratchet,
    });
  };

  return (
    <div className="bg-[linear-gradient(145deg,rgba(6,14,22,0.98),rgba(7,28,34,0.95))] backdrop-blur-xl border border-cyan-400/20 p-4 rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] min-w-[980px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-[0.32em] text-cyan-300 uppercase mb-1 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stepTriggered ? 'bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]' : 'bg-white/15'}`} />
            ARP2
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Pitch sequencer mutant amb 16 steps i macro controls</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-right">
          <div className="text-[8px] uppercase tracking-[0.24em] text-white/35 mb-1">Active</div>
          <div className="text-[10px] font-mono text-cyan-200">
            {activeStep + 1} / {arpLength}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Division</label>
          <select
            value={syncDivision}
            onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
            className="bg-slate-950/90 text-white text-xs p-2 rounded-xl border border-white/10 w-full outline-none focus:border-cyan-300"
          >
            {divisionOptions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Mode</label>
          <select
            value={arpMode}
            onChange={(event) => onDataChange(id, { arpMode: event.target.value as ArpMode })}
            className="bg-slate-950/90 text-white text-xs p-2 rounded-xl border border-white/10 w-full outline-none focus:border-cyan-300"
          >
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Scale</label>
          <select
            value={arpScale}
            onChange={(event) => onDataChange(id, { arpScale: event.target.value as ArpScale })}
            className="bg-slate-950/90 text-white text-xs p-2 rounded-xl border border-white/10 w-full outline-none focus:border-cyan-300"
          >
            {scaleOptions.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Length</label>
          <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
            <input
              type="range"
              min={1}
              max={16}
              step={1}
              value={arpLength}
              onChange={(event) => onDataChange(id, { arpLength: Number(event.target.value) })}
              className="w-full accent-cyan-300"
            />
            <div className="mt-1 text-[10px] font-mono text-cyan-200 text-center">{arpLength} steps</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Octaves</label>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={octaveSpan}
            onChange={(event) => onDataChange(id, { arpOctaveSpan: Number(event.target.value) })}
            className="w-full accent-cyan-300"
          />
          <div className="mt-2 text-[10px] font-mono text-cyan-200 text-center">{octaveSpan}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Transpose</label>
          <input
            type="range"
            min={-24}
            max={24}
            step={1}
            value={transpose}
            onChange={(event) => onDataChange(id, { arpTranspose: Number(event.target.value) })}
            className="w-full accent-cyan-300"
          />
          <div className="mt-2 text-[10px] font-mono text-cyan-200 text-center">{transpose > 0 ? `+${transpose}` : transpose} st</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Chance</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={chance}
            onChange={(event) => onDataChange(id, { arpChance: Number(event.target.value) })}
            className="w-full accent-cyan-300"
          />
          <div className="mt-2 text-[10px] font-mono text-cyan-200 text-center">{chance}%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Ratchet</label>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={ratchet}
            onChange={(event) => onDataChange(id, { arpRatchet: Number(event.target.value) })}
            className="w-full accent-cyan-300"
          />
          <div className="mt-2 text-[10px] font-mono text-cyan-200 text-center">x{ratchet}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 items-end mb-4">
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Mutation Bank</label>
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(Number(event.target.value))}
            className="bg-slate-950/90 text-white text-xs p-2 rounded-xl border border-white/10 w-full outline-none focus:border-cyan-300"
          >
            {arp2Presets.map((preset, index) => (
              <option key={preset.name} value={index}>
                {index + 1}. {preset.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => applyPreset(selectedPreset)}
          className="px-4 py-2 rounded-xl bg-cyan-300 text-black text-[10px] font-black uppercase tracking-[0.18em] hover:bg-cyan-200 transition-colors"
        >
          Load Shape
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isOutsideLength = index >= arpLength;

          return (
            <div
              key={`arp2-step-${index}`}
              className={`rounded-xl border p-2 transition-all ${
                isOutsideLength
                  ? 'border-white/5 bg-white/[0.03] opacity-40'
                  : isActive
                    ? stepTriggered
                      ? 'border-cyan-300 bg-cyan-500/15 shadow-[0_0_18px_rgba(34,211,238,0.35)]'
                      : 'border-amber-300 bg-amber-500/10 shadow-[0_0_14px_rgba(251,191,36,0.18)]'
                    : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/55">{index + 1}</div>
                <button
                  onClick={() => updateStep(index, { enabled: !step.enabled })}
                  className={`text-[8px] uppercase font-black px-2 py-1 rounded ${
                    step.enabled ? 'bg-cyan-300 text-black' : 'bg-white/10 text-white/45'
                  }`}
                >
                  {step.enabled ? 'On' : 'Rest'}
                </button>
              </div>

              <select
                value={step.note}
                onChange={(event) => updateStep(index, { note: event.target.value as NoteName })}
                className="bg-slate-900 text-white text-[11px] p-1 rounded border border-slate-700 w-full outline-none mb-2 focus:border-cyan-300"
              >
                {noteOptions.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
              <select
                value={step.octave}
                onChange={(event) => updateStep(index, { octave: Number(event.target.value) })}
                className="bg-slate-900 text-white text-[11px] p-1 rounded border border-slate-700 w-full outline-none focus:border-cyan-300"
              >
                {[2, 3, 4, 5, 6].map((octave) => (
                  <option key={octave} value={octave}>
                    Oct {octave}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">Pitch Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-cyan-300 !w-4 !h-4 !border-2 !border-black"
        />
      </div>
    </div>
  );
};

export default Arp2Node;
