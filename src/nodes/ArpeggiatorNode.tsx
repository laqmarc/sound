import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { ArpStep, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';

const noteOptions: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const divisionOptions: SyncDivision[] = ['1/1', '1/2', '1/4', '1/8', '1/16'];

const defaultSteps = (): ArpStep[] => [
  { note: 'C', octave: 4 },
  { note: 'E', octave: 4 },
  { note: 'G', octave: 4 },
  { note: 'B', octave: 4 },
  { note: 'C', octave: 5 },
  { note: 'B', octave: 4 },
  { note: 'G', octave: 4 },
  { note: 'E', octave: 4 },
];

const normalizeSteps = (steps?: ArpStep[]) => {
  const base = steps && steps.length > 0 ? steps : defaultSteps();
  return Array.from({ length: 8 }, (_, index) => ({
    note: base[index]?.note ?? 'C',
    octave: base[index]?.octave ?? 4,
  }));
};

interface ArpStepEventDetail {
  id?: string;
  stepIndex?: number;
}

const ArpeggiatorNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = normalizeSteps(data.arpSteps);
  const syncDivision = data.syncDivision ?? '1/8';
  const [activeStep, setActiveStep] = useState(0);

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

  return (
    <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[620px]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-lime-400 uppercase mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
            Arpeggiator
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Connect to Oscillator Pitch</p>
        </div>

        <div className="min-w-[110px]">
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
              <div className="text-[9px] text-center font-black uppercase tracking-widest mb-2 text-white/55">
                {index + 1}
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
