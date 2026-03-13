let audioContext: AudioContext | null = null;

const nodes = new Map<string, AudioNode>();
const analysers = new Map<string, AnalyserNode>();

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('AudioContext created:', audioContext.state);
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext resumed');
    });
  }
  return audioContext;
};

export const createOscillator = (id: string) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.start();
  nodes.set(id, osc);
  return osc;
};

export const createGain = (id: string) => {
  const ctx = getAudioContext();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  nodes.set(id, gain);
  return gain;
};

export const createFilter = (id: string) => {
  const ctx = getAudioContext();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.Q.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, filter);
  return filter;
};

export const createDelay = (id: string) => {
  const ctx = getAudioContext();
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.3, ctx.currentTime);
  nodes.set(id, delay);
  return delay;
};

export const createNoise = (id: string) => {
  const ctx = getAudioContext();
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  whiteNoise.start();
  nodes.set(id, whiteNoise);
  return whiteNoise;
};

export const createDistortion = (id: string) => {
  const ctx = getAudioContext();
  const distortion = ctx.createWaveShaper();
  
  const makeDistortionCurve = (amount: number) => {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = '4x';
  nodes.set(id, distortion);
  return distortion;
};

export const createReverb = (id: string) => {
  const ctx = getAudioContext();
  const convolver = ctx.createConvolver();
  
  const generateImpulseResponse = (duration: number, decay: number) => {
    const length = ctx.sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    
    for (let i = 0; i < length; i++) {
      const n = i / length;
      const d = Math.pow(1 - n, decay);
      left[i] = (Math.random() * 2 - 1) * d;
      right[i] = (Math.random() * 2 - 1) * d;
    }
    return impulse;
  };

  convolver.buffer = generateImpulseResponse(2, 3);
  nodes.set(id, convolver);
  return convolver;
};

export const createMixer = (id: string) => {
  const ctx = getAudioContext();
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(1, ctx.currentTime);
  nodes.set(id, mainGain);

  // Creem 4 canals d'entrada independents
  for (let i = 1; i <= 4; i++) {
    const chGain = ctx.createGain();
    chGain.gain.setValueAtTime(0.5, ctx.currentTime);
    chGain.connect(mainGain);
    nodes.set(`${id}_ch${i}`, chGain);
  }

  return mainGain;
};

export const createAnalyser = (id: string) => {
  const ctx = getAudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  nodes.set(id, analyser);
  analysers.set(id, analyser);
  return analyser;
};

export const createPanner = (id: string) => {
  const ctx = getAudioContext();
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(0, ctx.currentTime);
  nodes.set(id, panner);
  return panner;
};

export const createLFO = (id: string) => {
  const ctx = getAudioContext();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  
  lfo.frequency.setValueAtTime(1, ctx.currentTime);
  lfoGain.gain.setValueAtTime(100, ctx.currentTime); // Amplitud de la modulació
  
  lfo.connect(lfoGain);
  lfo.start();
  
  nodes.set(id, lfo);
  nodes.set(`${id}_gain`, lfoGain);
  return lfo;
};

export const getAnalyser = (id: string) => {
  return analysers.get(id);
};

export const getDestination = () => {
  return getAudioContext().destination;
};

export const connectNodes = (sourceId: string, targetId: string, targetHandleId?: string | null) => {
  const source = nodes.get(sourceId);
  const ctx = getAudioContext();
  
  // Si l'origen és un LFO, connectem la seva sortida de guany (modulació)
  const realSource = nodes.has(`${sourceId}_gain`) ? nodes.get(`${sourceId}_gain`) : source;
  
  let target: AudioNode | AudioParam | undefined | AudioDestinationNode;
  
  if (targetId === 'destination') {
    target = ctx.destination;
  } else if (targetHandleId && targetHandleId.startsWith('ch')) {
    target = nodes.get(`${targetId}_${targetHandleId}`);
  } else if (targetHandleId === 'mod') {
    // Connexió de modulació especial
    const targetNode = nodes.get(targetId);
    if (targetNode instanceof OscillatorNode || targetNode instanceof BiquadFilterNode) {
      target = targetNode.frequency;
    } else if (targetNode instanceof GainNode) {
      target = targetNode.gain;
    } else if (targetNode instanceof StereoPannerNode) {
      target = targetNode.pan;
    }
  } else {
    target = nodes.get(targetId);
  }

  if (realSource) {
    if (target instanceof AudioNode) {
      realSource.connect(target);
    } else if (target instanceof AudioParam) {
      realSource.connect(target);
    }
  }
};

export const disconnectNodes = (sourceId: string, targetId: string, targetHandleId?: string | null) => {
  const source = nodes.get(sourceId);
  const ctx = getAudioContext();
  
  const realSource = nodes.has(`${sourceId}_gain`) ? nodes.get(`${sourceId}_gain`) : source;
  
  let target: AudioNode | AudioParam | undefined | AudioDestinationNode;
  
  if (targetId === 'destination') {
    target = ctx.destination;
  } else if (targetHandleId && targetHandleId.startsWith('ch')) {
    target = nodes.get(`${targetId}_${targetHandleId}`);
  } else if (targetHandleId === 'mod') {
    const targetNode = nodes.get(targetId);
    if (targetNode instanceof OscillatorNode || targetNode instanceof BiquadFilterNode) {
      target = targetNode.frequency;
    } else if (targetNode instanceof GainNode) {
      target = targetNode.gain;
    } else if (targetNode instanceof StereoPannerNode) {
      target = targetNode.pan;
    }
  } else {
    target = nodes.get(targetId);
  }

  if (realSource) {
    if (target instanceof AudioNode) {
      realSource.disconnect(target);
    } else if (target instanceof AudioParam) {
      realSource.disconnect(target);
    }
  }
};

export const updateNodeParam = (id: string, param: string, value: any) => {
  const node = nodes.get(id);
  if (!node) return;

  const ctx = getAudioContext();

  if (node instanceof OscillatorNode) {
    if (param === 'frequency' && typeof value === 'number' && isFinite(value)) {
      node.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      node.type = value;
    }
  } else if (node instanceof GainNode) {
    if (param === 'gain' && typeof value === 'number' && isFinite(value)) {
      node.gain.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
  } else if (node instanceof BiquadFilterNode) {
    if (param === 'frequency' && typeof value === 'number' && isFinite(value)) {
      node.frequency.setTargetAtTime(value, ctx.currentTime, 0.03);
    } else if (param === 'type') {
      node.type = value;
    } else if (param === 'Q' && typeof value === 'number' && isFinite(value)) {
      node.Q.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
  } else if (node instanceof DelayNode) {
    if (param === 'delayTime' && typeof value === 'number' && isFinite(value)) {
      node.delayTime.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
  } else if (node instanceof WaveShaperNode) {
    if (param === 'distortion') {
      const makeDistortionCurve = (amount: number) => {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      };
      node.curve = makeDistortionCurve(value);
    }
  } else if (node instanceof ConvolverNode) {
    if (param === 'decay') {
      const generateImpulseResponse = (duration: number, decay: number) => {
        const length = ctx.sampleRate * duration;
        const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        for (let i = 0; i < length; i++) {
          const n = i / length;
          const d = Math.pow(1 - n, decay);
          left[i] = (Math.random() * 2 - 1) * d;
          right[i] = (Math.random() * 2 - 1) * d;
        }
        return impulse;
      };
      node.buffer = generateImpulseResponse(2, value);
    }
  } else if (node instanceof StereoPannerNode) {
    if (param === 'pan' && typeof value === 'number' && isFinite(value)) {
      node.pan.setTargetAtTime(value, ctx.currentTime, 0.03);
    }
  }
};

export const stopAudio = () => {
  if (audioContext) {
    audioContext.suspend().then(() => {
      console.log('Audio suspended');
    });
  }
};

export const removeNode = (id: string) => {
  const node = nodes.get(id);
  if (node) {
    node.disconnect();
    nodes.delete(id);
    
    // Si és un mixer, hem d'eliminar també els seus canals
    for (let i = 1; i <= 4; i++) {
      const chId = `${id}_ch${i}`;
      const chNode = nodes.get(chId);
      if (chNode) {
        chNode.disconnect();
        nodes.delete(chId);
      }
    }
    
    console.log('Node removed:', id);
  }
};
