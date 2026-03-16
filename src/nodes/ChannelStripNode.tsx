import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './ChannelStripNode.css';

const bands = [
  { gainKey: 'band1Gain', qKey: 'band1Q', label: 'Low' },
  { gainKey: 'band2Gain', qKey: 'band2Q', label: 'Low Mid' },
  { gainKey: 'band3Gain', qKey: 'band3Q', label: 'High Mid' },
  { gainKey: 'band4Gain', qKey: 'band4Q', label: 'Air' },
] as const;

const ChannelStripNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const gateThreshold = data.gateThreshold ?? -72;
  const highpassFrequency = data.highpassFrequency ?? 30;
  const lowpassFrequency = data.lowpassFrequency ?? 18000;
  const threshold = data.threshold ?? -24;
  const ratio = data.ratio ?? 4;
  const attack = data.attack ?? 0.01;
  const release = data.release ?? 0.2;
  const makeup = data.makeup ?? 1;

  return (
    <div className="node-chrome channel-strip-node">
      <div className="node-chrome__title channel-strip-node__title">
        <div className="node-chrome__dot channel-strip-node__dot" />
        Channel Strip
      </div>

      <div className="channel-strip-node__top">
        <Knob
          label="HP"
          min={20}
          max={1200}
          step={1}
          value={highpassFrequency}
          onChange={(value) => onDataChange(id, { highpassFrequency: value })}
          color="#86efac"
          unit="Hz"
          size={48}
        />
        <Knob
          label="LP"
          min={1200}
          max={20000}
          step={10}
          value={lowpassFrequency}
          onChange={(value) => onDataChange(id, { lowpassFrequency: value })}
          color="#86efac"
          unit="Hz"
          size={48}
        />
        <Knob
          label="Gate"
          min={-72}
          max={0}
          step={1}
          value={gateThreshold}
          onChange={(value) => onDataChange(id, { gateThreshold: value })}
          color="#fbbf24"
          unit="dB"
          size={48}
        />
        <Knob
          label="Thresh"
          min={-60}
          max={0}
          step={1}
          value={threshold}
          onChange={(value) => onDataChange(id, { threshold: value })}
          color="#6ee7b7"
          unit="dB"
          size={48}
        />
        <Knob
          label="Ratio"
          min={1}
          max={20}
          step={0.1}
          value={ratio}
          onChange={(value) => onDataChange(id, { ratio: value })}
          color="#6ee7b7"
          unit=""
          size={48}
        />
        <Knob
          label="Makeup"
          min={0}
          max={4}
          step={0.01}
          value={makeup}
          onChange={(value) => onDataChange(id, { makeup: value })}
          color="#6ee7b7"
          unit="x"
          size={48}
        />
        <Knob
          label="Attack"
          min={0}
          max={1}
          step={0.001}
          value={attack}
          onChange={(value) => onDataChange(id, { attack: value })}
          color="#6ee7b7"
          unit="s"
          size={48}
        />
        <Knob
          label="Release"
          min={0.01}
          max={1}
          step={0.001}
          value={release}
          onChange={(value) => onDataChange(id, { release: value })}
          color="#6ee7b7"
          unit="s"
          size={48}
        />
      </div>

      <div className="channel-strip-node__bands">
        {bands.map((band) => {
          const gain = data[band.gainKey] as number | undefined ?? 0;
          const q = data[band.qKey] as number | undefined ?? 0.8;

          return (
            <div key={band.label} className="channel-strip-node__band">
              <div className="channel-strip-node__band-label">{band.label}</div>
              <div className="channel-strip-node__band-controls">
                <Knob
                  label="Gain"
                  min={-18}
                  max={18}
                  step={0.5}
                  value={gain}
                  onChange={(value) => onDataChange(id, { [band.gainKey]: value })}
                  color="#67e8f9"
                  unit="dB"
                  size={46}
                />
                <Knob
                  label="Q"
                  min={0.2}
                  max={8}
                  step={0.1}
                  value={q}
                  onChange={(value) => onDataChange(id, { [band.qKey]: value })}
                  color="#67e8f9"
                  unit=""
                  size={46}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Gate / Comp / EQ / Filters</span>
        <div className="channel-strip-node__handles">
          <Handle type="target" position={Position.Left} className="node-handle--source node-handle--source-emerald" />
          <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-emerald" />
        </div>
      </div>
    </div>
  );
};

export default ChannelStripNode;
