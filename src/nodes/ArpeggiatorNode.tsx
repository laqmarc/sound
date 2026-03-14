import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { ArpMode, ArpScale, ArpStep, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';

const noteOptions: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const divisionOptions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];
const modeOptions: ArpMode[] = ['up', 'down', 'random'];
const scaleOptions: ArpScale[] = ['chromatic', 'major', 'minor', 'pentatonic'];

const makeSteps = (entries: Array<[NoteName, number, boolean?]>): ArpStep[] => {
  return entries.map(([note, octave, enabled = true]) => ({
    note,
    octave,
    enabled,
  }));
};

interface ArpPreset {
  name: string;
  steps: ArpStep[];
  syncDivision?: SyncDivision;
}

const arpPresets: ArpPreset[] = [
  {
    name: '4chords',
    syncDivision: '1/1' as SyncDivision,
    steps: makeSteps([['C', 3], ['G', 3], ['A', 3], ['F', 3], ['C', 3], ['G', 3], ['A', 3], ['F', 3]]),
  },
  { name: 'Neon Minor', steps: makeSteps([['C', 4], ['D#', 4], ['G', 4], ['A#', 4], ['C', 5], ['A#', 4], ['G', 4], ['D#', 4]]) },
  { name: 'Major Lift', steps: makeSteps([['C', 4], ['E', 4], ['G', 4], ['B', 4], ['C', 5], ['B', 4], ['G', 4], ['E', 4]]) },
  { name: 'Dark Pulse', steps: makeSteps([['A', 3], ['C', 4], ['E', 4], ['G', 4], ['A', 4], ['G', 4], ['E', 4], ['C', 4]]) },
  { name: 'Club Fifths', steps: makeSteps([['F', 3], ['C', 4], ['F', 4], ['C', 5], ['G', 3], ['D', 4], ['G', 4], ['D', 5]]) },
  { name: 'Glass Pop', steps: makeSteps([['G', 4], ['B', 4], ['D', 5], ['G', 5], ['A', 4], ['C', 5], ['E', 5], ['A', 5]]) },
  { name: 'Low Runner', steps: makeSteps([['C', 3], ['G', 3], ['A#', 3], ['G', 3], ['F', 3], ['G', 3], ['D#', 3], ['G', 3]]) },
  { name: 'Moon Chime', steps: makeSteps([['D', 4], ['A', 4], ['C', 5], ['E', 5], ['D', 5], ['A', 4], ['F', 4], ['C', 4]]) },
  { name: 'Octave Bounce', steps: makeSteps([['C', 4], ['C', 5], ['G', 4], ['G', 5], ['A', 4], ['A', 5], ['F', 4], ['F', 5]]) },
  { name: 'Trap Bells', steps: makeSteps([['F#', 5], ['C#', 5], ['A', 4], ['F#', 4], ['E', 5], ['C#', 5], ['A', 4], ['E', 4]]) },
  { name: 'Soft House', steps: makeSteps([['A', 4], ['C#', 5], ['E', 5], ['F#', 5], ['A', 5], ['F#', 5], ['E', 5], ['C#', 5]]) },
  { name: 'Dream Walk', steps: makeSteps([['E', 4], ['G', 4], ['B', 4], ['D', 5], ['F#', 5], ['D', 5], ['B', 4], ['G', 4]]) },
  { name: 'Retro Game', steps: makeSteps([['C', 5], ['G', 4], ['E', 4], ['G', 4], ['D', 5], ['A', 4], ['F', 4], ['A', 4]]) },
  { name: 'Bass Ladder', steps: makeSteps([['C', 2], ['D#', 2], ['G', 2], ['A#', 2], ['C', 3], ['A#', 2], ['G', 2], ['D#', 2]]) },
  { name: 'Wide Gate', steps: makeSteps([['C', 4], ['E', 4], ['G', 4], ['B', 4], ['C', 5], ['B', 4, false], ['G', 4], ['E', 4, false]]) },
  { name: 'Broken Minor', steps: makeSteps([['D', 4], ['F', 4], ['A', 4], ['C', 5], ['A', 4], ['F', 4], ['D', 4], ['C', 4]]) },
  { name: 'Spark Line', steps: makeSteps([['B', 4], ['D#', 5], ['F#', 5], ['A#', 5], ['B', 5], ['A#', 5], ['F#', 5], ['D#', 5]]) },
];

