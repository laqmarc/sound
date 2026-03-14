import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { ArpMode, ArpScale, ArpStep, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';
import './nodeChrome.css';
import './Arp2Node.css';

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
    <div className="node-chrome arp2-node">
      <div className="arp2-node__header">
        <div>
          <div className="node-chrome__title arp2-node__title">
            <div className={`node-chrome__dot arp2-node__dot ${stepTriggered ? '' : 'arp2-node__dot--idle'}`} />
            ARP2
          </div>
          <p className="node-chrome__description">Pitch sequencer mutant amb 16 steps i macro controls</p>
        </div>
        <div className="arp2-node__status-card">
          <div className="arp2-node__status-label">Active</div>
          <div className="arp2-node__status-value">
            {activeStep + 1} / {arpLength}
          </div>
        </div>
      </div>

      <div className="arp2-node__control-grid">
        <div>
          <label className="node-chrome__field-label">Division</label>
          <select
            value={syncDivision}
            onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
            className="node-chrome__select"
          >
            {divisionOptions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Mode</label>
          <select
            value={arpMode}
            onChange={(event) => onDataChange(id, { arpMode: event.target.value as ArpMode })}
            className="node-chrome__select"
          >
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Scale</label>
          <select
            value={arpScale}
            onChange={(event) => onDataChange(id, { arpScale: event.target.value as ArpScale })}
            className="node-chrome__select"
          >
            {scaleOptions.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-chrome__field-label">Length</label>
          <div className="arp2-node__range-card">
            <input
              type="range"
              min={1}
              max={16}
              step={1}
              value={arpLength}
              onChange={(event) => onDataChange(id, { arpLength: Number(event.target.value) })}
              className="arp2-node__range"
            />
            <div className="arp2-node__range-value">{arpLength} steps</div>
          </div>
        </div>
      </div>

      <div className="arp2-node__macro-grid">
        <div className="arp2-node__range-card">
          <label className="node-chrome__field-label">Octaves</label>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={octaveSpan}
            onChange={(event) => onDataChange(id, { arpOctaveSpan: Number(event.target.value) })}
            className="arp2-node__range"
          />
          <div className="arp2-node__range-value">{octaveSpan}</div>
        </div>
        <div className="arp2-node__range-card">
          <label className="node-chrome__field-label">Transpose</label>
          <input
            type="range"
            min={-24}
            max={24}
            step={1}
            value={transpose}
            onChange={(event) => onDataChange(id, { arpTranspose: Number(event.target.value) })}
            className="arp2-node__range"
          />
          <div className="arp2-node__range-value">{transpose > 0 ? `+${transpose}` : transpose} st</div>
        </div>
        <div className="arp2-node__range-card">
          <label className="node-chrome__field-label">Chance</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={chance}
            onChange={(event) => onDataChange(id, { arpChance: Number(event.target.value) })}
            className="arp2-node__range"
          />
          <div className="arp2-node__range-value">{chance}%</div>
        </div>
        <div className="arp2-node__range-card">
          <label className="node-chrome__field-label">Ratchet</label>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={ratchet}
            onChange={(event) => onDataChange(id, { arpRatchet: Number(event.target.value) })}
            className="arp2-node__range"
          />
          <div className="arp2-node__range-value">x{ratchet}</div>
        </div>
      </div>

      <div className="arp2-node__bank">
        <div>
          <label className="node-chrome__field-label">Mutation Bank</label>
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(Number(event.target.value))}
            className="node-chrome__select"
          >
            {arp2Presets.map((preset, index) => (
              <option key={preset.name} value={index}>
                {index + 1}. {preset.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => applyPreset(selectedPreset)}
          className="arp2-node__button"
        >
          Load Shape
        </button>
      </div>

      <div className="node-chrome__grid-8">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isOutsideLength = index >= arpLength;

          return (
            <div
              key={`arp2-step-${index}`}
              className={[
                'node-chrome__step-card',
                isOutsideLength ? 'arp2-node__step-card--outside' : '',
                isActive && stepTriggered ? 'node-chrome__step-card--active' : '',
                isActive && !stepTriggered ? 'arp2-node__step-card--muted-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="node-chrome__step-row">
                <div className="node-chrome__step-index">{index + 1}</div>
                <button
                  type="button"
                  onClick={() => updateStep(index, { enabled: !step.enabled })}
                  className={`node-chrome__step-toggle ${
                    step.enabled ? 'node-chrome__step-toggle--on' : 'node-chrome__step-toggle--off'
                  }`}
                >
                  {step.enabled ? 'On' : 'Rest'}
                </button>
              </div>

              <select
                value={step.note}
                onChange={(event) => updateStep(index, { note: event.target.value as NoteName })}
                className="node-chrome__select arp2-node__step-select"
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
                className="node-chrome__select"
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

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Pitch Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle--source node-handle--source-cyan"
        />
      </div>
    </div>
  );
};

export default Arp2Node;
