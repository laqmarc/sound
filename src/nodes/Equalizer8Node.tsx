import { Handle, Position } from 'reactflow';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './Equalizer8Node.css';

const bandLabels = ['60', '170', '310', '600', '1k', '3k', '6k', '12k'];

const normalizeBands = (bands?: number[]) => {
  return Array.from({ length: 8 }, (_, index) => bands?.[index] ?? 0);
};

const Equalizer8Node = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const bands = normalizeBands(data.eqBands);

  const updateBand = (bandIndex: number, value: number) => {
    const nextBands = normalizeBands(bands);
    nextBands[bandIndex] = value;
    onDataChange(id, { eqBands: nextBands });
  };

  const stopDragPropagation = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="node-chrome equalizer8-node">
      <div className="node-chrome__title">
        <div className="node-chrome__dot" />
        Equalizer 8-Band
      </div>

      <div className="equalizer8-node__bands">
        {bands.map((band, index) => (
          <div key={`eq-band-${bandLabels[index]}`} className="equalizer8-node__band">
            <div className="equalizer8-node__value">{band > 0 ? `+${band}` : band}dB</div>
            <input
              type="range"
              min={-24}
              max={24}
              step={1}
              value={band}
              onMouseDown={stopDragPropagation}
              onChange={(event) => updateBand(index, Number(event.target.value))}
              className="equalizer8-node__slider nodrag"
            />
            <div className="equalizer8-node__band-label">{bandLabels[index]}</div>
          </div>
        ))}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Tone Shape</span>
        <div className="equalizer8-node__handles">
          <span className="equalizer8-node__io-label">In</span>
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-cyan" />
          <span className="equalizer8-node__io-label">Out</span>
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-cyan" />
        </div>
      </div>
    </div>
  );
};

export default Equalizer8Node;
