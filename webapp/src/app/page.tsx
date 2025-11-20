import { AmbientAudio } from "../components/AmbientAudio";
import { GlassWatermelonScene } from "../components/GlassWatermelonScene";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-bl from-emerald-900 via-slate-950 to-slate-900 p-6 text-white">
      <div className="relative flex w-full max-w-[min(720px,60vh)] flex-col items-center justify-center">
        <div
          className="relative w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(80,255,210,0.25)] backdrop-blur-xl"
          style={{ aspectRatio: "9 / 16" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-200/20 via-transparent to-slate-950/60" />
          <div className="absolute inset-0">
            <GlassWatermelonScene />
          </div>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.6em] text-emerald-100/70">
                Immersive ASMR
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-emerald-50">
                Glass Watermelon Cutting
              </h1>
            </div>
            <div className="mx-auto w-full max-w-[85%] rounded-full border border-white/20 bg-black/30 px-6 py-3 text-center text-sm font-medium text-emerald-100/80 shadow-inner shadow-emerald-200/20 backdrop-blur">
              Glide through crystalline slices in soothing 3D.
            </div>
          </div>
          <AmbientAudio />
        </div>
        <div className="mt-6 text-center text-sm text-emerald-100/60">
          Optimized for vertical 9:16 playback · Looping animation · Generative
          soundscape
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 -left-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  );
}
