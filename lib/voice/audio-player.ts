/**
 * 24kHz Web Audio Player with Gapless Buffering & Instant Barge-in Interruption.
 * Converts Gemini Live 24kHz PCM16 audio chunks into continuous smooth playback.
 */

export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private nextStartTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isMuted: boolean = false;
  private sampleRate: number = 24000;

  constructor(sampleRate: number = 24000) {
    this.sampleRate = sampleRate;
  }

  /**
   * Must be called or resumed on user gesture (e.g. mic click)
   */
  async ensureAudioContext(): Promise<AudioContext> {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: this.sampleRate });
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    // Play 1ms silence buffer to unlock iOS Safari audio pipeline
    try {
      const silence = this.audioCtx.createBuffer(1, 1, this.sampleRate);
      const src = this.audioCtx.createBufferSource();
      src.buffer = silence;
      src.connect(this.audioCtx.destination);
      src.start();
    } catch {
      // Ignore if silent buffer fails
    }

    return this.audioCtx;
  }

  /**
   * Decodes Base64 PCM16 chunk from Gemini and schedules gapless playback
   */
  async playChunk(base64Pcm16: string) {
    if (this.isMuted) return;

    try {
      await this.ensureAudioContext();
      if (!this.audioCtx || !this.analyser) return;

      // Convert Base64 to ArrayBuffer
      const binaryString = window.atob(base64Pcm16);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert Int16 linear PCM to Float32 [-1.0, 1.0]
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      // Create audio buffer at 24kHz
      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyser);

      // Gapless scheduling
      const currentTime = this.audioCtx.currentTime;
      const startTime = Math.max(currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);

      // Clean up finished sources from tracking array
      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index > -1) {
          this.activeSources.splice(index, 1);
        }
      };
    } catch (err) {
      console.error("[LiveAudioPlayer] Playback error:", err);
    }
  }

  /**
   * Barge-in handler: instantly stops all scheduled sources and flushes the queue
   */
  interrupt() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Source might have already finished
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
  }

  /**
   * Returns current frequency data for rendering audio waveform in UI
   */
  getFrequencyData(targetArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(targetArray);
    } else {
      targetArray.fill(0);
    }
  }

  /**
   * Check if model is currently producing audio, including queued chunks and reverb decay.
   */
  get isSpeaking(): boolean {
    if (!this.audioCtx) return false;
    return (
      this.activeSources.length > 0 ||
      this.audioCtx.currentTime < this.nextStartTime + 0.25
    );
  }

  /**
   * Cleanly closes the player
   */
  close() {
    this.interrupt();
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
