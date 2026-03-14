import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { ArpMode, ArpScale, ArpStep, ControllableSoundNodeProps, NoteName, SyncDivision } from '../types';
import './nodeChrome.css';
import './ArpeggiatorNode.css';

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
    <div className="node-chrome arpeggiator-node">
      <div className="arpeggiator-node__header">
        <div>
          <div className="node-chrome__title arpeggiator-node__title">
            <div className="node-chrome__dot arpeggiator-node__dot" />
            Arpeggiator
          </div>
          <p className="node-chrome__description">Connect to Oscillator Pitch</p>
        </div>

        <div className="node-chrome__grid-3">
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
        </div>
      </div>

      <div className="arpeggiator-node__bank">
        <div>
          <label className="node-chrome__field-label">Preset Bank</label>
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(Number(event.target.value))}
            className="node-chrome__select"
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
          className="arpeggiator-node__button"
        >
          Load Preset
        </button>
      </div>

      <div className="node-chrome__grid-8">
        {steps.map((step, index) => {
          const isActive = activeStep === index;

          return (
            <div
              key={`arp-step-${index}`}
              className={`node-chrome__step-card ${isActive ? 'node-chrome__step-card--active' : ''}`}
            >
              <div className="node-chrome__step-row">
                <div className="node-chrome__step-index">{index + 1}</div>
                <button
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
                className="node-chrome__select"
                style={{ marginBottom: '0.5rem' }}
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
          className="node-handle--source node-handle--source-lime"
        />
      </div>
    </div>
  );
};

export default ArpeggiatorNode;
