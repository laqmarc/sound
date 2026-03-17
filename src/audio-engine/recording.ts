import { getAudioContext, getDestinationOutput } from './runtime';

interface RecordingState {
  isRecording: boolean;
  durationMs: number;
  totalFrames: number;
  sampleRate: number;
}

interface RecordingExport {
  blob: Blob;
  durationMs: number;
  fileName: string;
}

export type RecordingChannelMode = 'stereo' | 'mono';

export interface RecordingExportOptions {
  fileNameBase?: string;
  normalize?: boolean;
  channelMode?: RecordingChannelMode;
}

const recordingState: RecordingState = {
  isRecording: false,
  durationMs: 0,
  totalFrames: 0,
  sampleRate: 44100,
};

let recorderNode: ScriptProcessorNode | null = null;
let recorderSink: GainNode | null = null;
let leftChunks: Float32Array[] = [];
let rightChunks: Float32Array[] = [];
let activeExportOptions: Required<RecordingExportOptions> = {
  fileNameBase: '',
  normalize: false,
  channelMode: 'stereo',
};

const dispatchRecordingState = () => {
  window.dispatchEvent(
    new CustomEvent('recording-state', {
      detail: getRecordingStateSnapshot(),
    }),
  );
};

const duplicateChannelData = (source: Float32Array) => {
  const copy = new Float32Array(source.length);
  copy.set(source);
  return copy;
};

const mergeChunks = (chunks: Float32Array[], totalFrames: number) => {
  const merged = new Float32Array(totalFrames);
  let offset = 0;

  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });

  return merged;
};

const writeString = (view: DataView, offset: number, value: string) => {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
};

const floatTo16BitPcm = (view: DataView, offset: number, input: number) => {
  const sample = Math.max(-1, Math.min(1, input));
  view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
};

const encodeWav = (channels: Float32Array[], sampleRate: number) => {
  const channelCount = Math.max(1, channels.length);
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const frameCount = channels[0]?.length ?? 0;
  const dataLength = frameCount * blockAlign;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      floatTo16BitPcm(view, offset, channels[channelIndex]?.[frameIndex] ?? 0);
      offset += bytesPerSample;
    }
  }

  return buffer;
};

const buildRecordingFileName = (fileNameBase?: string) => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const fallbackName = [
    'quitusbasscaos',
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`,
  ].join('-');
  const sanitizedBase = (fileNameBase ?? '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '');
  const safeName = sanitizedBase || fallbackName;

  return safeName.toLowerCase().endsWith('.wav') ? safeName : `${safeName}.wav`;
};

const getPeakValue = (channels: Float32Array[]) => {
  let peak = 0;

  channels.forEach((channel) => {
    for (let index = 0; index < channel.length; index += 1) {
      const value = Math.abs(channel[index] ?? 0);
      if (value > peak) {
        peak = value;
      }
    }
  });

  return peak;
};

const scaleChannel = (channel: Float32Array, factor: number) => {
  const scaled = new Float32Array(channel.length);
  for (let index = 0; index < channel.length; index += 1) {
    scaled[index] = channel[index] * factor;
  }
  return scaled;
};

const prepareChannelsForExport = (
  left: Float32Array,
  right: Float32Array,
  options: Required<RecordingExportOptions>,
) => {
  const baseChannels =
    options.channelMode === 'mono'
      ? [
          new Float32Array(
            Array.from({ length: left.length }, (_, index) => ((left[index] ?? 0) + (right[index] ?? 0)) * 0.5),
          ),
        ]
      : [left, right];

  if (!options.normalize) {
    return baseChannels;
  }

  const peak = getPeakValue(baseChannels);
  if (peak <= 0.00001) {
    return baseChannels;
  }

  const factor = 0.98 / peak;
  return baseChannels.map((channel) => scaleChannel(channel, factor));
};

const teardownRecorder = () => {
  if (recorderNode) {
    try {
      recorderNode.disconnect();
    } catch {
      // Ignore disconnect errors during teardown.
    }
    recorderNode.onaudioprocess = null;
  }

  if (recorderSink) {
    try {
      recorderSink.disconnect();
    } catch {
      // Ignore disconnect errors during teardown.
    }
  }

  recorderNode = null;
  recorderSink = null;
};

export const getRecordingStateSnapshot = () => ({
  isRecording: recordingState.isRecording,
  durationMs: recordingState.durationMs,
  sampleRate: recordingState.sampleRate,
});

export const startRecordingSession = (options: RecordingExportOptions = {}) => {
  if (recordingState.isRecording) {
    return false;
  }

  const ctx = getAudioContext();
  const destinationOutput = getDestinationOutput();
  const processor = ctx.createScriptProcessor(4096, 2, 2);
  const sink = ctx.createGain();
  sink.gain.setValueAtTime(0, ctx.currentTime);

  leftChunks = [];
  rightChunks = [];
  recordingState.isRecording = true;
  recordingState.durationMs = 0;
  recordingState.totalFrames = 0;
  recordingState.sampleRate = ctx.sampleRate;
  activeExportOptions = {
    fileNameBase: options.fileNameBase?.trim() ?? '',
    normalize: options.normalize ?? false,
    channelMode: options.channelMode ?? 'stereo',
  };

  processor.onaudioprocess = (event) => {
    if (!recordingState.isRecording) {
      return;
    }

    const inputBuffer = event.inputBuffer;
    const left = inputBuffer.getChannelData(0);
    const right =
      inputBuffer.numberOfChannels > 1 ? inputBuffer.getChannelData(1) : inputBuffer.getChannelData(0);

    leftChunks.push(duplicateChannelData(left));
    rightChunks.push(duplicateChannelData(right));

    recordingState.totalFrames += inputBuffer.length;
    recordingState.durationMs = Math.round(
      (recordingState.totalFrames / recordingState.sampleRate) * 1000,
    );

    const outputLeft = event.outputBuffer.getChannelData(0);
    outputLeft.fill(0);

    if (event.outputBuffer.numberOfChannels > 1) {
      const outputRight = event.outputBuffer.getChannelData(1);
      outputRight.fill(0);
    }

    dispatchRecordingState();
  };

  destinationOutput?.connect(processor);
  processor.connect(sink);
  sink.connect(ctx.destination);

  recorderNode = processor;
  recorderSink = sink;
  dispatchRecordingState();

  return true;
};

export const stopRecordingSession = (): RecordingExport | null => {
  if (!recordingState.isRecording) {
    return null;
  }

  recordingState.isRecording = false;
  const durationMs = recordingState.durationMs;
  const sampleRate = recordingState.sampleRate;
  const totalFrames = recordingState.totalFrames;

  teardownRecorder();

  const left = mergeChunks(leftChunks, totalFrames);
  const right = mergeChunks(rightChunks, totalFrames);
  const channels = prepareChannelsForExport(left, right, activeExportOptions);
  const wavBuffer = encodeWav(channels, sampleRate);

  leftChunks = [];
  rightChunks = [];
  recordingState.durationMs = 0;
  recordingState.totalFrames = 0;
  dispatchRecordingState();

  return {
    blob: new Blob([wavBuffer], { type: 'audio/wav' }),
    durationMs,
    fileName: buildRecordingFileName(activeExportOptions.fileNameBase),
  };
};

export const resetRecordingSession = () => {
  recordingState.isRecording = false;
  recordingState.durationMs = 0;
  recordingState.totalFrames = 0;
  leftChunks = [];
  rightChunks = [];
  activeExportOptions = {
    fileNameBase: '',
    normalize: false,
    channelMode: 'stereo',
  };
  teardownRecorder();
  dispatchRecordingState();
};
