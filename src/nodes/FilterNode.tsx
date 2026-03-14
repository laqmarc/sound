import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './FilterNode.css';

const FilterNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const frequency = data.frequency ?? 1000;
  const filterType = (data.type as BiquadFilterType | undefined) ?? 'lowpass';
  const q = data.Q ?? 1;

  return (
    <div className="node-chrome filter-node">
      <div className="node-chrome__title filter-node__title">
        <div className="node-chrome__dot filter-node__dot" />
        Filtre
      </div>

      <div className="filter-node__body">
        <div className="filter-node__knobs">
          <Knob
            label="Freq Tall"
            min={20}
            max={15000}
            value={frequency}
            onChange={(value) => onDataChange(id, { frequency: value })}
            color="#a855f7"
            unit="Hz"
            size={55}
          />
          <Knob
            label="Ressonancia (Q)"
            min={0}
            max={20}
            value={q}
            onChange={(value) => onDataChange(id, { Q: value })}
            color="#a855f7"
            size={55}
            step={0.1}
          />
        </div>

        <div>
          <label className="filter-node__label">Tipus</label>
          <select
            value={filterType}
            onChange={(event) => onDataChange(id, { type: event.target.value as BiquadFilterType })}
            className="filter-node__select"
          >
            <option value="lowpass">Pas Baix (Lowpass)</option>
            <option value="highpass">Pas Alt (Highpass)</option>
            <option value="bandpass">Pas de Banda</option>
            <option value="notch">Filtre Rebuig (Notch)</option>
          </select>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-purple" />
      <Handle
        type="target"
        position={Position.Left}
        id="mod"
        className="node-handle--source node-handle--source-purple"
        style={{ top: '70%', width: '0.75rem', height: '0.75rem' }}
      />
      <div className="filter-node__mod-label">Mod</div>

      <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-purple" />
    </div>
  );
};

export default FilterNode;
