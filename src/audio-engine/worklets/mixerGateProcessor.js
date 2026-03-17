class MixerGateProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'threshold',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: 'k-rate',
      },
    ];
  }

  constructor() {
    super();
    this.currentGain = 1;
    this.reportCounter = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const outputLeft = output[0];
    const outputRight = output[1];

    if (!outputLeft) {
      return true;
    }

    const inputLeft = input[0];
    const inputRight = input[1] ?? inputLeft;
    const thresholdValues = parameters.threshold;
    let currentGain = this.currentGain;

    if (!inputLeft) {
      outputLeft.fill(0);
      outputRight?.fill(0);
      this.currentGain = currentGain;
      return true;
    }

    for (let sampleIndex = 0; sampleIndex < inputLeft.length; sampleIndex += 1) {
      const threshold = thresholdValues.length === 1
        ? thresholdValues[0]
        : thresholdValues[sampleIndex];
      const sourceLeft = inputLeft[sampleIndex];
      const sourceRight = inputRight ? inputRight[sampleIndex] : sourceLeft;

      if (threshold <= 0.000001) {
        currentGain = 1;
      } else {
        const level = Math.max(Math.abs(sourceLeft), Math.abs(sourceRight));
        const targetGain = level >= threshold ? 1 : 0;
        const smoothing = targetGain > currentGain ? 0.34 : 0.018;
        currentGain += (targetGain - currentGain) * smoothing;
      }

      outputLeft[sampleIndex] = sourceLeft * currentGain;
      if (outputRight) {
        outputRight[sampleIndex] = sourceRight * currentGain;
      }
    }

    this.currentGain = currentGain;
    this.reportCounter += 1;
    if (this.reportCounter >= 6) {
      this.port.postMessage({ currentGain });
      this.reportCounter = 0;
    }
    return true;
  }
}

registerProcessor('mixer-gate-processor', MixerGateProcessor);
