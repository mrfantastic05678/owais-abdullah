/**
 * PCM AudioWorkletProcessor
 * Captures microphone audio at system native sample rate (44.1kHz or 48kHz),
 * resamples down to 16kHz mono linear PCM 16-bit, and posts chunks to the main thread.
 */
class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    // Chunk size: 512 samples at 16kHz = 32ms (optimal low-latency frame for Gemini Live)
    this.chunkSize = 512;
    this.buffer = new Int16Array(this.chunkSize);
    this.bufferIndex = 0;
    this.resampleRatio = sampleRate / this.targetSampleRate;
    this.fractionalOffset = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) {
      return true;
    }

    const channelData = input[0];
    const inputLength = channelData.length;

    // Resample from native sampleRate to 16000Hz using linear interpolation
    while (this.fractionalOffset < inputLength) {
      const index0 = Math.floor(this.fractionalOffset);
      const index1 = Math.min(index0 + 1, inputLength - 1);
      const t = this.fractionalOffset - index0;

      const s0 = channelData[index0];
      const s1 = channelData[index1];
      const sample = s0 + t * (s1 - s0);

      // Clamp to [-1.0, 1.0] and convert to 16-bit signed integer
      const clamped = Math.max(-1, Math.min(1, sample));
      const pcm16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;

      this.buffer[this.bufferIndex++] = Math.round(pcm16);

      // When the chunk is filled (32ms buffer), post to main thread
      if (this.bufferIndex >= this.chunkSize) {
        // Send a copy of the buffer so we can keep writing
        const chunkToSend = new Int16Array(this.buffer);
        this.port.postMessage(chunkToSend.buffer, [chunkToSend.buffer]);
        this.bufferIndex = 0;
      }

      this.fractionalOffset += this.resampleRatio;
    }

    this.fractionalOffset -= inputLength;
    return true;
  }
}

registerProcessor("pcm-processor", PcmProcessor);
