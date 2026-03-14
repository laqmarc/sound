import { Volume2, VolumeX } from 'lucide-react';

import Knob from '../Knob';

interface TransportState {
  isPlaying: boolean;
  step: number;
  bpm: number;
  swing: number;
}

interface HeaderTransportControlsProps {
  audioStarted: boolean;
  transport: TransportState;
  onSetTransportBpm: (value: number) => void;
  onSetTransportSwing: (value: number) => void;
  onStartAudio: () => void;
  onStopAudio: () => void;
}

export function HeaderTransportControls({
  audioStarted,
  transport,
  onSetTransportBpm,
  onSetTransportSwing,
  onStartAudio,
  onStopAudio,
}: HeaderTransportControlsProps) {
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <div className="hidden xl:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 16 }, (_, step) => (
            <div
              key={`transport-step-${step}`}
              className={`w-2 h-6 rounded-full transition-all ${
                transport.step % 16 === step && transport.isPlaying
                  ? 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.85)]'
                  : 'bg-white/10'
              } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''}`}
            />
          ))}
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/45 whitespace-nowrap">
          {transport.isPlaying ? 'Running' : 'Stopped'}
        </div>
        <Knob
          label="BPM"
          min={60}
          max={180}
          step={1}
          value={transport.bpm}
          onChange={onSetTransportBpm}
          color="#38bdf8"
          size={46}
        />
        <div className="min-w-[96px]">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">Swing</label>
          <input
            type="range"
            min={0}
            max={0.45}
            step={0.01}
            value={transport.swing}
            onChange={(event) => onSetTransportSwing(Number(event.target.value))}
            className="w-full accent-rose-400"
          />
          <div className="text-[10px] text-white/55 mt-1 font-mono">{Math.round(transport.swing * 100)}%</div>
        </div>
      </div>

      {!audioStarted ? (
        <button
          onClick={onStartAudio}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          START ENGINE
        </button>
      ) : (
        <button
          onClick={onStopAudio}
          className="bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white/60 border border-white/10 px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center gap-2 active:scale-95"
        >
          <VolumeX className="w-4 h-4" />
          STOP
        </button>
      )}
    </div>
  );
}
