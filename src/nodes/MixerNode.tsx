import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps, SoundNodeData } from '../types';

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
    <div className="min-w-[520px] rounded-[26px] border border-emerald-400/15 bg-[linear-gradient(145deg,rgba(8,18,16,0.98),rgba(8,24,20,0.94))] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
            <div className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
            4 Channel Mixer
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Vol, 3-band EQ, pan and mute</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-mono text-emerald-200">
          EQ + Pan
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 nodrag">
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
            <div key={channel.key} className="relative rounded-[22px] border border-white/10 bg-black/25 p-3">
              <Handle
                type="target"
                position={Position.Left}
                id={channel.key}
                style={{ top: '50%', left: '-12px' }}
                className="!h-3 !w-3 !border-2 !border-black"
              />

              <div className="mb-2 flex items-center justify-between">
                <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: channel.color }}>
                  {channel.label}
                </div>
                <button
                  onClick={() => onDataChange(id, { [muteKey]: !mute })}
                  className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                    mute
                      ? 'border-rose-400/30 bg-rose-500/15 text-rose-200'
                      : 'border-white/10 bg-white/5 text-white/45'
                  }`}
                >
                  {mute ? 'Muted' : 'Mute'}
                </button>
              </div>

              <div className="mb-2 h-3 text-[8px] font-bold uppercase text-white/30">
                {typeof labelValue === 'string' ? labelValue : ''}
              </div>

              <div className="mb-3 flex justify-center">
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

              <div className="grid grid-cols-2 gap-2">
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
                className="mt-3 h-1.5 rounded-full transition-all"
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

      <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between">
        <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">Master Out</span>
        <Handle
          type="source"
          position={Position.Right}
          className="!h-4 !w-4 !border-2 !border-black !bg-white"
        />
      </div>
    </div>
  );
};

export default MixerNode;
