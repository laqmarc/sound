import { useMemo, useState, type CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SoundNodeData, SyncDivision } from '../types';
import './nodeChrome.css';
import './MixerNode.css';

const mixerChannels = [
  { key: 'ch1', label: 'CH 1', color: '#34d399', labelKey: 'label_ch1' },
  { key: 'ch2', label: 'CH 2', color: '#22c55e', labelKey: 'label_ch2' },
  { key: 'ch3', label: 'CH 3', color: '#2dd4bf', labelKey: 'label_ch3' },
  { key: 'ch4', label: 'CH 4', color: '#38bdf8', labelKey: 'label_ch4' },
  { key: 'ch5', label: 'CH 5', color: '#60a5fa', labelKey: 'label_ch5' },
  { key: 'ch6', label: 'CH 6', color: '#818cf8', labelKey: 'label_ch6' },
  { key: 'ch7', label: 'CH 7', color: '#a78bfa', labelKey: 'label_ch7' },
  { key: 'ch8', label: 'CH 8', color: '#f472b6', labelKey: 'label_ch8' },
] as const;

type MixerChannelMeta = (typeof mixerChannels)[number];
const syncDivisions: SyncDivision[] = ['1/1', '1/2', '1/2.', '1/4', '1/4.', '1/8', '1/8.', '1/16', '1/16.'];

const readNumber = (data: SoundNodeData, key: keyof SoundNodeData, fallback: number) => {
  const value = data[key];
  return typeof value === 'number' ? value : fallback;
};

const readBoolean = (data: SoundNodeData, key: keyof SoundNodeData, fallback: boolean) => {
  const value = data[key];
  return typeof value === 'boolean' ? value : fallback;
};

const MixerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const [selectedChannelKey, setSelectedChannelKey] = useState<MixerChannelMeta['key']>('ch1');
  const selectedChannel = useMemo(
    () => mixerChannels.find((channel) => channel.key === selectedChannelKey) ?? mixerChannels[0],
    [selectedChannelKey],
  );

  const selectedPrefix = selectedChannel.key as keyof SoundNodeData;
  const selectedLowKey = `${selectedChannel.key}_low` as keyof SoundNodeData;
  const selectedMidKey = `${selectedChannel.key}_mid` as keyof SoundNodeData;
  const selectedHighKey = `${selectedChannel.key}_high` as keyof SoundNodeData;
  const selectedPanKey = `${selectedChannel.key}_pan` as keyof SoundNodeData;
  const selectedMuteKey = `${selectedChannel.key}_mute` as keyof SoundNodeData;
  const selectedGateKey = `${selectedChannel.key}_gate` as keyof SoundNodeData;
  const selectedCompKey = `${selectedChannel.key}_comp` as keyof SoundNodeData;
  const selectedRoomKey = `${selectedChannel.key}_room` as keyof SoundNodeData;
  const selectedDelayKey = `${selectedChannel.key}_delay` as keyof SoundNodeData;
  const selectedLabelValue = data[selectedChannel.labelKey as keyof SoundNodeData];
  const delaySync = data.sync ?? true;
  const delayDivision = data.syncDivision ?? '1/8';

  return (
    <div
      className="node-chrome mixer-node"
      data-tutorial="mixer-node"
      style={
        {
          '--mixer-detail-accent': selectedChannel.color,
        } as CSSProperties
      }
    >
      <div className="mixer-node__header">
        <div>
          <div className="node-chrome__title mixer-node__title">
            <div className="node-chrome__dot mixer-node__dot" />
            8 Channel Mixer
          </div>
          <p className="node-chrome__description mixer-node__description">
            3-band EQ, gate, compressor and aux sends on every strip.
          </p>
        </div>
        <div className="mixer-node__badge">8 CH / FX BUS</div>
      </div>

      <div className="mixer-node__channel-grid nodrag">
        {mixerChannels.map((channel) => {
          const gainKey = channel.key as keyof SoundNodeData;
          const muteKey = `${channel.key}_mute` as keyof SoundNodeData;
          const roomKey = `${channel.key}_room` as keyof SoundNodeData;
          const delayKey = `${channel.key}_delay` as keyof SoundNodeData;
          const labelValue = data[channel.labelKey as keyof SoundNodeData];
          const volume = readNumber(data, gainKey, 0.5);
          const mute = readBoolean(data, muteKey, false);
          const roomSend = readNumber(data, roomKey, 0);
          const delaySend = readNumber(data, delayKey, 0);
          const isSelected = selectedChannel.key === channel.key;

          return (
            <button
              key={channel.key}
              type="button"
              className={`mixer-node__channel-card ${isSelected ? 'mixer-node__channel-card--selected' : ''}`}
              onClick={() => setSelectedChannelKey(channel.key)}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={channel.key}
                style={{ top: '50%', left: '-12px', background: channel.color }}
                className="mixer-node__target"
              />
              <div className="mixer-node__card-top">
                <span className="mixer-node__card-label" style={{ color: channel.color }}>{channel.label}</span>
                <span className={`mixer-node__card-state ${mute ? 'mixer-node__card-state--muted' : ''}`}>
                  {mute ? 'M' : 'ON'}
                </span>
              </div>
              <div className="mixer-node__card-name">{typeof labelValue === 'string' && labelValue ? labelValue : 'Empty'}</div>
              <div className="mixer-node__card-meter">
                <div className="mixer-node__card-fill" style={{ width: `${Math.max(8, volume * 100)}%`, background: channel.color }} />
              </div>
              <div className="mixer-node__card-sends">
                <span>R {Math.round(roomSend * 100)}</span>
                <span>D {Math.round(delaySend * 100)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mixer-node__detail nodrag">
        <div className="mixer-node__detail-header">
          <div>
            <div className="mixer-node__detail-kicker" style={{ color: selectedChannel.color }}>{selectedChannel.label}</div>
            <div className="mixer-node__detail-name">{typeof selectedLabelValue === 'string' && selectedLabelValue ? selectedLabelValue : 'No source name'}</div>
          </div>
          <button
            type="button"
            className={`mixer-node__mute-button ${readBoolean(data, selectedMuteKey, false) ? 'mixer-node__mute-button--active' : ''}`}
            onClick={() => onDataChange(id, { [selectedMuteKey]: !readBoolean(data, selectedMuteKey, false) })}
          >
            {readBoolean(data, selectedMuteKey, false) ? 'Muted' : 'Mute'}
          </button>
        </div>

        <div className="mixer-node__detail-grid">
          <Knob
            label="Vol"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, selectedPrefix, 0.5)}
            onChange={(value) => onDataChange(id, { [selectedPrefix]: value })}
            color={selectedChannel.color}
            size={48}
          />
          <Knob
            label="Pan"
            min={-1}
            max={1}
            step={0.01}
            value={readNumber(data, selectedPanKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedPanKey]: value })}
            color="#38bdf8"
            size={48}
          />
          <Knob
            label="Gate"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, selectedGateKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedGateKey]: value })}
            color="#f87171"
            size={48}
          />
          <Knob
            label="Comp"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, selectedCompKey, 0.18)}
            onChange={(value) => onDataChange(id, { [selectedCompKey]: value })}
            color="#c084fc"
            size={48}
          />
          <Knob
            label="Room"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, selectedRoomKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedRoomKey]: value })}
            color="#f59e0b"
            size={48}
          />
          <Knob
            label="Delay"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, selectedDelayKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedDelayKey]: value })}
            color="#fb7185"
            size={48}
          />
          <Knob
            label="Low"
            min={-18}
            max={18}
            step={0.1}
            value={readNumber(data, selectedLowKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedLowKey]: value })}
            color="#60a5fa"
            unit="dB"
            size={48}
          />
          <Knob
            label="Mid"
            min={-18}
            max={18}
            step={0.1}
            value={readNumber(data, selectedMidKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedMidKey]: value })}
            color="#facc15"
            unit="dB"
            size={48}
          />
          <Knob
            label="High"
            min={-18}
            max={18}
            step={0.1}
            value={readNumber(data, selectedHighKey, 0)}
            onChange={(value) => onDataChange(id, { [selectedHighKey]: value })}
            color="#f472b6"
            unit="dB"
            size={48}
          />
        </div>
      </div>

      <div className="mixer-node__fx nodrag">
        <div className="mixer-node__fx-header">
          <span className="mixer-node__fx-title">Built-in Returns</span>
          <span className="mixer-node__fx-copy">Room reverb + master delay</span>
        </div>
        <div className="mixer-node__fx-sync">
          <button
            type="button"
            className={`mixer-node__sync-toggle ${delaySync ? 'mixer-node__sync-toggle--active' : ''}`}
            onClick={() => onDataChange(id, { sync: !delaySync })}
          >
            {delaySync ? 'Delay Sync On' : 'Delay Sync Off'}
          </button>
          {delaySync ? (
            <div className="mixer-node__sync-select">
              <label className="node-chrome__field-label">Delay Division</label>
              <select
                value={delayDivision}
                onChange={(event) => onDataChange(id, { syncDivision: event.target.value as SyncDivision })}
                className="node-chrome__select"
              >
                {syncDivisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <div className="mixer-node__fx-grid">
          <Knob
            label="Room Size"
            min={0.2}
            max={1}
            step={0.01}
            value={readNumber(data, 'roomSize', 0.58)}
            onChange={(value) => onDataChange(id, { roomSize: value })}
            color="#f59e0b"
            size={48}
          />
          <Knob
            label="Decay"
            min={0.3}
            max={8}
            step={0.01}
            value={readNumber(data, 'decay', 2.8)}
            onChange={(value) => onDataChange(id, { decay: value })}
            color="#fb923c"
            unit="s"
            size={48}
          />
          <Knob
            label="Room Ret"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, 'roomReturn', 0.24)}
            onChange={(value) => onDataChange(id, { roomReturn: value })}
            color="#fbbf24"
            size={48}
          />
          {delaySync ? (
            <div className="mixer-node__sync-summary">
              <span className="mixer-node__sync-summary-label">Delay Time</span>
              <span className="mixer-node__sync-summary-value">{delayDivision}</span>
            </div>
          ) : (
            <Knob
              label="Delay"
              min={0.05}
              max={0.9}
              step={0.01}
              value={readNumber(data, 'delayTime', 0.28)}
              onChange={(value) => onDataChange(id, { delayTime: value })}
              color="#fb7185"
              unit="s"
              size={48}
            />
          )}
          <Knob
            label="Feed"
            min={0}
            max={0.92}
            step={0.01}
            value={readNumber(data, 'feedback', 0.36)}
            onChange={(value) => onDataChange(id, { feedback: value })}
            color="#f43f5e"
            size={48}
          />
          <Knob
            label="Delay Ret"
            min={0}
            max={1}
            step={0.01}
            value={readNumber(data, 'delayReturn', 0.22)}
            onChange={(value) => onDataChange(id, { delayReturn: value })}
            color="#e879f9"
            size={48}
          />
        </div>
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">Master Out</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-white" />
      </div>
    </div>
  );
};

export default MixerNode;
