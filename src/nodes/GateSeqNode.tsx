import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps, SyncDivision } from '../types';
import './nodeChrome.css';
import './GateSeqNode.css';

const divisions: SyncDivision[] = ['1/4', '1/8', '1/16'];

const defaultSteps = Array.from({ length: 16 }, (_, index) => index % 2 === 0);

const GateSeqNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const steps = data.steps ?? defaultSteps;
  const syncDivision = data.syncDivision ?? '1/16';

  const toggleStep = (index: number) => {
    const next = Array.from({ length: 16 }, (_, stepIndex) => {
      if (stepIndex === index) {
        return !steps[stepIndex];
      }
      return steps[stepIndex] ?? false;
    });
    onDataChange(id, { steps: next });
  };

  return (
    <div className="node-chrome gate-seq-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Gate Seq
      </div>

      <div>
        <label className="node-chrome__field-label">Clock</label>
        <select
          value={syncDivision}
          onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
          className="node-chrome__select"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="gate-seq-node__steps">
        {Array.from({ length: 16 }, (_, index) => {
          const active = steps[index] ?? false;
          return (
            <button
              type="button"
              key={index}
              onClick={() => toggleStep(index)}
              className={`gate-seq-node__step ${active ? 'gate-seq-node__step--active' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <div className="gate-seq-node__footer-left">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-amber" />
          <span className="node-chrome__footer-label">Chop Audio</span>
        </div>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
      </div>
    </div>
  );
};

export default GateSeqNode;