const defaultSteps = (): ArpStep[] => {
  return arpPresets[1].steps.map((step) => ({ ...step }));
};

const normalizeSteps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultSteps();
  return Array.from({ length: 8 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
    enabled: base[index]?.enabled ?? true,
  }));
};

interface ArpStepEventDetail {
  id?: string;
  stepIndex?: number;
}

const ArpeggiatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.arpSteps);
  const syncDivision = data.syncDivision ?? '1/8';
  const arpMode = data.arpMode ?? 'up';
  const arpScale = data.arpScale ?? 'chromatic';
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(0);

  useEffect(() => {
    const handleArpStep = (event: Event) => {
      const customEvent = event as CustomEvent<ArpStepEventDetail>;
      if (customEvent.detail.id !== id || typeof customEvent.detail.stepIndex !== 'number') {
        return;
      }

      setActiveStep(customEvent.detail.stepIndex);
    };

    window.addEventListener('arpeggiator-step', handleArpStep);
    return () => window.removeEventListener('arpeggiator-step', handleArpStep);
  }, [id]);

  const updateStep = (index: number, patch: Partial<ArpStep>) => {
    const nextSteps = normalizeSteps(steps);
    nextSteps[index] = {
      ...nextSteps[index],
      ...patch,
    };

    onDataChange(id, { arpSteps: nextSteps });
  };

  const applyPreset = (presetIndex: number) => {
    const preset = arpPresets[presetIndex];
    if (!preset) {
      return;
    }

    onDataChange(id, {
      arpSteps: preset.steps.map((step) => ({ ...step })),
      ...(preset.syncDivision ? { syncDivision: preset.syncDivision } : {}),
    });
  };

  return (
    <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[760px]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-lime-400 uppercase mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
            Arpeggiator
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Connect to Oscillator Pitch</p>
        </div>

        <div className="grid grid-cols-3 gap-2 min-w-[360px]">
          <div>
            <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Division</label>
            <select
              value={syncDivision}
              onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-lime-400"
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
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-lime-400"
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
              className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-lime-400"
            >
              {scaleOptions.map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 items-end mb-4">
        <div>
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Preset Bank</label>
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(Number(event.target.value))}
            className="bg-slate-900 text-white text-xs p-1.5 rounded border border-slate-700 w-full outline-none focus:border-lime-400"
          >
            {arpPresets.map((preset, index) => (
              <option key={preset.name} value={index}>
                {index + 1}. {preset.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => applyPreset(selectedPreset)}
          className="px-4 py-2 rounded-lg bg-lime-400 text-black text-[10px] font-black uppercase tracking-[0.18em] hover:bg-lime-300 transition-colors"
        >
          Load Preset
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {steps.map((step, index) => {
          const isActive = activeStep === index;

          return (
            <div
              key={`arp-step-${index}`}
              className={`rounded-xl border p-2 transition-all ${
                isActive
                  ? 'border-lime-400 bg-lime-500/10 shadow-[0_0_16px_rgba(132,204,22,0.3)]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/55">{index + 1}</div>
                <button
                  onClick={() => updateStep(index, { enabled: !step.enabled })}
                  className={`text-[8px] uppercase font-black px-2 py-1 rounded ${
                    step.enabled ? 'bg-lime-400 text-black' : 'bg-white/10 text-white/45'
                  }`}
                >
                  {step.enabled ? 'On' : 'Rest'}
                </button>
              </div>

              <select
                value={step.note}
                onChange={(event) => updateStep(index, { note: event.target.value as NoteName })}
                className="bg-slate-900 text-white text-[11px] p-1 rounded border border-slate-700 w-full outline-none mb-2 focus:border-lime-400"
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
                className="bg-slate-900 text-white text-[11px] p-1 rounded border border-slate-700 w-full outline-none focus:border-lime-400"
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
          className="!bg-lime-400 !w-4 !h-4 !border-2 !border-black"
        />
      </div>
    </div>
  );
};

export default ArpeggiatorNode;
