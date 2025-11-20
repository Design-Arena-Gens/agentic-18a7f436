"use client";

import { useEffect, useRef, useState } from "react";

type AudioBundle = {
  context: AudioContext;
  noise: AudioBufferSourceNode;
  shimmer: OscillatorNode;
  lfo: OscillatorNode;
  shimmerGain: GainNode;
};

function buildNoiseBuffer(context: AudioContext) {
  const duration = 4;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    const progress = i / data.length;
    const envelope = Math.pow(1 - Math.abs(0.5 - progress) * 2, 1.8);
    data[i] = (Math.random() * 2 - 1) * envelope * 0.6;
  }

  return buffer;
}

function initAudio(): AudioBundle {
  const context = new AudioContext({ latencyHint: "interactive" });
  const mainGain = context.createGain();
  mainGain.gain.value = 0.2;
  mainGain.connect(context.destination);

  const noise = context.createBufferSource();
  noise.buffer = buildNoiseBuffer(context);
  noise.loop = true;

  const lowPass = context.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.value = 1800;
  lowPass.Q.value = 0.8;
  noise.connect(lowPass);

  const dripGain = context.createGain();
  dripGain.gain.value = 0.35;
  lowPass.connect(dripGain);
  dripGain.connect(mainGain);

  noise.start();

  const shimmer = context.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = 420;

  const shimmerGain = context.createGain();
  shimmerGain.gain.value = 0.0001;

  const lfo = context.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.28;

  const lfoGain = context.createGain();
  lfoGain.gain.value = 0.12;

  lfo.connect(lfoGain);
  lfoGain.connect(shimmerGain.gain);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(mainGain);

  shimmer.start();
  lfo.start();

  return { context, noise, shimmer, lfo, shimmerGain };
}

export function AmbientAudio() {
  const bundleRef = useRef<AudioBundle | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      const bundle = bundleRef.current;
      bundle?.noise.stop();
      bundle?.shimmer.stop();
      bundle?.lfo.stop();
      bundle?.context.close();
    };
  }, []);

  async function handleStart() {
    try {
      setPending(true);
      if (!bundleRef.current) {
        bundleRef.current = initAudio();
      }
      if (bundleRef.current.context.state === "suspended") {
        await bundleRef.current.context.resume();
      }
      setReady(true);
    } catch (error) {
      console.error("Failed to start ASMR audio", error);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-6">
      <button
        type="button"
        onClick={handleStart}
        disabled={ready}
        className="pointer-events-auto rounded-full bg-white/25 px-6 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-emerald-200/40 disabled:cursor-default disabled:bg-white/10 disabled:text-emerald-50"
      >
        {ready ? "ASMR Active" : pending ? "Priming..." : "Tap for ASMR Audio"}
      </button>
    </div>
  );
}
