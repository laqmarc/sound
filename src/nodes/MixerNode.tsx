import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SoundNodeData } from '../types';
import './nodeChrome.css';
import './MixerNode.css';

const mixerChannels = [
  {
    key: 'ch1',
    label: 'CH 1',
    color: '#10b981',
    labelKey: 'label_ch1',
  },
  {
    key: 'ch2',
    label: 'CH 2',
    color: '#22c55e',
    labelKey: 'label_ch2',
  },
  {
    key: 'ch3',
    label: 'CH 3',
    color: '#14b8a6',
    labelKey: 'label_ch3',
  },
  {
    key: 'ch4',
    label: 'CH 4',
    color: '#06b6d4',
    labelKey: 'label_ch4',
  },
] as const;

const readNumber = (data: SoundNodeData, key: keyof SoundNodeData, fallback: number) => {
  const value = data[key];
  return typeof value === 'number' ? value : fallback;
};

const readBoolean = (data: SoundNodeData, key: keyof SoundNodeData, fallback: boolean) => {
  const value = data[key];
  return typeof value === 'boolean' ? value : fallback;
};

const MixerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  return (
    <div className="node-chrome mixer-node">
      <div className="mixer-node__header">
        <div>
          <div className="node-chrome__title mixer-node__title">
            <div className="node-chrome__dot mixer-node__dot" />
            4 Channel Mixer
          </div>
          <p className="node-chrome__description">Vol, 3-band EQ, pan and mute</p>
        </div>
        <div className="mixer-node__badge">EQ + Pan</div>
      </div>

      <div className="mixer-node__channels nodrag">
        {mixerChannels.map((channel) => {
          const gainKey = channel.key as keyof SoundNodeData;
          const lowKey = `${channel.key}_low` as keyof SoundNodeData;
          const midKey = `${channel.key}_mid` as keyof SoundNodeData;
          const highKey = `${channel.key}_high` as keyof SoundNodeData;
          const panKey = `${channel.key}_pan` as keyof SoundNodeData;
          const muteKey = `${channel.key}_mute` as keyof SoundNodeData;
          const labelValue = data[channel.labelKey as keyof SoundNodeData];
          const volume = readNumber(data, gainKey, 0.5);
          const low = readNumber(data, lowKey, 0);
          const mid = readNumber(data, midKey, 0);
          const high = readNumber(data, highKey, 0);
          const pan = readNumber(data, panKey, 0);
          const mute = readBoolean(data, muteKey, false);

          return (
            <div key={channel.key} className="mixer-node__channel">
              <Handle
                type="target"
                position={Position.Left}
                id={channel.key}
                style={{ top: '50%', left: '-12px', background: channel.color }}
                className="mixer-node__target"
              />

              <div className="mixer-node__channel-top">
                <div className="mixer-node__channel-label" style={{ color: channel.color }}>
                  {channel.label}
                </div>
                <button
                  type="button"
                  onClick={() => onDataChange(id, { [muteKey]: !mute })}
                  className={`mixer-node__mute-button ${mute ? 'mixer-node__mute-button--active' : ''}`}
                >
                  {mute ? 'Muted' : 'Mute'}
                </button>
              </div>

              <div className="mixer-node__channel-name">
                {typeof labelValue === 'string' ? labelValue : ''}
              </div>

              <div className="mixer-node__volume">
                <Knob
                  label="Vol"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(value) => onDataChange(id, { [gainKey]: value })}
                  color={channel.color}
                  size={52}
                />
              </div>

              <div className="mixer-node__eq-grid">
                <Knob
                  label="Low"
                  min={-18}
                  max={18}
                  step={0.1}
                  value={low}
                  onChange={(value) => onDataChange(id, { [lowKey]: value })}
                  color="#60a5fa"
                  unit="dB"
                  size={40}
                />
                <Knob
                  label="Mid"
                  min={-18}
                  max={18}
                  step={0.1}
                  value={mid}
                  onChange={(value) => onDataChange(id, { [midKey]: value })}
                  color="#f59e0b"
                  unit="dB"
                  size={40}
                />
                <Knob
                  label="High"
                  min={-18}
                  max={18}
                  step={0.1}
                  value={high}
                  onChange={(value) => onDataChange(id, { [highKey]: value })}
                  color="#f472b6"
                  unit="dB"
                  size={40}
                />
                <Knob
                  label="Pan"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={pan}
                  onChange={(value) => onDataChange(id, { [panKey]: value })}
                  color="#22d3ee"
                  size={40}
                />
              </div>

              <div
                className="mixer-node__meter"
                style={{
                  background: mute
                    ? 'rgba(244,63,94,0.6)'
                    : `linear-gradient(90deg, rgba(16,185,129,0.15) 0%, ${channel.color} ${Math.max(8, volume * 100)}%, rgba(255,255,255,0.06) 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Master Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle--source node-handle--source-white"
        />
      </div>
    </div>
  );
};

export default MixerNode;
