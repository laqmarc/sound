import { Volume2, VolumeX } from 'lucide-react';

import Knob from '../Knob';

interface TransportState {
  isPlaying: boolean;
  step: number;
  bpm: number;
  swing: number;
}

interface TransportAsideProps {
  audioStarted: boolean;
  transport: TransportState;
  onSetTransportBpm: (value: number) => void;
  onSetTransportSwing: (value: number) => void;
  onStartAudio: () => void;
  onStopAudio: () => void;
  onResetCanvas: () => void;
}

export function TransportAside({
  audioStarted,
  transport,
  onSetTransportBpm,
  onSetTransportSwing,
  onStartAudio,
  onStopAudio,
  onResetCanvas,
}: TransportAsideProps) {
  return (
    <aside className="hidden lg:flex w-52 xl:w-56 shrink-0 border-l border-white/10 bg-black/35 backdrop-blur-xl p-4 flex-col gap-4 overflow-y-auto">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-white/40 mb-3">Transport</div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }, (_, step) => (
              <div
                key={`transport-step-${step}`}
                className={`h-6 rounded-xl transition-all ${
                  transport.step % 16 === step && transport.isPlaying
                    ? 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.85)]'
                    : 'bg-white/10'
                } ${step % 4 === 0 ? 'ring-1 ring-white/10' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center">
          <div className="text-[9px] uppercase tracking-[0.22em] text-white/35 mb-1">State</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/75">
            {transport.isPlaying ? 'Running' : 'Stopped'}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Knob
            label="BPM"
            min={60}
            max={180}
            step={1}
            value={transport.bpm}
            onChange={onSetTransportBpm}
            color="#38bdf8"
            size={54}
          />

          <div className="w-full rounded-2xl border border-white/10 bg-black/25 p-3">
            <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-3">Swing</label>
            <input
              type="range"
              min={0}
              max={0.45}
              step={0.01}
              value={transport.swing}
              onChange={(event) => onSetTransportSwing(Number(event.target.value))}
              className="w-full accent-rose-400"
            />
            <div className="text-[10px] text-white/55 mt-2 font-mono text-center">
              {Math.round(transport.swing * 100)}%
            </div>
          </div>
        </div>
      </section>

      {!audioStarted ? (
        <div className="flex flex-col gap-3">
          <button
            onClick={onStartAudio}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            START ENGINE
          </button>
          <button
            onClick={onResetCanvas}
            className="w-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-4 py-3 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            RESET
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={onStopAudio}
            className="w-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white/60 border border-white/10 px-4 py-3 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <VolumeX className="w-4 h-4" />
            STOP
          </button>
          <button
            onClick={onResetCanvas}
            className="w-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-4 py-3 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            RESET
          </button>
        </div>
      )}
    </aside>
  );
}
