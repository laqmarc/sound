import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SoundNodeData, SyncDivision } from '../types';
import './nodeChrome.css';
import './WeirdMachineNode.css';

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
    <div className="node-chrome weird-machine-node">
      <div className="weird-machine-node__header">
        <div>
          <div className="node-chrome__title weird-machine-node__title">
            <div className="node-chrome__dot weird-machine-node__dot" />
            Mutant Box
          </div>
          <p className="node-chrome__description">Strange Sound Reactor</p>
        </div>

        <div className="weird-machine-node__leds">
          {ledValues.map((value, index) => (
            <div
              key={`led-${index}`}
              className="weird-machine-node__led"
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

      <div className="weird-machine-node__knobs nodrag">
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

      <div className="weird-machine-node__controls nodrag">
        <button
          type="button"
          onClick={() => onDataChange(id, { sync: !sync })}
          className={`weird-machine-node__toggle ${sync ? 'weird-machine-node__toggle--active' : ''}`}
        >
          {sync ? 'Sync On' : 'Sync Off'}
        </button>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="weird-machine-node__select"
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
          className="weird-machine-node__select"
        >
          <option value="sine">Carrier Sine</option>
          <option value="triangle">Carrier Triangle</option>
          <option value="sawtooth">Carrier Saw</option>
          <option value="square">Carrier Square</option>
        </select>
        <select
          value={modType}
          onChange={(event) => onDataChange(id, { modType: event.target.value as OscillatorType })}
          className="weird-machine-node__select"
        >
          <option value="sine">Harmonic Sine</option>
          <option value="triangle">Harmonic Triangle</option>
          <option value="sawtooth">Harmonic Saw</option>
          <option value="square">Harmonic Square</option>
        </select>
      </div>

      <div className="weird-machine-node__sequence nodrag">
        <div className="weird-machine-node__sequence-head">
          <div className="weird-machine-node__sequence-title">Mutant Steps</div>
          <div className="weird-machine-node__sequence-mode">
            {sync ? `Sync ${syncDivision}` : 'Free Reactor'}
          </div>
        </div>
        <div className="weird-machine-node__steps">
          {steps.map((isHot, stepIndex) => {
            const isCurrent = currentSeqStep === stepIndex;
            return (
              <button
                type="button"
                key={`mut-step-${stepIndex}`}
                onClick={() => toggleStep(stepIndex)}
                className={[
                  'weird-machine-node__step',
                  isHot ? 'weird-machine-node__step--on' : '',
                  isCurrent ? 'weird-machine-node__step--current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {stepIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="weird-machine-node__moods nodrag">
        <button
          type="button"
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
          className="weird-machine-node__mood-button weird-machine-node__mood-button--glass"
        >
          Glass
        </button>
        <button
          type="button"
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
          className="weird-machine-node__mood-button weird-machine-node__mood-button--grit"
        >
          Grit
        </button>
        <button
          type="button"
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
          className="weird-machine-node__mood-button weird-machine-node__mood-button--beast"
        >
          Beast
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="pitch"
        className="node-handle--pitch"
        style={{ top: '28%' }}
      />
      <div className="node-chrome__pitch-label node-chrome__pitch-label--lead">Pitch</div>

      <Handle
        type="source"
        position={Position.Right}
        className="node-handle--source node-handle--source-fuchsia"
      />
    </div>
  );
};

export default WeirdMachineNode;
