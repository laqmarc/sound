import {
  analysers,
  arpeggiatorTargets,
  arpeggiators,
  arp2Targets,
  arp2s,
  audioContext,
  autoFilters,
  autoPans,
  basslines,
  bitcrushers,
  channelStrips,
  cabSims,
  chordGenerators,
  chordSeqs,
  choruses,
  clearNoiseBufferCache,
  clockDividers,
  combFilters,
  comparators,
  compressors,
  cvOffsets,
  dronePads,
  drumMachines,
  drum2s,
  dualOscs,
  envelopeFollowers,
  equalizers,
  mixers,
  reverbs,
  spectralDelays,
  flangers,
  fmSynths,
  foldbacks,
  freezeFxs,
  gateSeqs,
  granulars,
  hiHatSynths,
  humanizers,
  kickSynths,
  lags,
  leadVoices,
  samplers,
  vocoders,
  limiters,
  loopers,
  monoSynths,
  nodeConfigs,
  nodes,
  noiseLayers,
  weirdMachines,
  chaosShrines,
  phasers,
  quantizers,
  randomCvs,
  resonators,
  ringMods,
  sampleHolds,
  saturators,
  setAudioContext,
  snareSynths,
  stereoAnalysers,
  stereoWideners,
  stopSourceNode,
  stutters,
  subOscs,
  tiltEqs,
  transientShapers,
  tremolos,
  triggerDelays,
  vibratos,
  wahs,
} from './runtime';
import { resetRecordingSession } from './recording';

