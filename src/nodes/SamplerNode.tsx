import { useRef, type ChangeEvent, type CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import Knob from '../components/Knob';
import type { ControllableSoundNodeProps } from '../types';
import './nodeChrome.css';
import './SamplerNode.css';

const SamplerNode = ({ id, data, onDataChange }: ControllableSoundNodeProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const gain = data.gain ?? 0.85;
  const playbackRate = data.playbackRate ?? 1;
  const loop = data.loop ?? false;
  const hasSample = Boolean(data.sampleDataUrl);
  const sampleName = data.sampleName?.trim() || 'No file loaded';
  const triggerNonce = data.triggerNonce ?? 0;
  const stopNonce = data.stopNonce ?? 0;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return;
      }

      onDataChange(id, {
        sampleDataUrl: reader.result,
        sampleName: file.name,
        stopNonce: stopNonce + 1,
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div
      className="node-chrome sampler-node"
      style={
        {
          '--sampler-accent': '#fbbf24',
          '--sampler-bg': 'rgba(69, 26, 3, 0.9)',
          '--sampler-border': 'rgba(251, 191, 36, 0.24)',
        } as CSSProperties
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav"
        className="sampler-node__input"
        onChange={handleFileChange}
      />

      <div className="node-chrome__title sampler-node__title">
        <div className="node-chrome__dot sampler-node__dot" />
        Sampler
      </div>

      <div className="sampler-node__status-row">
        <span className={`sampler-node__status ${hasSample ? 'sampler-node__status--loaded' : ''}`}>
          {hasSample ? 'Loaded' : 'Empty'}
        </span>
        <span className="sampler-node__filename" title={sampleName}>{sampleName}</span>
      </div>

      <p className="sampler-node__description">
        Load a local MP3 or WAV and trigger it directly from the node.
      </p>

      <div className="sampler-node__actions">
        <button type="button" className="sampler-node__button" onClick={() => fileInputRef.current?.click()}>
          Upload
        </button>
        <button
          type="button"
          className="sampler-node__button"
          disabled={!hasSample}
          onClick={() => onDataChange(id, { triggerNonce: triggerNonce + 1 })}
        >
          Play
        </button>
        <button
          type="button"
          className="sampler-node__button"
          disabled={!hasSample}
          onClick={() => onDataChange(id, { stopNonce: stopNonce + 1 })}
        >
          Stop
        </button>
        <button
          type="button"
          className="sampler-node__button sampler-node__button--ghost"
          disabled={!hasSample}
          onClick={() =>
            onDataChange(id, {
              sampleDataUrl: '',
              sampleName: '',
              stopNonce: stopNonce + 1,
            })
          }
        >
          Clear
        </button>
      </div>

      <div className="sampler-node__grid">
        <Knob
          label="Gain"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={(value) => onDataChange(id, { gain: value })}
          color="#fbbf24"
          unit=""
          size={52}
        />
        <Knob
          label="Rate"
          min={0.25}
          max={2}
          step={0.01}
          value={playbackRate}
          onChange={(value) => onDataChange(id, { playbackRate: value })}
          color="#fbbf24"
          unit="x"
          size={52}
        />
        <button
          type="button"
          className={`sampler-node__loop ${loop ? 'sampler-node__loop--active' : ''}`}
          onClick={() => onDataChange(id, { loop: !loop })}
        >
          {loop ? 'Loop On' : 'Loop Off'}
        </button>
      </div>

      <div className="node-chrome__footer">
        <span className="node-chrome__footer-label">File Player</span>
        <Handle type="source" position={Position.Right} className="node-handle--source node-handle--source-amber" />
      </div>
    </div>
  );
};

export default SamplerNode;