export const destroyNodeById = (id: string) => {
  drumMachines.delete(id);
  drum2s.delete(id);
  arpeggiators.delete(id);
  arpeggiatorTargets.delete(id);
  arpeggiatorTargets.forEach((targets) => targets.delete(id));
  arp2s.delete(id);
  arp2Targets.delete(id);
  arp2Targets.forEach((targets) => targets.delete(id));

  const equalizer = equalizers.get(id);
  if (equalizer) {
    try {
      equalizer.input.disconnect();
      equalizer.output.disconnect();
      equalizer.filters.forEach((filter) => filter.disconnect());
    } catch {
      // Ignore cleanup errors while tearing down the EQ chain.
    }
    equalizers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const channelStrip = channelStrips.get(id);
  if (channelStrip) {
    try {
      channelStrip.input.disconnect();
      channelStrip.highpass.disconnect();
      channelStrip.bands.forEach((band) => band.disconnect());
      channelStrip.lowpass.disconnect();
      channelStrip.gateNode.disconnect();
      channelStrip.compressor.disconnect();
      channelStrip.makeup.disconnect();
      channelStrip.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the channel strip.
    }
    channelStrips.delete(id);
    nodes.delete(`${id}_out`);
  }

  const mixer = mixers.get(id);
  if (mixer) {
    try {
      mixer.channels.forEach((channel) => {
        channel.input.disconnect();
        channel.low.disconnect();
        channel.mid.disconnect();
        channel.high.disconnect();
        channel.gateNode.disconnect();
        channel.compressor.disconnect();
        channel.pan.disconnect();
        channel.gain.disconnect();
        channel.soloGain.disconnect();
        channel.roomSend.disconnect();
        channel.delaySend.disconnect();
        channel.meterAnalyser.disconnect();
      });
      mixer.roomSendBus.disconnect();
      mixer.roomPreDelay.disconnect();
      mixer.roomTone.disconnect();
      mixer.roomConvolver.disconnect();
      mixer.roomReturn.disconnect();
      mixer.delaySendBus.disconnect();
      mixer.delayNode.disconnect();
      mixer.delayTone.disconnect();
      mixer.delayFeedback.disconnect();
      mixer.delayReturn.disconnect();
      mixer.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the mixer chain.
    }
    mixers.delete(id);
    for (let channel = 1; channel <= 8; channel += 1) {
      nodes.delete(`${id}_ch${channel}`);
    }
  }

  const reverb = reverbs.get(id);
  if (reverb) {
    try {
      reverb.input.disconnect();
      reverb.output.disconnect();
      reverb.dry.disconnect();
      reverb.wet.disconnect();
      reverb.preDelay.disconnect();
      reverb.tone.disconnect();
      reverb.convolver.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the reverb chain.
    }
    reverbs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const phaser = phasers.get(id);
  if (phaser) {
    try {
      phaser.input.disconnect();
      phaser.output.disconnect();
      phaser.dry.disconnect();
      phaser.wet.disconnect();
      phaser.feedbackGain.disconnect();
      phaser.filters.forEach((filter) => filter.disconnect());
      phaser.lfo.disconnect();
      phaser.lfoGain.disconnect();
      phaser.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the phaser chain.
    }
    phasers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const compressor = compressors.get(id);
  if (compressor) {
    try {
      compressor.compressor.disconnect();
      compressor.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the compressor chain.
    }
    compressors.delete(id);
    nodes.delete(`${id}_out`);
  }

  const chorus = choruses.get(id);
  if (chorus) {
    try {
      chorus.input.disconnect();
      chorus.output.disconnect();
      chorus.dry.disconnect();
      chorus.wet.disconnect();
      chorus.delay.disconnect();
      chorus.lfo.disconnect();
      chorus.lfoGain.disconnect();
      chorus.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the chorus chain.
    }
    choruses.delete(id);
    nodes.delete(`${id}_out`);
  }

  const bitcrusher = bitcrushers.get(id);
  if (bitcrusher) {
    try {
      bitcrusher.input.disconnect();
      bitcrusher.output.disconnect();
      bitcrusher.dry.disconnect();
      bitcrusher.wet.disconnect();
      bitcrusher.processor.disconnect();
      bitcrusher.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the bitcrusher chain.
    }
    bitcrushers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const flanger = flangers.get(id);
  if (flanger) {
    try {
      flanger.input.disconnect();
      flanger.output.disconnect();
      flanger.dry.disconnect();
      flanger.wet.disconnect();
      flanger.delay.disconnect();
      flanger.feedbackGain.disconnect();
      flanger.lfo.disconnect();
      flanger.lfoGain.disconnect();
      flanger.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the flanger chain.
    }
    flangers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const limiter = limiters.get(id);
  if (limiter) {
    try {
      limiter.compressor.disconnect();
      limiter.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the limiter chain.
    }
    limiters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const looper = loopers.get(id);
  if (looper) {
    try {
      looper.input.disconnect();
      looper.output.disconnect();
      looper.dry.disconnect();
      looper.wet.disconnect();
      looper.processor.disconnect();
      looper.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the looper chain.
    }
    loopers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const fmSynth = fmSynths.get(id);
  if (fmSynth) {
    try {
      fmSynth.carrier.disconnect();
      fmSynth.modulator.disconnect();
      fmSynth.modGain.disconnect();
      fmSynth.output.disconnect();
      fmSynth.modulator.stop();
    } catch {
      // Ignore cleanup errors while tearing down the FM synth.
    }
    fmSynths.delete(id);
    nodes.delete(`${id}_out`);
  }

  const subOsc = subOscs.get(id);
  if (subOsc) {
    try {
      subOsc.oscillator.disconnect();
      subOsc.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the sub oscillator.
    }
    subOscs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const noiseLayer = noiseLayers.get(id);
  if (noiseLayer) {
    try {
      noiseLayer.source.disconnect();
      noiseLayer.filter.disconnect();
      noiseLayer.output.disconnect();
      noiseLayer.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the noise layer.
    }
    noiseLayers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const weirdMachine = weirdMachines.get(id);
  if (weirdMachine) {
    try {
      weirdMachine.carrier.disconnect();
      weirdMachine.harmonic.disconnect();
      weirdMachine.modulator.disconnect();
      weirdMachine.noiseSource.disconnect();
      weirdMachine.noiseGain.disconnect();
      weirdMachine.harmonicGain.disconnect();
      weirdMachine.modGain.disconnect();
      weirdMachine.wobbleLfo.disconnect();
      weirdMachine.wobbleGain.disconnect();
      weirdMachine.filter.disconnect();
      weirdMachine.shaper.disconnect();
      weirdMachine.output.disconnect();
      weirdMachine.carrier.stop();
      weirdMachine.harmonic.stop();
      weirdMachine.modulator.stop();
      weirdMachine.wobbleLfo.stop();
      weirdMachine.noiseSource.stop();
    } catch {
      // Ignore cleanup errors while tearing down the weird machine.
    }
    weirdMachines.delete(id);
    nodes.delete(`${id}_out`);
  }

  const chaosShrine = chaosShrines.get(id);
  if (chaosShrine) {
    try {
      chaosShrine.carrier.disconnect();
      chaosShrine.sub.disconnect();
      chaosShrine.shimmer.disconnect();
      chaosShrine.modulator.disconnect();
      chaosShrine.fmGain.disconnect();
      chaosShrine.motionLfo.disconnect();
      chaosShrine.motionDepth.disconnect();
      chaosShrine.motionBias.disconnect();
      chaosShrine.motionVca.disconnect();
      chaosShrine.noiseSource.disconnect();
      chaosShrine.noiseGain.disconnect();
      chaosShrine.carrierGain.disconnect();
      chaosShrine.subGain.disconnect();
      chaosShrine.shimmerGain.disconnect();
      chaosShrine.filter.disconnect();
      chaosShrine.colorFilter.disconnect();
      chaosShrine.shaper.disconnect();
      chaosShrine.leftDelay.disconnect();
      chaosShrine.rightDelay.disconnect();
      chaosShrine.leftPan.disconnect();
      chaosShrine.rightPan.disconnect();
      chaosShrine.output.disconnect();
      chaosShrine.carrier.stop();
      chaosShrine.sub.stop();
      chaosShrine.shimmer.stop();
      chaosShrine.modulator.stop();
      chaosShrine.motionLfo.stop();
      chaosShrine.motionBias.stop();
      chaosShrine.noiseSource.stop();
    } catch {
      // Ignore cleanup errors while tearing down the chaos shrine.
    }
    chaosShrines.delete(id);
    nodes.delete(`${id}_out`);
  }

  const tremolo = tremolos.get(id);
  if (tremolo) {
    try {
      tremolo.input.disconnect();
      tremolo.output.disconnect();
      tremolo.wet.disconnect();
      tremolo.dry.disconnect();
      tremolo.lfo.disconnect();
      tremolo.lfoDepth.disconnect();
      tremolo.lfoOffset.disconnect();
      tremolo.lfo.stop();
      tremolo.lfoOffset.stop();
    } catch {
      // Ignore cleanup errors while tearing down the tremolo chain.
    }
    tremolos.delete(id);
    nodes.delete(`${id}_out`);
  }

  const ringMod = ringMods.get(id);
  if (ringMod) {
    try {
      ringMod.input.disconnect();
      ringMod.output.disconnect();
      ringMod.wet.disconnect();
      ringMod.dry.disconnect();
      ringMod.modulator.disconnect();
      ringMod.modDepth.disconnect();
      ringMod.modOffset.disconnect();
      ringMod.modulator.stop();
      ringMod.modOffset.stop();
    } catch {
      // Ignore cleanup errors while tearing down the ring mod chain.
    }
    ringMods.delete(id);
    nodes.delete(`${id}_out`);
  }

  const vibrato = vibratos.get(id);
  if (vibrato) {
    try {
      vibrato.input.disconnect();
      vibrato.output.disconnect();
      vibrato.wet.disconnect();
      vibrato.dry.disconnect();
      vibrato.delay.disconnect();
      vibrato.lfo.disconnect();
      vibrato.lfoDepth.disconnect();
      vibrato.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the vibrato chain.
    }
    vibratos.delete(id);
    nodes.delete(`${id}_out`);
  }

  const combFilter = combFilters.get(id);
  if (combFilter) {
    try {
      combFilter.input.disconnect();
      combFilter.output.disconnect();
      combFilter.wet.disconnect();
      combFilter.dry.disconnect();
      combFilter.delay.disconnect();
      combFilter.feedbackGain.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the comb filter chain.
    }
    combFilters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const dualOsc = dualOscs.get(id);
  if (dualOsc) {
    try {
      dualOsc.oscA.disconnect();
      dualOsc.oscB.disconnect();
      dualOsc.mixA.disconnect();
      dualOsc.mixB.disconnect();
      dualOsc.output.disconnect();
      dualOsc.oscA.stop();
      dualOsc.oscB.stop();
    } catch {
      // Ignore cleanup errors while tearing down the dual oscillator.
    }
    dualOscs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const dronePad = dronePads.get(id);
  if (dronePad) {
    try {
      dronePad.oscillators.forEach((oscillator) => {
        oscillator.disconnect();
        oscillator.stop();
      });
      dronePad.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the drone pad.
    }
    dronePads.delete(id);
    nodes.delete(`${id}_out`);
  }

  basslines.delete(id);

  const leadVoice = leadVoices.get(id);
  if (leadVoice) {
    try {
      leadVoice.oscillator.disconnect();
      leadVoice.filter.disconnect();
      leadVoice.output.disconnect();
      leadVoice.oscillator.stop();
    } catch {
      // Ignore cleanup errors while tearing down the lead voice.
    }
    leadVoices.delete(id);
    nodes.delete(`${id}_out`);
  }

  const sampler = samplers.get(id);
  if (sampler) {
    try {
      sampler.mediaElement?.pause();
      if (sampler.mediaElement) {
        sampler.mediaElement.currentTime = 0;
        sampler.mediaElement.removeAttribute('src');
        sampler.mediaElement.load();
      }
      sampler.sourceNode?.disconnect();
      sampler.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the sampler.
    }
    samplers.delete(id);
  }

  const vocoder = vocoders.get(id);
  if (vocoder) {
    try {
      vocoder.mediaStreamNode?.disconnect();
      vocoder.mediaStream?.getTracks().forEach((track) => track.stop());
      vocoder.carrierInput.disconnect();
      vocoder.modulatorInput.disconnect();
      vocoder.modulatorHighpass.disconnect();
      vocoder.modulatorPresence.disconnect();
      vocoder.modulatorCompressor.disconnect();
      vocoder.carrierTone.disconnect();
      vocoder.noiseSource.disconnect();
      vocoder.noiseSource.stop();
      vocoder.noiseFilter.disconnect();
      vocoder.noiseGain.disconnect();
      vocoder.noiseDetector.disconnect();
      vocoder.noiseEnvelopeSource.disconnect();
      vocoder.noiseEnvelopeSource.stop();
      vocoder.noiseEnvelopeAmount.disconnect();
      vocoder.noiseProcessor.disconnect();
      vocoder.noiseProcessor.onaudioprocess = null;
      vocoder.noiseMonitor.disconnect();
      vocoder.speechAssistHighpass.disconnect();
      vocoder.speechAssistLowpass.disconnect();
      vocoder.speechAssistGain.disconnect();
      vocoder.bands.forEach((band) => {
        band.modFilter.disconnect();
        band.carrierFilter.disconnect();
        band.bandGain.disconnect();
        band.envelopeSource.disconnect();
        band.envelopeAmount.disconnect();
        band.envelopeSource.stop();
        band.processor.disconnect();
        band.processor.onaudioprocess = null;
        band.monitor.disconnect();
      });
      vocoder.dry.disconnect();
      vocoder.wet.disconnect();
      vocoder.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the vocoder.
    }
    vocoders.delete(id);
    nodes.delete(`${id}_carrier`);
    nodes.delete(`${id}_out`);
  }

  const autoPan = autoPans.get(id);
  if (autoPan) {
    try {
      autoPan.input.disconnect();
      autoPan.output.disconnect();
      autoPan.dry.disconnect();
      autoPan.wet.disconnect();
      autoPan.panner.disconnect();
      autoPan.lfo.disconnect();
      autoPan.lfoGain.disconnect();
      autoPan.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the auto-pan chain.
    }
    autoPans.delete(id);
    nodes.delete(`${id}_out`);
  }

  const autoFilter = autoFilters.get(id);
  if (autoFilter) {
    try {
      autoFilter.input.disconnect();
      autoFilter.output.disconnect();
      autoFilter.dry.disconnect();
      autoFilter.wet.disconnect();
      autoFilter.filter.disconnect();
      autoFilter.lfo.disconnect();
      autoFilter.lfoGain.disconnect();
      autoFilter.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the auto filter chain.
    }
    autoFilters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const clockDivider = clockDividers.get(id);
  if (clockDivider) {
    try {
      clockDivider.source.disconnect();
      clockDivider.output.disconnect();
      clockDivider.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the clock divider.
    }
    clockDividers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const randomCv = randomCvs.get(id);
  if (randomCv) {
    try {
      randomCv.source.disconnect();
      randomCv.output.disconnect();
      randomCv.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the random CV source.
    }
    randomCvs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const sampleHold = sampleHolds.get(id);
  if (sampleHold) {
    try {
      sampleHold.input.disconnect();
      sampleHold.output.disconnect();
      sampleHold.dry.disconnect();
      sampleHold.wet.disconnect();
      sampleHold.processor.disconnect();
      sampleHold.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the sample and hold effect.
    }
    sampleHolds.delete(id);
    nodes.delete(`${id}_out`);
  }

  const gateSeq = gateSeqs.get(id);
  if (gateSeq) {
    try {
      gateSeq.input.disconnect();
      gateSeq.output.disconnect();
      gateSeq.gate.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the gate sequencer.
    }
    gateSeqs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const cvOffset = cvOffsets.get(id);
  if (cvOffset) {
    try {
      cvOffset.source.disconnect();
      cvOffset.scaler.disconnect();
      cvOffset.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the CV offset.
    }
    cvOffsets.delete(id);
    nodes.delete(`${id}_out`);
  }

  const envelopeFollower = envelopeFollowers.get(id);
  if (envelopeFollower) {
    try {
      envelopeFollower.input.disconnect();
      envelopeFollower.analyser.disconnect();
      envelopeFollower.analyser.onaudioprocess = null;
      envelopeFollower.source.disconnect();
      envelopeFollower.scaler.disconnect();
      envelopeFollower.source.stop();
    } catch {
      // Ignore cleanup errors while tearing down the envelope follower.
    }
    envelopeFollowers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const quantizer = quantizers.get(id);
  if (quantizer) {
    try {
      quantizer.input.disconnect();
      quantizer.output.disconnect();
      quantizer.dry.disconnect();
      quantizer.wet.disconnect();
      quantizer.processor.disconnect();
      quantizer.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the quantizer.
    }
    quantizers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const comparator = comparators.get(id);
  if (comparator) {
    try {
      comparator.input.disconnect();
      comparator.processor.disconnect();
      comparator.processor.onaudioprocess = null;
      comparator.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the comparator.
    }
    comparators.delete(id);
    nodes.delete(`${id}_out`);
  }

  const lag = lags.get(id);
  if (lag) {
    try {
      lag.input.disconnect();
      lag.output.disconnect();
      lag.dry.disconnect();
      lag.wet.disconnect();
      lag.processor.disconnect();
      lag.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the lag processor.
    }
    lags.delete(id);
    nodes.delete(`${id}_out`);
  }

  chordSeqs.delete(id);

  const resonator = resonators.get(id);
  if (resonator) {
    try {
      resonator.input.disconnect();
      resonator.output.disconnect();
      resonator.dry.disconnect();
      resonator.wet.disconnect();
      resonator.filters.forEach((filter) => filter.disconnect());
    } catch {
      // Ignore cleanup errors while tearing down the resonator chain.
    }
    resonators.delete(id);
    nodes.delete(`${id}_out`);
  }

  const wah = wahs.get(id);
  if (wah) {
    try {
      wah.input.disconnect();
      wah.output.disconnect();
      wah.dry.disconnect();
      wah.wet.disconnect();
      wah.filter.disconnect();
      wah.lfo.disconnect();
      wah.lfoGain.disconnect();
      wah.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the wah chain.
    }
    wahs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const stereoWidener = stereoWideners.get(id);
  if (stereoWidener) {
    try {
      stereoWidener.input.disconnect();
      stereoWidener.output.disconnect();
      stereoWidener.dry.disconnect();
      stereoWidener.wet.disconnect();
      stereoWidener.merger.disconnect();
      stereoWidener.delayLeft.disconnect();
      stereoWidener.delayRight.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the stereo widener chain.
    }
    stereoWideners.delete(id);
    nodes.delete(`${id}_out`);
  }

  const foldback = foldbacks.get(id);
  if (foldback) {
    try {
      foldback.input.disconnect();
      foldback.output.disconnect();
      foldback.dry.disconnect();
      foldback.wet.disconnect();
      foldback.shaper.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the foldback chain.
    }
    foldbacks.delete(id);
    nodes.delete(`${id}_out`);
  }

  const tiltEq = tiltEqs.get(id);
  if (tiltEq) {
    try {
      tiltEq.input.disconnect();
      tiltEq.output.disconnect();
      tiltEq.dry.disconnect();
      tiltEq.wet.disconnect();
      tiltEq.lowShelf.disconnect();
      tiltEq.highShelf.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the tilt EQ chain.
    }
    tiltEqs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const saturator = saturators.get(id);
  if (saturator) {
    try {
      saturator.input.disconnect();
      saturator.output.disconnect();
      saturator.dry.disconnect();
      saturator.wet.disconnect();
      saturator.shaper.disconnect();
      saturator.makeup.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the saturator chain.
    }
    saturators.delete(id);
    nodes.delete(`${id}_out`);
  }

  const cabSim = cabSims.get(id);
  if (cabSim) {
    try {
      cabSim.input.disconnect();
      cabSim.output.disconnect();
      cabSim.dry.disconnect();
      cabSim.wet.disconnect();
      cabSim.highpass.disconnect();
      cabSim.peak.disconnect();
      cabSim.lowpass.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the cab sim chain.
    }
    cabSims.delete(id);
    nodes.delete(`${id}_out`);
  }

  const transientShaper = transientShapers.get(id);
  if (transientShaper) {
    try {
      transientShaper.input.disconnect();
      transientShaper.output.disconnect();
      transientShaper.dry.disconnect();
      transientShaper.wet.disconnect();
      transientShaper.processor.disconnect();
      transientShaper.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the transient shaper.
    }
    transientShapers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const freezeFx = freezeFxs.get(id);
  if (freezeFx) {
    try {
      freezeFx.input.disconnect();
      freezeFx.output.disconnect();
      freezeFx.dry.disconnect();
      freezeFx.wet.disconnect();
      freezeFx.processor.disconnect();
      freezeFx.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the freeze effect.
    }
    freezeFxs.delete(id);
    nodes.delete(`${id}_out`);
  }

  const granular = granulars.get(id);
  if (granular) {
    try {
      granular.input.disconnect();
      granular.output.disconnect();
      granular.dry.disconnect();
      granular.wet.disconnect();
      granular.processor.disconnect();
      granular.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the granular effect.
    }
    granulars.delete(id);
    nodes.delete(`${id}_out`);
  }

  const stutter = stutters.get(id);
  if (stutter) {
    try {
      stutter.input.disconnect();
      stutter.output.disconnect();
      stutter.dry.disconnect();
      stutter.wet.disconnect();
      stutter.processor.disconnect();
      stutter.processor.onaudioprocess = null;
    } catch {
      // Ignore cleanup errors while tearing down the stutter effect.
    }
    stutters.delete(id);
    nodes.delete(`${id}_out`);
  }

  const humanizer = humanizers.get(id);
  if (humanizer) {
    try {
      humanizer.input.disconnect();
      humanizer.output.disconnect();
      humanizer.dry.disconnect();
      humanizer.wet.disconnect();
      humanizer.delay.disconnect();
      humanizer.lfo.disconnect();
      humanizer.lfoGain.disconnect();
      humanizer.lfo.stop();
    } catch {
      // Ignore cleanup errors while tearing down the humanizer.
    }
    humanizers.delete(id);
    nodes.delete(`${id}_out`);
  }

  const triggerDelay = triggerDelays.get(id);
  if (triggerDelay) {
    try {
      triggerDelay.input.disconnect();
      triggerDelay.output.disconnect();
      triggerDelay.dry.disconnect();
      triggerDelay.wet.disconnect();
      triggerDelay.delay.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the trigger delay.
    }
    triggerDelays.delete(id);
    nodes.delete(`${id}_out`);
  }

  const monoSynth = monoSynths.get(id);
  if (monoSynth) {
    try {
      monoSynth.oscillator.disconnect();
      monoSynth.filter.disconnect();
      monoSynth.output.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the mono synth.
    }
    monoSynths.delete(id);
    nodes.delete(`${id}_out`);
  }

  kickSynths.delete(id);
  snareSynths.delete(id);
  hiHatSynths.delete(id);

  const chordGenerator = chordGenerators.get(id);
  if (chordGenerator) {
    try {
      chordGenerator.oscillators.forEach((oscillator) => oscillator.disconnect());
      chordGenerator.output.disconnect();
      chordGenerator.oscillators.forEach((oscillator) => oscillator.stop());
    } catch {
      // Ignore cleanup errors while tearing down the chord generator.
    }
    chordGenerators.delete(id);
  }

  const stereoAnalyser = stereoAnalysers.get(id);
  if (stereoAnalyser) {
    try {
      stereoAnalyser.input.disconnect();
      stereoAnalyser.output.disconnect();
      stereoAnalyser.splitter.disconnect();
      stereoAnalyser.left.disconnect();
      stereoAnalyser.right.disconnect();
    } catch {
      // Ignore cleanup errors while tearing down the stereo analyser monitor.
    }
    stereoAnalysers.delete(id);
    nodes.delete(`${id}_out`);
  }

  nodeConfigs.delete(id);

  const node = nodes.get(id);
  if (!node) {
    return;
  }

  stopSourceNode(node);

  try {
    node.disconnect();
  } catch {
    // Ignore disconnect errors for nodes that are already detached.
  }

  nodes.delete(id);
  analysers.delete(id);
};

export const clearAudioEngineStores = () => {
  analysers.clear();
  drumMachines.clear();
  drum2s.clear();
  arpeggiators.clear();
  arpeggiatorTargets.clear();
  arp2s.clear();
  arp2Targets.clear();
  equalizers.clear();
  channelStrips.clear();
  mixers.clear();
  reverbs.clear();
  spectralDelays.clear();
  phasers.clear();
  compressors.clear();
  choruses.clear();
  bitcrushers.clear();
  flangers.clear();
  limiters.clear();
  loopers.clear();
  fmSynths.clear();
  subOscs.clear();
  noiseLayers.clear();
  weirdMachines.clear();
  chaosShrines.clear();
  tremolos.clear();
  ringMods.clear();
  vibratos.clear();
  combFilters.clear();
  dualOscs.clear();
  dronePads.clear();
  basslines.clear();
  leadVoices.clear();
  samplers.clear();
  vocoders.clear();
  autoPans.clear();
  autoFilters.clear();
  clockDividers.clear();
  randomCvs.clear();
  sampleHolds.clear();
  gateSeqs.clear();
  cvOffsets.clear();
  envelopeFollowers.clear();
  quantizers.clear();
  comparators.clear();
  lags.clear();
  chordSeqs.clear();
  resonators.clear();
  wahs.clear();
  stereoWideners.clear();
  foldbacks.clear();
  tiltEqs.clear();
  saturators.clear();
  cabSims.clear();
  transientShapers.clear();
  freezeFxs.clear();
  granulars.clear();
  stutters.clear();
  humanizers.clear();
  triggerDelays.clear();
  monoSynths.clear();
  kickSynths.clear();
  snareSynths.clear();
  hiHatSynths.clear();
  chordGenerators.clear();
  stereoAnalysers.clear();
  nodeConfigs.clear();
  clearNoiseBufferCache();
};

export const resetAudioEngineRuntime = async () => {
  const ids = Array.from(nodes.keys());
  ids.forEach(destroyNodeById);
  clearAudioEngineStores();
  resetRecordingSession();

  const ctx = audioContext;
  setAudioContext(null);

  if (ctx) {
    await ctx.close();
  }
};

export const removeNodeArtifacts = (id: string) => {
  destroyNodeById(id);
  destroyNodeById(`${id}_gain`);

  for (let channel = 1; channel <= 8; channel += 1) {
    destroyNodeById(`${id}_ch${channel}`);
  }
};
